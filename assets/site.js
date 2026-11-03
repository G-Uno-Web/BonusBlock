/* BonusBlock · 站内页面共享数据与多语言引擎
   浏览器：渲染框架文案 / 法律文档 / 语言下拉
   Node：module.exports 供 tools/build.js 复用同一份数据生成静态中文兜底 */
(function(){
  'use strict';

  var LANGS = ['zh-CN','zh-TW','en','ja','ko','es','fr','de','pt','ru','id','vi'];
  var NAMES = ['简体中文','繁體中文','English','日本語','한국어','Español','Français','Deutsch','Português','Русский','Bahasa Indonesia','Tiếng Việt'];

  /* UI 数组顺序：home, guides, about, privacy, contact, disclaimer, legal, updated, rights, langTitle, back */
  var UI = {
    'zh-CN':['首页','资讯指南','关于我们','隐私政策','联系我们','免责声明','法律与合规','最近更新：2026 年 11 月','© 2026 BonusBlock · 独立资讯站，非交易所官方','选择语言 / Language','← 返回首页'],
    'zh-TW':['首頁','資訊指南','關於我們','隱私政策','聯絡我們','免責聲明','法律與合規','最近更新：2026 年 11 月','© 2026 BonusBlock · 獨立資訊站，非交易所官方','選擇語言 / Language','← 返回首頁'],
    'en':['Home','Guides','About Us','Privacy Policy','Contact','Disclaimer','Legal','Last updated: November 2026','© 2026 BonusBlock · Independent site, not operated by any exchange','Language','← Back to home'],
    'ja':['ホーム','ガイド','私たちについて','プライバシーポリシー','お問い合わせ','免責事項','法務','最終更新：2026 年 11 月','© 2026 BonusBlock · 取引所とは無関係の独立サイト','言語 / Language','← ホームに戻る'],
    'ko':['홈','가이드','소개','개인정보처리방침','문의하기','면책조항','법적 고지','최종 업데이트: 2026년 11월','© 2026 BonusBlock · 거래소와 무관한 독립 사이트','언어 / Language','← 홈으로'],
    'es':['Inicio','Guías','Sobre nosotros','Política de privacidad','Contacto','Aviso legal','Legal','Última actualización: noviembre de 2026','© 2026 BonusBlock · Sitio independiente, no operado por ningún exchange','Idioma / Language','← Volver al inicio'],
    'fr':['Accueil','Guides','À propos','Politique de confidentialité','Contact','Avertissement','Mentions légales','Dernière mise à jour : novembre 2026','© 2026 BonusBlock · Site indépendant, non exploité par un exchange','Langue / Language','← Retour à l’accueil'],
    'de':['Start','Ratgeber','Über uns','Datenschutz','Kontakt','Haftungsausschluss','Rechtliches','Zuletzt aktualisiert: November 2026','© 2026 BonusBlock · Unabhängige Seite, nicht von einer Börse betrieben','Sprache / Language','← Zurück zur Startseite'],
    'pt':['Início','Guias','Sobre nós','Política de privacidade','Contato','Aviso legal','Jurídico','Última atualização: novembro de 2026','© 2026 BonusBlock · Site independente, não operado por nenhuma exchange','Idioma / Language','← Voltar ao início'],
    'ru':['Главная','Гайды','О нас','Политика конфиденциальности','Контакты','Отказ от ответственности','Правовая информация','Обновлено: ноябрь 2026','© 2026 BonusBlock · Независимый сайт, не управляемый биржей','Язык / Language','← На главную'],
    'id':['Beranda','Panduan','Tentang Kami','Kebijakan Privasi','Kontak','Penafian','Legal','Diperbarui: November 2026','© 2026 BonusBlock · Situs independen, tidak dikelola bursa','Bahasa / Language','← Kembali ke beranda'],
    'vi':['Trang chủ','Hướng dẫn','Về chúng tôi','Chính sách quyền riêng tư','Liên hệ','Miễn trừ','Pháp lý','Cập nhật: tháng 11/2026','© 2026 BonusBlock · Trang độc lập, không do sàn vận hành','Ngôn ngữ / Language','← Về trang chủ']
  };

  /* 文档：title 提供 12 语言；intro / items / foot 提供中简、中繁、英三版，其余语种回落英文 */
  var DOCS = {
    privacy: {
      title:['隐私政策','隱私政策','Privacy Policy','プライバシーポリシー','개인정보처리방침','Política de privacidad','Politique de confidentialité','Datenschutzerklärung','Política de privacidade','Политика конфиденциальности','Kebijakan Privasi','Chính sách quyền riêng tư'],
      intro:{
        'zh-CN':'本页说明 BonusBlock 在你访问本站时如何处理相关信息。本站是纯静态网站，没有账号系统，不要求你提交姓名、邮箱或身份信息。',
        'zh-TW':'本頁說明 BonusBlock 在你造訪本站時如何處理相關資訊。本站是純靜態網站，沒有帳號系統，不要求你提交姓名、信箱或身分資訊。',
        en:'This page explains how BonusBlock handles information when you visit. The site is fully static, has no account system, and never asks you to submit a name, email address or identity document.'
      },
      items:{
        'zh-CN':[
          '行情数据由你的浏览器直接向公开市场接口请求，我们不在服务器端保存你的请求记录、IP 地址或任何交易行为。',
          '我们使用浏览器本地存储（localStorage）记住语言偏好与涨跌配色；清除浏览器数据即可随时删除这些设置。',
          '本站可能展示第三方广告（如 Google AdSense）与统计服务，它们会依据自身政策使用 Cookie；你可在浏览器设置或广告偏好中心关闭个性化广告。',
          '为按 IP 显示默认语言，页面会调用公开的 IP 归属地接口；该请求由你的浏览器发出，我们不存储返回的地理位置结果。',
          '我们不出售、出租或与第三方共享个人信息；除法律法规明确要求外，也不会主动向任何机构提供访问记录。'
        ],
        'zh-TW':[
          '行情資料由你的瀏覽器直接向公開市場介面請求，我們不在伺服器端保存你的請求紀錄、IP 位址或任何交易行為。',
          '我們使用瀏覽器本機儲存（localStorage）記住語言偏好與漲跌配色；清除瀏覽器資料即可隨時刪除這些設定。',
          '本站可能展示第三方廣告（如 Google AdSense）與統計服務，它們會依據自身政策使用 Cookie；你可在瀏覽器設定或廣告偏好中心關閉個人化廣告。',
          '為按 IP 顯示預設語言，頁面會呼叫公開的 IP 歸屬地介面；該請求由你的瀏覽器發出，我們不儲存回傳的地理位置結果。',
          '我們不出售、出租或與第三方分享個人資訊；除法律法規明確要求外，也不會主動向任何機構提供造訪紀錄。'
        ],
        en:[
          'Market data is requested directly by your browser from public market APIs. We do not store your requests, IP address or any trading activity on a server.',
          'We use browser localStorage to remember your language preference and colour scheme. Clearing browser data removes these settings at any time.',
          'The site may display third-party ads (such as Google AdSense) and analytics services, which use cookies under their own policies. You can disable personalised ads in your browser settings or ad preference centre.',
          'To pick a default language by IP, the page calls a public IP-geolocation endpoint. That request is made by your browser and we do not retain the returned location.',
          'We do not sell, rent or share personal information with third parties, and do not provide access records to any organisation unless required by law.'
        ]
      },
      foot:{
        'zh-CN':'本政策可能随功能调整而更新，更新后的版本会直接发布在本页。如对数据处理有疑问，请通过「联系我们」页面反馈。',
        'zh-TW':'本政策可能隨功能調整而更新，更新後的版本會直接發布於本頁。如對資料處理有疑問，請透過「聯絡我們」頁面回饋。',
        en:'This policy may be updated as features change; the current version is always published on this page. For questions about data handling, use the Contact page.'
      }
    },
    about: {
      title:['关于我们','關於我們','About Us','私たちについて','소개','Sobre nosotros','À propos','Über uns','Sobre nós','О нас','Tentang Kami','Về chúng tôi'],
      intro:{
        'zh-CN':'BonusBlock 是一个独立运营的加密货币行情资讯站点，提供公开市场数据展示与原创入门内容。',
        'zh-TW':'BonusBlock 是一個獨立營運的加密貨幣行情資訊站點，提供公開市場資料展示與原創入門內容。',
        en:'BonusBlock is an independently operated crypto information site offering public market data and original educational content.'
      },
      items:{
        'zh-CN':[
          '我们不是币安（Binance）或任何交易所的官方网站、分支机构或代理商，与交易所之间不存在授权、隶属或雇佣关系。',
          '行情区展示主流币种的实时价格、24 小时涨跌幅与高低价；数据来自公开市场接口，默认每 30 秒刷新，仅供参考。',
          '「资讯指南」栏目由本站独立撰写，聚焦基础概念、数据解读、资产安全与风险管理；我们不代客理财，也不提供投资建议。',
          '本站通过邀请（返佣）链接与展示广告获得收入：若你通过链接注册并交易，我们可能获得平台佣金，你无需为此支付额外费用。',
          '商业关系不影响行情数据的展示方式或文章内容立场；活动细则、费率与权益一律以交易所官方页面公布内容为准。'
        ],
        'zh-TW':[
          '我們不是幣安（Binance）或任何交易所的官方網站、分支機構或代理商，與交易所之間不存在授權、隸屬或僱傭關係。',
          '行情區展示主流幣種的即時價格、24 小時漲跌幅與高低價；資料來自公開市場介面，預設每 30 秒刷新，僅供參考。',
          '「資訊指南」欄目由本站獨立撰寫，聚焦基礎概念、資料解讀、資產安全與風險管理；我們不代客理財，也不提供投資建議。',
          '本站透過邀請（返佣）連結與展示廣告獲得收入：若你透過連結註冊並交易，我們可能獲得平台佣金，你無需為此支付額外費用。',
          '商業關係不影響行情資料的展示方式或文章內容立場；活動細則、費率與權益一律以交易所官方頁面公布內容為準。'
        ],
        en:[
          'We are not the official website, branch or agent of Binance or any exchange, and have no authorisation, affiliation or employment relationship with any exchange.',
          'The market section shows live prices, 24-hour change and high/low for major coins. Data comes from public market APIs and refreshes every 30 seconds by default; it is for reference only.',
          'The Guides section is written independently by this site and covers fundamentals, data interpretation, asset security and risk management. We do not manage funds and give no investment advice.',
          'The site earns revenue through affiliate (referral) links and display ads. If you register and trade through our links we may receive a commission from the platform, at no extra cost to you.',
          'Commercial relationships do not affect how market data is shown or the position of our articles. Promotion rules, fees and rewards are set solely by the exchange on its official pages.'
        ]
      },
      foot:{
        'zh-CN':'本站内容以简体中文撰写并附英文摘要，界面支持 12 种语言。内容如有错漏，欢迎通过「联系我们」指出。',
        'zh-TW':'本站內容以簡體中文撰寫並附英文摘要，介面支援 12 種語言。內容如有錯漏，歡迎透過「聯絡我們」指出。',
        en:'Our articles are written in Simplified Chinese with an English summary, and the interface supports 12 languages. Corrections are welcome via the Contact page.'
      }
    },
    contact: {
      title:['联系我们','聯絡我們','Contact Us','お問い合わせ','문의하기','Contacto','Contact','Kontakt','Contato','Контакты','Kontak','Liên hệ'],
      intro:{
        'zh-CN':'本站为个人运营的轻量资讯项目，不设客服团队，也不提供交易、注册或资产相关服务。',
        'zh-TW':'本站為個人營運的輕量資訊專案，不設客服團隊，也不提供交易、註冊或資產相關服務。',
        en:'This site is a lightweight, independently run information project. There is no support team, and we do not provide trading, registration or asset-related services.'
      },
      items:{
        'zh-CN':[
          '内容纠错、事实核查或合规相关问题，请在项目代码仓库提交 Issue：github.com/G-Uno-Web/BonusBlock/issues。',
          '我们不接受代注册、代客理财、投资咨询或广告投放报价等请求，也不会主动联系你索要密码、验证码或助记词。',
          '若你的交易所账号、充值、提现或资产出现异常，请直接联系该交易所官方客服；本站无法查询或处理任何账户事务。',
          '涉及内容合作或版权问题的来信，我们会在力所能及的范围内回复；不保证即时响应，也不承诺任何处理结果。',
          '请勿通过任何渠道向我们发送助记词、私钥、身份证照片或银行卡信息；收到此类信息我们会直接删除且不另行回复。'
        ],
        'zh-TW':[
          '內容糾錯、事實查核或合規相關問題，請在專案程式碼儲存庫提交 Issue：github.com/G-Uno-Web/BonusBlock/issues。',
          '我們不接受代註冊、代客理財、投資諮詢或廣告投放報價等請求，也不會主動聯繫你索取密碼、驗證碼或助記詞。',
          '若你的交易所帳號、充值、提現或資產出現異常，請直接聯繫該交易所官方客服；本站無法查詢或處理任何帳戶事務。',
          '涉及內容合作或版權問題的來信，我們會在力所能及的範圍內回覆；不保證即時回應，也不承諾任何處理結果。',
          '請勿透過任何管道向我們發送助記詞、私鑰、身分證照片或銀行卡資訊；收到此類資訊我們會直接刪除且不另行回覆。'
        ],
        en:[
          'For corrections, fact-checking or compliance matters, please open an Issue in the project repository: github.com/G-Uno-Web/BonusBlock/issues.',
          'We do not accept requests to register accounts, manage funds, give investment advice or quote advertising deals, and we will never contact you asking for a password, verification code or seed phrase.',
          'If your exchange account, deposit, withdrawal or assets show a problem, contact that exchange’s official support directly. We cannot view or handle any account matter.',
          'Messages about content collaboration or copyright will be answered where we can. We do not guarantee a prompt reply or any particular outcome.',
          'Never send us a seed phrase, private key, identity document photo or bank card details. Such messages are deleted without reply.'
        ]
      },
      foot:{
        'zh-CN':'本站不设公开客服邮箱与电话，正式沟通均通过仓库 Issue 进行，以便留痕与公开核对。若你希望增设邮箱，请以官方域名自行添加。',
        'zh-TW':'本站不設公開客服信箱與電話，正式溝通均透過儲存庫 Issue 進行，以便留痕與公開核對。若你希望增設信箱，請以官方網域自行新增。',
        en:'There is no public support email or phone number; formal communication takes place through repository Issues so it stays traceable and public. If you wish to add an email, do so under your own official domain.'
      }
    },
    disclaimer: {
      title:['免责声明与返佣披露','免責聲明與返佣揭露','Disclaimer & Affiliate Disclosure','免責事項とアフィリエイト開示','면책조항 및 제휴 공개','Aviso legal y divulgación de afiliados','Avertissement et divulgation d’affiliation','Haftungsausschluss und Affiliate-Offenlegung','Aviso legal e divulgação de afiliados','Отказ от ответственности и раскрытие партнёрских связей','Penafian & Pengungkapan Afiliasi','Miễn trừ & Công bố liên kết tiếp thị'],
      intro:{
        'zh-CN':'使用本站即表示你已阅读并理解以下条款。若你不同意其中任何一条，请停止使用并关闭页面。',
        'zh-TW':'使用本站即表示你已閱讀並理解以下條款。若你不同意其中任何一條，請停止使用並關閉頁面。',
        en:'By using this site you confirm that you have read and understood the terms below. If you disagree with any of them, please stop using the site and close the page.'
      },
      items:{
        'zh-CN':[
          '本站为独立资讯站点，与币安（Binance）及任何交易所无隶属、授权或代理关系；页面视觉、文案与域名均不代表交易所官方。',
          '本页含邀请（返佣）链接。你通过其注册或交易后，我们可能从平台获得推广佣金；该佣金不增加你的任何费用，但可能构成利益冲突，请知悉。',
          '本站可能展示第三方广告（含 Google AdSense）。广告内容与投放由第三方决定，我们不对广告中的产品描述、收益承诺或外部链接负责。',
          '所有行情数据按「原样」提供，可能存在延迟、中断或误差，不构成任何投资建议、要约或收益承诺；实际成交价格以交易所官方页面为准。',
          '虚拟资产价格波动剧烈，可能导致本金全部损失；相关业务在部分司法辖区受到严格监管或被禁止，请自行评估风险并遵守所在地法律法规。'
        ],
        'zh-TW':[
          '本站為獨立資訊站點，與幣安（Binance）及任何交易所無隸屬、授權或代理關係；頁面視覺、文案與網域名稱均不代表交易所官方。',
          '本頁含邀請（返佣）連結。你透過其註冊或交易後，我們可能從平台獲得推廣佣金；該佣金不增加你的任何費用，但可能構成利益衝突，請知悉。',
          '本站可能展示第三方廣告（含 Google AdSense）。廣告內容與投放由第三方決定，我們不對廣告中的產品描述、收益承諾或外部連結負責。',
          '所有行情資料按「原樣」提供，可能存在延遲、中斷或誤差，不構成任何投資建議、要約或收益承諾；實際成交價格以交易所官方頁面為準。',
          '虛擬資產價格波動劇烈，可能導致本金全部損失；相關業務在部分司法轄區受到嚴格監管或被禁止，請自行評估風險並遵守所在地法律法規。'
        ],
        en:[
          'This is an independent information site with no affiliation, authorisation or agency relationship with Binance or any exchange. Its visuals, copy and domain do not represent an official exchange presence.',
          'This page contains affiliate (referral) links. If you register or trade through them we may earn a commission from the platform. It adds no cost to you, but may create a conflict of interest — please be aware of it.',
          'The site may display third-party ads (including Google AdSense). Ad content and delivery are controlled by third parties; we are not responsible for product claims, return promises or external links in those ads.',
          'All market data is provided as is and may be delayed, interrupted or inaccurate. It is not investment advice, an offer, or a promise of returns. Your actual fill price is determined by the exchange.',
          'Virtual asset prices are highly volatile and you may lose your entire principal. Related activities are strictly regulated or prohibited in some jurisdictions; assess the risk yourself and comply with local law.'
        ]
      },
      foot:{
        'zh-CN':'外部链接指向的站点由第三方运营，本站不对其内容、安全性或隐私实践负责。条款更新后直接发布于本页，不另行通知。',
        'zh-TW':'外部連結指向的站點由第三方營運，本站不對其內容、安全性或隱私實踐負責。條款更新後直接發布於本頁，不另行通知。',
        en:'Linked sites are operated by third parties and we are not responsible for their content, security or privacy practices. Updated terms are published on this page without separate notice.'
      }
    }
  };

  var DATA = {LANGS:LANGS, NAMES:NAMES, UI:UI, DOCS:DOCS};
  if(typeof module !== 'undefined' && module.exports) module.exports = DATA;
  if(typeof document === 'undefined') return;

  /* ---------- 浏览器渲染 ---------- */
  var KEY = 'binanceInviteLang';
  var UI_INDEX = {home:0, guides:1, about:2, privacy:3, contact:4, disclaimer:5, legal:6, updated:7, rights:8, back:10};

  function pick(initial){
    var q = null;
    try{ q = new URLSearchParams(location.search).get('lang'); }catch(e){}
    if(q && LANGS.indexOf(q) >= 0) return q;
    var stored = null;
    try{ stored = localStorage.getItem(KEY); }catch(e){}
    if(stored && stored !== 'auto' && LANGS.indexOf(stored) >= 0) return stored;
    var nav = (navigator.language || 'en').toLowerCase();
    for(var i=0;i<LANGS.length;i++){ if(LANGS[i].toLowerCase() === nav) return LANGS[i]; }
    var short = nav.slice(0,2);
    for(var j=0;j<LANGS.length;j++){ if(LANGS[j].toLowerCase().slice(0,2) === short) return LANGS[j]; }
    return 'en';
  }

  function render(lang, manual){
    if(LANGS.indexOf(lang) < 0) lang = 'en';
    var ui = UI[lang] || UI.en;
    document.documentElement.lang = lang;

    var nodes = document.querySelectorAll('[data-ui]');
    for(var i=0;i<nodes.length;i++){
      var k = nodes[i].getAttribute('data-ui');
      if(UI_INDEX[k] !== undefined) nodes[i].textContent = ui[UI_INDEX[k]];
    }
    var sel = document.getElementById('langSelect');
    if(sel){
      if(!sel.options.length){
        for(var n=0;n<LANGS.length;n++){
          var o = document.createElement('option');
          o.value = LANGS[n]; o.textContent = NAMES[n];
          sel.appendChild(o);
        }
      }
      sel.value = lang;
      sel.setAttribute('aria-label', ui[9]);
    }

    var docKey = document.body.getAttribute('data-doc');
    if(docKey && DOCS[docKey]){
      var d = DOCS[docKey];
      var body = document.getElementById('docBody');
      if(body){
        var title = d.title[LANGS.indexOf(lang)] || d.title[2];
        var intro = d.intro[lang] || d.intro.en;
        var items = d.items[lang] || d.items.en;
        var foot = d.foot[lang] || d.foot.en;
        var html = '<h1>' + title + '</h1><p class="lead">' + intro + '</p>';
        for(var x=0;x<items.length;x++){
          html += '<div class="doc-item"><span class="num">' + String(x+1).padStart(2,'0') + '</span><p>' + items[x] + '</p></div>';
        }
        html += '<div class="doc-foot">' + foot + '</div>';
        body.innerHTML = html;
        document.title = title + ' · BonusBlock';
      }
    }
    if(manual){ try{ localStorage.setItem(KEY, lang); }catch(e){} }
  }

  var lang = pick();
  render(lang, false);
  var sel = document.getElementById('langSelect');
  if(sel) sel.addEventListener('change', function(){ render(this.value, true); });
})();
