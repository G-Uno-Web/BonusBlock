/* BonusBlock 静态站自检：语法 / 链接 / 语言数据 / 广告配置 / HTTP 冒烟
   用法：node tools/verify.js */
const fs = require('fs');
const path = require('path');
const http = require('http');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
let failures = 0;
function ok(name, cond, extra){
  console.log((cond ? '  PASS  ' : '  FAIL  ') + name + (extra ? ' | ' + extra : ''));
  if(!cond) failures++;
}
function read(rel){ return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function exists(rel){ return fs.existsSync(path.join(ROOT, rel)); }

/* 1. JS 语法 */
console.log('\n[1] JavaScript syntax');
const indexHtml = read('index.html');
const inline = indexHtml.split('<script>')[1].split('</script>')[0];
let synOk = true;
try{ new Function(inline); }catch(e){ synOk = false; console.log('    ' + e.message); }
ok('index.html inline script', synOk, inline.length + ' chars');
try{ new Function(read('assets/site.js')); ok('assets/site.js', true); }
catch(e){ ok('assets/site.js', false, e.message); }
try{ new Function(read('tools/build.js')); ok('tools/build.js', true); }
catch(e){ ok('tools/build.js', false, e.message); }

/* 2. 首页关键内容 */
console.log('\n[2] Homepage content');
ok('brand de-officialised (no BINANCE INVITE)', !/BINANCE\s+INVITE|>BINANCE</i.test(indexHtml));
ok('invite code URPCIHGD present', indexHtml.indexOf('URPCIHGD') > -1);
ok('referral link bsmkweb.net present', indexHtml.indexOf('https://www.bsmkweb.net/register?ref=URPCIHGD') > -1);
const ctaCount = (indexHtml.match(/<a[^>]*\bdata-reg\b/g) || []).length;
ok('registration CTAs = 5', ctaCount === 5, 'found ' + ctaCount);
ok('disclosure block present', indexHtml.indexOf('id="disBody"') > -1);
ok('insights section present', indexHtml.indexOf('id="insGrid"') > -1);
ok('legal links in footer', ['about.html','privacy.html','contact.html','disclaimer.html'].every(f => indexHtml.indexOf(f) > -1));

/* 3. 多语言数据 */
console.log('\n[3] i18n data (assets/site.js)');
const DATA = require(path.join(ROOT, 'assets', 'site.js'));
ok('12 languages', DATA.LANGS.length === 12);
const uiBad = DATA.LANGS.filter(l => !Array.isArray(DATA.UI[l]) || DATA.UI[l].length !== 11);
ok('all 12 UI packs have 11 slots', uiBad.length === 0, uiBad.join(',') || 'none');
const docKeys = Object.keys(DATA.DOCS);
ok('4 legal documents', docKeys.length === 4, docKeys.join(','));
let docBad = [];
docKeys.forEach(k => {
  const d = DATA.DOCS[k];
  if(!d.title || d.title.length !== 12) docBad.push(k + ':title');
  ['zh-CN','zh-TW','en'].forEach(l => {
    if(!d.intro[l]) docBad.push(k + ':intro:' + l);
    if(!d.items[l] || d.items[l].length !== 5) docBad.push(k + ':items:' + l);
    if(!d.foot[l]) docBad.push(k + ':foot:' + l);
  });
});
ok('titles x12 + intro/items/foot x3 complete', docBad.length === 0, docBad.join(',') || 'none');

/* 4. site.js 运行时（含 12 语言切换回落） */
console.log('\n[4] site.js runtime');
function El(attrs){
  return {
    textContent:'', innerHTML:'', value:'', options:[], _attrs:attrs || {}, _cb:null,
    getAttribute(k){ return this._attrs[k] !== undefined ? this._attrs[k] : null; },
    setAttribute(){}, appendChild(o){ this.options.push(o); },
    addEventListener(ev, cb){ this._cb = cb; }
  };
}
const uiNodes = ['home','guides','about','privacy','contact','disclaimer','legal','updated','rights','back']
  .map(k => El({'data-ui':k}));
const docBody = El({}), langSelect = El({});
const docStub = {
  documentElement:{lang:''}, title:'', body:El({'data-doc':'privacy'}),
  querySelectorAll(sel){ return sel === '[data-ui]' ? uiNodes : []; },
  getElementById(id){ return id === 'docBody' ? docBody : (id === 'langSelect' ? langSelect : null); },
  createElement(){ return El({}); }
};
const sandbox = {
  document:docStub, navigator:{language:'zh-CN'}, location:{search:''},
  localStorage:{getItem:()=>null, setItem:()=>{}}, URLSearchParams, console, module:{exports:{}}
};
let runtimeOk = true;
try{ vm.runInNewContext(read('assets/site.js'), sandbox); }
catch(e){ runtimeOk = false; console.log('    ' + e.message); }
ok('initial render (zh-CN) no exception', runtimeOk);
ok('langSelect has 12 options', langSelect.options.length === 12, 'got ' + langSelect.options.length);
ok('rendered 5 numbered clauses', (docBody.innerHTML.match(/doc-item/g) || []).length === 5);
ok('document.title set', docStub.title.indexOf('隐私政策') > -1, docStub.title);
let switchBad = [];
DATA.LANGS.forEach(l => {
  try{
    langSelect.value = l;
    langSelect._cb.call(langSelect);
    const expected = DATA.DOCS.privacy.title[DATA.LANGS.indexOf(l)];
    if(docStub.title.indexOf(expected) < 0) switchBad.push(l + ':title');
    if((docBody.innerHTML.match(/doc-item/g) || []).length !== 5) switchBad.push(l + ':items');
    if(uiNodes[0].textContent !== DATA.UI[l][0]) switchBad.push(l + ':ui');
  }catch(e){ switchBad.push(l + ':' + e.message); }
});
ok('all 12 language switches render correctly', switchBad.length === 0, switchBad.join(',') || 'none');

/* 5. 生成页面与内部链接 */
console.log('\n[5] Generated pages & links');
const htmlFiles = [];
function walk(dir){
  for(const e of fs.readdirSync(path.join(ROOT, dir), {withFileTypes:true})){
    const rel = path.join(dir, e.name).replace(/\\/g, '/');
    if(e.isDirectory()) walk(rel);
    else if(e.name.endsWith('.html')) htmlFiles.push(rel);
  }
}
walk('.');
ok('HTML pages = 11', htmlFiles.length === 11, htmlFiles.length + ' files');
const slugs = ['bitcoin-basics','how-to-read-market','spot-vs-contract','wallet-security','risk-management','data-sources'];
ok('6 article pages exist', slugs.every(s => exists('articles/' + s + '.html')));
ok('4 legal pages exist', docKeys.every(k => exists(k + '.html')));

let broken = [];
htmlFiles.forEach(f => {
  const src = read(f);
  const re = /<(?:a|link|script)\b[^>]*?(?:href|src)="([^"]+)"/g;
  let m;
  while((m = re.exec(src))){
    const v = m[1];
    if(/^(https?:|#|data:|mailto:|\/\/)/.test(v)) continue;
    if(/['"]\s*\+|\+\s*['"]/.test(v)) continue; // JS 动态拼接的片段，不是真实链接
    const clean = v.split('#')[0].split('?')[0];
    if(!clean) continue;
    const target = path.normalize(path.join(path.dirname(f), clean)).replace(/\\/g, '/');
    if(!exists(target)) broken.push(f + ' -> ' + v);
  }
});
ok('no broken relative links', broken.length === 0, broken.join(' ; ') || 'none');

let staticBad = [];
docKeys.forEach(k => {
  const s = read(k + '.html');
  if((s.match(/class="doc-item"/g) || []).length !== 5) staticBad.push(k + ':clauses');
  if(!/data-doc="/.test(s)) staticBad.push(k + ':docAttr');
});
ok('legal pages contain static Chinese fallback', staticBad.length === 0, staticBad.join(',') || 'none');

let thin = [];
slugs.forEach(s => {
  const src = read('articles/' + s + '.html');
  const body = src.replace(/<[^>]+>/g, '').replace(/\s+/g, '');
  if(body.length < 900) thin.push(s + ':' + body.length);
  if(!/ENGLISH SUMMARY/.test(src)) thin.push(s + ':no-en-summary');
});
ok('articles are substantive (not placeholders)', thin.length === 0, thin.join(',') || 'all >900 chars');

/* 6. ads.txt / sitemap / robots */
console.log('\n[6] Monetisation files');
const ads = read('ads.txt');
const activeAds = ads.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
ok('ads.txt has no uncommented fake publisher ID', activeAds.length === 0, activeAds.join(' | ') || 'clean');
ok('ads.txt documents the real line to add', ads.indexOf('google.com, pub-') > -1);
const sitemap = read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
ok('sitemap lists 11 URLs', urls.length === 11, 'got ' + urls.length);
const missingSitemap = urls.filter(u => !exists(u.replace('https://g-uno-web.github.io/BonusBlock/','')));
ok('every sitemap URL maps to a file', missingSitemap.length === 0, missingSitemap.join(',') || 'none');
ok('robots allows Mediapartners-Google', /User-agent: Mediapartners-Google/.test(read('robots.txt')));

/* 7. HTTP 冒烟 */
console.log('\n[7] HTTP smoke');
const MIME = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\//,'') || 'index.html';
  const p = path.join(ROOT, rel);
  if(!fs.existsSync(p) || !fs.statSync(p).isFile()){ res.writeHead(404); res.end('404'); return; }
  res.writeHead(200, {'Content-Type': MIME[path.extname(p)] || 'application/octet-stream'});
  res.end(fs.readFileSync(p));
});
server.listen(0, async () => {
  const port = server.address().port;
  const targets = ['/', '/privacy.html', '/about.html', '/contact.html', '/disclaimer.html',
    '/articles/bitcoin-basics.html', '/articles/data-sources.html',
    '/assets/site.css', '/assets/site.js', '/ads.txt', '/sitemap.xml', '/robots.txt'];
  let httpBad = [];
  for(const t of targets){
    try{
      const r = await fetch('http://127.0.0.1:' + port + t);
      const body = await r.text();
      if(r.status !== 200 || body.length < 40) httpBad.push(t + ':' + r.status + '/' + body.length);
    }catch(e){ httpBad.push(t + ':' + e.message); }
  }
  ok('12 URLs return HTTP 200 with content', httpBad.length === 0, httpBad.join(' , ') || 'all ok');
  server.close();
  console.log('\n' + (failures ? 'FAILED: ' + failures + ' check(s)' : 'ALL CHECKS PASSED'));
  process.exit(failures ? 1 : 0);
});
