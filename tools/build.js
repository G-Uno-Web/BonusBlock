/* BonusBlock 静态页生成器
   用法：node tools/build.js
   生成：4 个法律页、6 篇原创文章、ads.txt / sitemap.xml / robots.txt
   法律页的中文静态正文直接取自 assets/site.js，避免两处维护不一致。 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DATA = require(path.join(ROOT, 'assets', 'site.js'));
const BASE = 'https://g-uno-web.github.io/BonusBlock/';

function w(rel, content){
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), {recursive:true});
  fs.writeFileSync(p, content, 'utf8');
  return rel;
}

/* ---------------- 6 篇原创文章 ---------------- */
const A = [
  {
    slug:'bitcoin-basics', tag:'新手入门', min:'约 6 分钟',
    title:'比特币是什么：从账本问题到区块链',
    abstract:'不谈价格，先讲清楚它到底解决了什么问题：谁记账、怎么防止篡改、为什么总量常被说成 2100 万，以及它并不等于「更便宜的支付」。',
    en:'A price-free introduction to Bitcoin: the double-spend problem, a ledger replicated across thousands of nodes, why rewriting history is expensive, where the 21 million cap comes from, and what Bitcoin is not (a cheap payment rail).',
    sections:[
      {h:'一、它要解决的其实是一个很老的问题', html:`<p>数字文件可以无限复制。如果一份「余额」只是一个文件，那么同一笔钱理论上可以被花两次，这就是所谓<strong>双花问题</strong>。在比特币之前，解决办法基本只有一种：找一个大家都信任的中心机构，由它维护唯一一本账，并负责确认每笔转账是否有效。</p><p>这个方案运转得很好，但代价是：你必须信任记账方不会记错、不会篡改、不会拒绝某笔交易，也不会因为自身故障让整本账停摆。比特币想问的是，能不能在<strong>没有任何单一可信方</strong>的前提下，让一群互不认识的人对「谁有多少钱」达成一致。</p>`},
      {h:'二、把账本复制给所有人', html:`<p>它的做法很朴素：不再只留一本账，而是让网络里的每个全节点都保存一份完整副本。一笔交易发出后会被广播到全网，节点各自检查签名与余额是否合法，然后由矿工把一批合法交易打包成「区块」，追加到链上。</p><p>于是「余额」不再是某个服务器里的数字，而是<strong>全网共同认可的历史记录</strong>。你想知道某个地址有多少钱，不需要问谁，把这份历史从头算一遍即可。这也是为什么交易所里的「账户余额」和链上余额是两回事：前者是平台内部数据库的一行记录，后者才是区块链共识的结果。</p>`},
      {h:'三、为什么改历史很难', html:`<p>每个区块都包含前一个区块的哈希值，串成一条链。改动其中任何一笔交易，后面所有区块的哈希都会对不上，必须全部重算。而重算需要付出<strong>工作量证明</strong>的成本——大量试错式的哈希计算与电力。</p><p>更关键的是，攻击者必须比 honest 的全网算力更快，才能在自己那条链上追上并超过主链。因此「不可篡改」不是数学上绝对不可能，而是<strong>经济上极不划算</strong>：确认数越多，推翻成本越高。这也是为什么大额转账通常要等若干个确认，而不是看到一笔就当最终结算。</p>`},
      {h:'四、2100 万从哪来', html:`<p>常见误解是「代码里写死了一个 2100 万」。更准确地说，协议规定的是<strong>发行节奏</strong>：创世区块每个区块奖励 50 枚，之后每 210,000 个区块（约四年）奖励减半，依次为 25、12.5、6.25……这是一个等比数列，把每一期的发行量加起来，总和收敛到约 2100 万枚。</p><p>所以上限来自发行曲线，而不是一条硬编码的「总量检查」。另外，全网算力并不决定总量，只决定出块是否稳定；难度调整会让平均出块时间回到约 10 分钟。</p>`},
      {h:'五、它不等于「便宜又快的支付」', html:`<p>把比特币理解为支付网络，会产生一连串错误预期。它的吞吐量很小（每秒交易数远低于主流卡组织），确认需要时间，繁忙时手续费会明显上升，价格本身又剧烈波动。</p><div class="callout"><b>一句话分清：</b>比特币首先是一套<strong>不依赖可信第三方的记账与结算系统</strong>，其次才被部分人当作价值储存或支付工具。把这两层混在一起，是很多新手判断失误的起点。</div>`},
      {h:'小结', html:`<p>记住三件事就够了：账本由全网各自保存；改写历史需要付出随确认数增长的成本；总量上限来自减半的发行曲线。理解这三点，再去看价格、看行情卡片，会清楚很多。</p>`}
    ]
  },
  {
    slug:'how-to-read-market', tag:'行情解读', min:'约 7 分钟',
    title:'如何读懂行情页：价格、涨跌幅与 24 小时高低',
    abstract:'逐项拆解行情卡片上的每个数字：最新价是怎么来的、涨跌幅以什么为基准、24h 高低为什么不等于你能成交的价格，以及走势线到底画的是什么。',
    en:'A field-by-field guide to a market card: what last price actually means, the reference point behind the 24h percentage, why the 24h high/low is not a tradable quote, what the sparkline plots, and a checklist of common misreadings.',
    sections:[
      {h:'一、最新价：最后一笔成交，不是买一卖一', html:`<p>行情卡片上最醒目的数字，通常是<strong>最新成交价</strong>（last price），即该交易对最近一笔撮合成交的价格。它既不是卖一价，也不是买一价，更不是平台给你的「报价」。</p><p>买卖盘之间永远存在价差（spread）。你真正能买到的价格取决于挂单簿深度：买入通常按卖一档往上吃单，卖出按买一档往下吃单。单子越大，越可能吃掉多档，成交均价就越偏离最新价。</p>`},
      {h:'二、24h 涨跌幅：基准是 24 小时前的价格', html:`<p>计算公式大致是：<code>(当前价 − 24 小时前价格) ÷ 24 小时前价格 × 100%</code>。注意它比较的是<strong>滚动 24 小时窗口</strong>的起点，而不是「昨天收盘价」——加密市场 24 小时连续交易，本来也没有收盘概念。</p><p>所以同一个币种，在不同数据商页面上显示的涨跌幅可能有小幅差异：窗口切点、快照时间、取的是成交价还是标记价，都会带来偏差。看到 +2.35% 和 +2.41% 不必怀疑谁在造假，先看口径。</p>`},
      {h:'三、24h 高 / 低：区间极值，不是可成交价', html:`<p>这两个数是滚动窗口内的最高与最低成交价。它们描述<strong>曾经发生过什么</strong>，不代表此刻有人愿意在该价位与你成交。极端行情里，最高价可能只由一笔极小的单子打出，甚至只是某个瞬间的插针。</p><p>把「24h 低点」当成一定能买到的支撑位，是很典型也挺危险的误读。</p>`},
      {h:'四、USDT 与计价单位', html:`<p>本站统一展示 <code>XXX / USDT</code>，即以泰达币计价的交易对。读价格时先确认计价币种：同一资产用 USDT、USD、BTC 计价，数字完全不同。另外像 DOGE、TRX 这类单价很低的币，小数位数与最小变动单位（tick size）会直接影响你看盘时的精度感。</p>`},
      {h:'五、走势线画的是什么', html:`<p>卡片下方那条迷你曲线，本站取的是<strong>近 24 根小时 K 线的收盘价</strong>，不是逐笔成交，也不是 7 天走势。它只用来表现短期方向感，不适合当技术分析依据：点少、无成交量、无均线，放大看会丢失大量信息。</p><p>颜色方面，本站默认<strong>红涨绿跌</strong>（中国大陆习惯），可一键切换为国际惯例的绿涨红跌；切换只影响颜色，不改变数值。</p>`},
      {h:'六、延迟与刷新', html:`<p>本站默认每 30 秒刷新一次，走势线另有缓存；浏览器切到后台时会暂停刷新，回到前台立即同步。若公开接口不可达，页面会明确标注「演示数据」而不是把旧价格装成实时价。<strong>任何需要下单的决策，都请以交易所官方页面为准。</strong></p><div class="callout"><b>速查：</b>最新价 ≠ 挂单价；涨跌幅基准是 24h 前；24h 高低 ≠ 可成交价；走势线 = 小时收盘价串；页面价格可能有延迟。</div>`}
    ]
  },
  {
    slug:'spot-vs-contract', tag:'基础概念', min:'约 8 分钟',
    title:'现货与合约：两种交易方式的本质区别',
    abstract:'从所有权、保证金、杠杆到强平机制，解释为什么明明方向看对了，现货能扛过去、合约却可能已经出局。',
    en:'Spot transfers ownership of the asset; a derivative is an agreement on price movement. This article walks through margin, leverage, maintenance margin and liquidation to explain why being right on direction is not enough.',
    sections:[
      {h:'一、现货：买的是资产本身', html:`<p>现货交易完成后，资产所有权转移到你的账户。币价下跌，你持有的币变少的是<strong>市值</strong>，不是数量；只要不卖，就没有「被强制平掉」这回事，最坏情况是标的归零。</p><p>因此现货的风险边界很清晰：最大损失约等于投入本金。这也是为什么新手通常被建议先从现货理解市场。</p>`},
      {h:'二、合约：买的是价格变动的协议', html:`<p>合约不交割现货（永续合约尤其如此），它是对未来价格的一份协议，用保证金担保履约。你并没有「持有」那些币，持有的是一个<strong>带杠杆的敞口</strong>。</p><p>敞口大小 = 保证金 × 杠杆倍数。10 倍杠杆下，标的波动 1%，你的权益波动约 10%——这还没算手续费与资金费率。</p>`},
      {h:'三、保证金与强平', html:`<p>平台会设一个<strong>维持保证金率</strong>。当亏损使权益跌破这条线，系统会强制平仓，避免亏损超过你交的保证金。关键在于：强平看的是<strong>过程中的最低权益</strong>，不是最终价格。</p><div class="callout"><b>典型场景：</b>你在 100 买入 10 倍多单，价格先插针到 91 再回到 105。现货账户毫发无伤，合约账户可能已在 91 附近被强平，后面的反弹与你无关。这就是「方向对了却亏了」。</div>`},
      {h:'四、资金费率与到期', html:`<p>永续合约没有到期日，靠<strong>资金费率</strong>把合约价锚定现货价：多头拥挤时费率通常为正，由多头付给空头；反之亦然。持仓过夜的成本会随行情变化，长期持仓时这是不可忽视的隐性成本。交割合约则有固定到期日与结算价。</p>`},
      {h:'五、给新手的判断清单', html:`<ul><li>能否承受<strong>全部本金损失</strong>？不能就别碰杠杆。</li><li>是否理解强平价怎么算？算不出来就不要下单。</li><li>是否把手续费、资金费率、滑点都计入了预期？</li><li>是否有明确的止损，并且能接受插针带来的额外滑点？</li><li>是否分得清「我看对方向」和「我能活到方向兑现」？</li></ul><p>合约是工具，不是放大收益的快捷键。它放大的从来都是<strong>波动</strong>，既包括盈利也包括亏损。</p>`}
    ]
  },
  {
    slug:'wallet-security', tag:'资产安全', min:'约 9 分钟',
    title:'钱包与助记词：资产安全的第一课',
    abstract:'托管与非托管的区别、助记词为什么不能截图、最常见的几类钓鱼手法，以及一套可以照着做的最小安全流程。',
    en:'Custodial vs self-custody, why a seed phrase must never be screenshotted or shared, the phishing patterns that actually work, and a minimal security routine you can follow today.',
    sections:[
      {h:'一、私钥在谁手里，资产就在谁手里', html:`<p>交易所账户里的「币」，本质是平台数据库里的一行记录，私钥由平台保管，这叫<strong>托管</strong>。你用的是平台的账号密码，资产的实际控制权在平台。</p><p>非托管钱包则相反：私钥（或由助记词推导出的私钥）在你自己设备上，任何人都无法替你冻结或找回。自由与责任在这里是同一件事——<strong>丢了助记词，没有任何客服能帮你重置</strong>。</p>`},
      {h:'二、助记词到底是什么', html:`<p>常见的是 BIP39 标准的 12 或 24 个英文单词。它不是「密码」，而是生成主私钥的<strong>种子</strong>：由这组词可以确定性推导出整棵密钥树下的所有地址与私钥。</p><p>所以拿到助记词 = 拿到全部资产，且与设备、App、安装时间无关。换手机时导入同一组词，地址与余额原样出现，正说明了它才是资产的真正入口。</p>`},
      {h:'三、为什么不能截图、云备份、发给客服', html:`<p>截图会进入相册，而相册常被云同步、被各类 App 申请访问；云笔记、微信收藏、邮件草稿同理，都是<strong>可被远程获取的明文副本</strong>。至于「客服索要助记词以帮你解冻/验证/领取空投」——100% 是诈骗，任何正规服务都不会需要它。</p><div class="callout"><b>只记一条铁律：</b>助记词的正确存放方式是<strong>离线、物理、不联网</strong>——手写在纸上或金属板上，分开保存在两个安全地点。需要输入时，确认周围没有摄像头、没有远程协助软件。</div>`},
      {h:'四、真实世界里最常见的几类手法', html:`<ul><li><strong>假客服 / 假官方群：</strong>主动私信帮你「解决提现不到账」，引导你到仿冒站点输入助记词。</li><li><strong>相似域名与搜索广告：</strong>钱包官网的字母被替换（如把 i 换成 l），页面做得一模一样。</li><li><strong>剪贴板劫持：</strong>恶意软件在你复制收款地址时悄悄替换成攻击者地址，且不易察觉。</li><li><strong>假空投 / 授权钓鱼：</strong>诱导你签署一笔「领取」交易，实际是把代币授权额度交给对方。</li><li><strong>假 App：</strong>第三方商店里的山寨钱包，界面与正版几乎无差别。</li></ul>`},
      {h:'五、一套最小的安全流程', html:`<ol><li>钱包只从官方渠道下载，核对域名与开发者名称。</li><li>新建钱包后，<strong>先小额转入、再转出一次</strong>，确认助记词备份可用、地址复制无误。</li><li>大额长期持有考虑硬件钱包；签名前逐字读清交易内容，特别是「授权」类。</li><li>给交易所账户开双重验证、提现地址白名单与提现延迟。</li><li>把「绝不在任何网页输入助记词」当成默认规则，唯一的例外是恢复钱包时、在确认无误的官方 App 内。</li></ol>`},
      {h:'六、如果已经泄露了', html:`<p>不要抱侥幸：助记词一旦以联网形式存在过，就应当视为已泄露。正确做法是<strong>立刻新建一个全新钱包，把资产全部转走</strong>，然后废弃旧地址。转账时先小额测试，并注意原地址可能已被监控、抢跑。</p>`}
    ]
  },
  {
    slug:'risk-management', tag:'风险管理', min:'约 7 分钟',
    title:'仓位与风险：为什么先想「最多亏多少」',
    abstract:'用具体算式说明仓位、止损与回撤的关系，解释亏 50% 为什么要涨 100% 才回本，以及为什么连胜之后反而最容易出事。',
    en:'Concrete arithmetic behind position sizing, stop loss and drawdown: why a 50% loss needs a 100% gain to recover, why stop orders are not guarantees, and why a winning streak is often the most dangerous moment.',
    sections:[
      {h:'一、把问题从「能赚多少」倒过来问', html:`<p>大多数人开仓前想的是目标价。更稳的顺序是反过来：<strong>如果这笔判断完全错了，我最多愿意亏多少钱？</strong> 把这个问题回答清楚，仓位几乎就自动算出来了。</p><p>假设账户 10,000 USDT，单笔最多愿意亏 1%（100 USDT）。若入场价 100、止损价 95，止损距离是 5%，那么可开仓位 ≈ <code>100 ÷ 5% = 2,000 USDT</code>。止损越远，仓位就必须越小——很多人正好做反了。</p>`},
      {h:'二、止损不是保险', html:`<p>止损单保证不了成交价。剧烈行情里会出现<strong>滑点</strong>；流动性差的币种可能直接跳空或插针，成交价远低于止损价；合约还可能在强平价附近被系统接管。所以「设了止损」不等于「最大亏损已锁定」，实际亏损大于计划是常态而非意外。</p>`},
      {h:'三、回撤是不对称的', html:`<p>亏 10% 需要涨约 11.1% 回本；亏 30% 需要涨 42.9%；亏 50% 需要涨 <strong>100%</strong>；亏 80% 需要涨 400%。这不是心理感受，是算术：<code>回本涨幅 = 1 ÷ (1 − 亏损比例) − 1</code>。</p><div class="callout"><b>推论：</b>控制单笔亏损的意义，不只是少亏一点，而是<strong>保住复利的本金基数</strong>。一次深亏会把之后很多次小赢全部抵消。</div>`},
      {h:'四、连胜之后最危险', html:`<p>连续几笔盈利后，最常见的变化不是策略变好，而是<strong>仓位悄悄变大</strong>：觉得自己「手感对了」，把 1% 风险放宽到 5%，再放宽到 10%。此时只要遇到一次正常概率的亏损，回撤就会被放大数倍。</p><p>另一个隐蔽问题是把「运气」写成「规律」。样本少的时候，连胜完全可能来自随机性；用它去推翻原本的仓位规则，等于把风控交给情绪。</p>`},
      {h:'五、一张可复用的检查表', html:`<ul><li>这笔最多亏多少？写出来，是金额不是感觉。</li><li>止损放在哪？按结构放，不按「我最多能忍多少」放。</li><li>按止损距离反算的仓位是多少？是否超出单笔风险上限？</li><li>滑点、手续费、资金费率是否已计入？</li><li>如果连亏三笔，总回撤是否仍在可承受范围？</li><li>这笔交易和上一笔盈利是否相关？相关性会让多笔小风险变成一笔大风险。</li></ul><p>风控不负责让你赚得更多，它负责让你<strong>还能留在场上下一次判断</strong>。</p>`}
    ]
  },
  {
    slug:'data-sources', tag:'数据说明', min:'约 5 分钟',
    title:'本站行情数据从哪来：公开接口、延迟与误差',
    abstract:'公开说明我们调用哪些接口、刷新频率与兜底策略，以及为什么页面价格会和你实际成交价有细微差别。',
    en:'Which endpoints we call, how often we refresh, what the fallbacks are, and why the quote on this page may differ slightly from the price you actually get filled at.',
    sections:[
      {h:'一、主数据源', html:`<p>价格、24 小时涨跌幅与 24 小时高低价来自<strong>币安公共行情接口</strong>的 24hr ticker，一次性批量请求 8 个交易对；卡片下方的走势线取同一来源的近 24 根<strong>小时 K 线收盘价</strong>。这些都是无需密钥的公开只读接口。</p><p>为保证可用性，主源配置了备用域名自动切换。行情请求由<strong>你的浏览器直接发出</strong>，我们没有后端转发，也不保存你的请求记录。</p>`},
      {h:'二、兜底与降级', html:`<p>主源不可达时，页面会尝试另一个公开数据源（CoinGecko）补齐价格；两者都失败时，会显示缓存的演示价格，并在顶部状态栏<strong>明确标注「演示数据 · 网络受限」</strong>。我们宁可告诉你数据不实时，也不把旧价格伪装成实时价。</p><p>走势线则优先用真实 K 线，只有在全部来源都拿不到时才退化为示意曲线。</p>`},
      {h:'三、刷新策略', html:`<p>默认 30 秒刷新一次价格，K 线走势有独立缓存以免每次都重复请求；浏览器切到后台时暂停轮询，回到前台立即同步一次；页面也提供手动刷新按钮。涨跌配色默认红涨绿跌，可切换为国际惯例。</p>`},
      {h:'四、为什么和你的成交价不一样', html:`<ul><li><strong>时间差：</strong>页面是 30 秒级快照，下单是当下撮合。</li><li><strong>口径差：</strong>最新成交价 ≠ 你能吃到的挂单价，大额单还会产生滑点。</li><li><strong>交易对差：</strong>不同平台、不同计价币（USDT / USD / USDC）之间本身有价差。</li><li><strong>标记价差：</strong>合约强平常用标记价，与最新成交价并不相同。</li></ul>`},
      {h:'五、我们不做的事', html:`<p>本站不预测价格、不提供喊单、不代客交易、不收集交易所账号信息，页面上的所有数字只作信息展示。想核验数据，可以直接打开交易所官方行情页对照，或用公开接口自行请求同一交易对。</p><div class="callout"><b>一句话：</b>把本站当作<strong>看盘与学习的入口</strong>，把下单与资金决策留给交易所官方渠道。</div>`}
    ]
  }
];

function articlePage(a, i){
  const toc = a.sections.map((s, n) => `<a href="#s${n+1}">${n+1}. ${s.h}</a>`).join('\n    ');
  const body = a.sections.map((s, n) => `<h2 id="s${n+1}">${s.h}</h2>\n    ${s.html}`).join('\n    ');
  const related = A.filter((_, k) => k !== i).slice(0, 3)
    .map(x => `<a href="${x.slug}.html">${x.title}</a>`).join('\n      ');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${a.title} · BonusBlock</title>
<meta name="description" content="${a.abstract}">
<link rel="stylesheet" href="../assets/site.css">
</head>
<body>
<header class="site-head">
  <div class="wrap">
    <a class="brand" href="../index.html">◆ BonusBlock<small>MARKET INTEL</small></a>
    <nav class="site-nav">
      <a href="../index.html" data-ui="home">首页</a>
      <a href="../index.html#insights" data-ui="guides">资讯指南</a>
      <a href="../about.html" data-ui="about">关于我们</a>
      <a href="../privacy.html" data-ui="privacy">隐私政策</a>
      <a href="../contact.html" data-ui="contact">联系我们</a>
      <a href="../disclaimer.html" data-ui="disclaimer">免责声明</a>
    </nav>
    <select id="langSelect" class="lang-select"></select>
  </div>
</header>
<main class="wrap article">
  <div class="crumb"><a href="../index.html" data-ui="back">← 返回首页</a> / <a href="../index.html#insights" data-ui="guides">资讯指南</a> / ${a.tag}</div>
  <h1>${a.title}</h1>
  <div class="meta">BonusBlock 原创 · ${a.tag} · ${a.min} · 发布于 2026-11-03</div>
  <p class="abstract">${a.abstract}</p>
  <div class="toc"><b>本文目录</b>
    ${toc}
  </div>
  ${body}
  <div class="en-summary"><b>ENGLISH SUMMARY</b>${a.en}</div>
  <div class="rel">
      ${related}
  </div>
  <div class="endnote">本文为原创科普内容，用于解释概念与数据口径，不构成投资建议、要约或收益承诺。文中价格与算例仅用于说明。虚拟资产价格波动剧烈，请独立判断并遵守所在地法律法规。<br>本站为独立资讯站点，与任何交易所无隶属或授权关系；<a href="../disclaimer.html">查看免责声明与返佣披露</a>。</div>
</main>
<footer class="site-foot">
  <div class="wrap">
    <span data-ui="rights">© 2026 BonusBlock · 独立资讯站，非交易所官方</span>
    <a href="../about.html" data-ui="about">关于我们</a>
    <a href="../privacy.html" data-ui="privacy">隐私政策</a>
    <a href="../contact.html" data-ui="contact">联系我们</a>
    <a href="../disclaimer.html" data-ui="disclaimer">免责声明</a>
    <a href="../index.html">BonusBlock 首页</a>
  </div>
</footer>
<script src="../assets/site.js"></script>
</body>
</html>
`;
}

/* ---------------- 4 个法律页 ---------------- */
function legalPage(key){
  const d = DATA.DOCS[key];
  const title = d.title[0];
  const intro = d.intro['zh-CN'];
  const foot = d.foot['zh-CN'];
  const items = d.items['zh-CN'].map((s, n) =>
    `<div class="doc-item"><span class="num">${String(n+1).padStart(2,'0')}</span><p>${s}</p></div>`).join('\n    ');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} · BonusBlock</title>
<meta name="description" content="${intro}">
<link rel="stylesheet" href="assets/site.css">
</head>
<body data-doc="${key}">
<header class="site-head">
  <div class="wrap">
    <a class="brand" href="index.html">◆ BonusBlock<small>MARKET INTEL</small></a>
    <nav class="site-nav">
      <a href="index.html" data-ui="home">首页</a>
      <a href="index.html#insights" data-ui="guides">资讯指南</a>
      <a href="about.html" data-ui="about">关于我们</a>
      <a href="privacy.html" data-ui="privacy">隐私政策</a>
      <a href="contact.html" data-ui="contact">联系我们</a>
      <a href="disclaimer.html" data-ui="disclaimer">免责声明</a>
    </nav>
    <select id="langSelect" class="lang-select"></select>
  </div>
</header>
<main class="wrap doc">
  <div class="doc-kicker" data-ui="legal">法律与合规</div>
  <div id="docBody">
    <h1>${title}</h1>
    <p class="lead">${intro}</p>
    ${items}
    <div class="doc-foot">${foot}</div>
  </div>
  <div class="doc-foot" data-ui="updated">最近更新：2026 年 11 月</div>
</main>
<footer class="site-foot">
  <div class="wrap">
    <span data-ui="rights">© 2026 BonusBlock · 独立资讯站，非交易所官方</span>
    <a href="about.html" data-ui="about">关于我们</a>
    <a href="privacy.html" data-ui="privacy">隐私政策</a>
    <a href="contact.html" data-ui="contact">联系我们</a>
    <a href="disclaimer.html" data-ui="disclaimer">免责声明</a>
    <a href="index.html">BonusBlock 首页</a>
  </div>
</footer>
<script src="assets/site.js"></script>
</body>
</html>
`;
}

/* ---------------- 站点文件 ---------------- */
const adsTxt = `# BonusBlock · ads.txt
# 申请 Google AdSense 获批后：把下面示例行里的 16 位数字换成你自己的发布商 ID，
# 删除行首的 # 号，并确保本文件可通过 https://你的域名/ads.txt 以 HTTP 200 访问。
# 发布商 ID 形如 pub-1234567890123456（纯 16 位数字），不要带 ca- 前缀。
#
# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
#
# 重要：不要保留任何「未注释的示例 ID」。ads.txt 中若不含你的真实 ID，
# Google 会拒绝来自本站的全部广告请求。未获批之前保持全部行为注释是安全的。
# 若同时使用其他广告平台，请按其要求在此追加对应的授权行。
`;

const pages = [
  ['', 1.0, 'weekly'],
  ['privacy.html', 0.4, 'monthly'], ['about.html', 0.6, 'monthly'],
  ['contact.html', 0.4, 'monthly'], ['disclaimer.html', 0.6, 'monthly'],
  ...A.map(a => [`articles/${a.slug}.html`, 0.8, 'monthly'])
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- 部署到正式域名后，请把 ${BASE} 全部替换为你的正式站点根地址（含结尾斜杠）。 -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([f, pri, freq]) => `  <url><loc>${BASE}${f}</loc><changefreq>${freq}</changefreq><priority>${pri}</priority><lastmod>2026-11-03</lastmod></url>`).join('\n')}
</urlset>
`;

const robots = `# BonusBlock · robots.txt
# 部署到正式域名后，请把下面 Sitemap 的地址替换为你的正式站点地址。
User-agent: *
Allow: /

# Google AdSense 抓取器需能读取 /ads.txt 与页面内容
User-agent: Mediapartners-Google
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: ${BASE}sitemap.xml
`;

/* ---------------- 执行 ---------------- */
const made = [];
A.forEach((a, i) => made.push(w(`articles/${a.slug}.html`, articlePage(a, i))));
Object.keys(DATA.DOCS).forEach(k => made.push(w(`${k}.html`, legalPage(k))));
made.push(w('ads.txt', adsTxt), w('sitemap.xml', sitemap), w('robots.txt', robots));
console.log('generated ' + made.length + ' files:');
made.forEach(f => console.log('  ' + f));
