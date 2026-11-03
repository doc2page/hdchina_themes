/*
 * 瓷之器 — 用户身份卡 v9 终稿实现（设计：cardmaster，tools/card_design_v2.html）：
 * 顶栏用户名后瓷片图标 → 点击弹出身份卡（Shadow DOM，青花基调恒定，独立于主题开关）。
 * 数据全站顶栏 .userinfo 直取零请求；款识 = 站点影业系等级中文名（FAQ 对照）。
 * 卡面：竖排题款名 + 首字私印 + 团莲活枝（藤势三样）+ 账目 + 等级款识；
 * 档位 t-su/t-min/t-guan/t-dou/t-gong 只在枝印款识彩金上分高下，无线无框。
 */
(function () {
  'use strict';

  /* 等级映射：class → [档位, 款识中文名]（中文按站点 FAQ 影业系命名；
     Administrator/VIP/Flack/Staff 站点未列，按语义补译） */
  const RANKS = {
    Peasant: ['t-su', '封杀对象', '#708090'],
    User: ['t-min', '群众演员', '#000000'],
    PowerUser: ['t-guan', '客串龙套', '#B38512'],
    EliteUser: ['t-guan', '领衔主演', '#008B8B'],
    CrazyUser: ['t-guan', '成名大腕', '#00BFFF'],
    InsaneUser: ['t-guan', '金牌经纪', '#8B008B'],
    VeteranUser: ['t-guan', '最佳导演', '#483D8B'],
    ExtremeUser: ['t-dou', '大制作人', '#FF5A00'],
    UltimateUser: ['t-dou', '国际巨星', '#006400'],
    NexusMaster: ['t-dou', '影业帝国', '#38ACEC'],
    VIP: ['t-dou', '贵宾', '#009F00'],
    Uploader: ['t-gong', '发布员', '#DC143C'],
    Seeder: ['t-gong', '史前仓库', '#0000FF'],
    Flack: ['t-gong', '宣传组', '#FFFF00'],
    Moderator: ['t-gong', '总版主', '#1A3DD2'],
    ForumModerator: ['t-gong', '论坛版主', '#B700B7'],
    Staff: ['t-gong', '管理组', '#AA3838'],
    StaffLeader: ['t-gong', '主管', '#8b0000'],
    Administrator: ['t-gong', '管理员', '#4b0082'],
    SysOp: ['t-gong', '维护开发员', '#a0522d'],
    Retiree: ['t-gong', '荣誉会员', '#1cc6d5'],
  };
  /* 档位雅称（右上竖排固定 2 字）：素坯白丁 / 民窑青禾 / 官窑观澜 / 斗彩照夜 / 供器拾遗 */
  const TIER_ALIAS = { 't-su': '白丁', 't-min': '青禾', 't-guan': '观澜', 't-dou': '照夜', 't-gong': '拾遗' };

  const asset = (p) => (self.chrome && chrome.runtime && chrome.runtime.getURL)
    ? chrome.runtime.getURL('content/' + p)
    : '/repo/content/' + p;

  const ICON_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    + 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M4 8.5 L12 3.5 L20 8.5 L20 18.5 L12 21.5 L4 18.5 Z"/>'
    + '<path d="M4 8.5 L12 12.5 L20 8.5"/><path d="M12 12.5 L12 21.5"/>'
    + '<path d="M8 6 L16 10" opacity=".55"/></svg>';

  /* ── 团莲花头（三档同一款；--shi 瓣色 / --rui 蕊色由档位 CSS 驱动） ── */
  const BLOOM = (tr) =>
    `<g class="bloom" transform="${tr}">`
    + '<path d="M-4.5 -5 C-6.5 -11 -7 -17 -4.5 -21 C-2.5 -24.5 2.5 -24.5 4.5 -21 C7 -17 6.5 -11 4.5 -5 Z" fill="#fbfdfd" stroke="#1c4275" stroke-width="1.1" transform="rotate(-200) scale(1.15)"/>'
    + '<path d="M-4.5 -5 C-6.5 -11 -7 -17 -4.5 -21 C-2.5 -24.5 2.5 -24.5 4.5 -21 C7 -17 6.5 -11 4.5 -5 Z" fill="var(--shi,#24558f)" stroke="#1c4275" stroke-width="1.2" transform="rotate(-90) scale(1.05)"/>'
    + '<path d="M-4.5 -5 C-6.5 -11 -7 -17 -4.5 -21 C-2.5 -24.5 2.5 -24.5 4.5 -21 C7 -17 6.5 -11 4.5 -5 Z" fill="#fbfdfd" stroke="#1c4275" stroke-width="1.2" transform="rotate(-38) scale(0.95)"/>'
    + '<path d="M-4.5 -5 C-6.5 -11 -7 -17 -4.5 -21 C-2.5 -24.5 2.5 -24.5 4.5 -21 C7 -17 6.5 -11 4.5 -5 Z" fill="var(--shi,#24558f)" stroke="#1c4275" stroke-width="1.2" transform="rotate(18) scale(1.08)"/>'
    + '<path d="M-4.5 -5 C-6.5 -11 -7 -17 -4.5 -21 C-2.5 -24.5 2.5 -24.5 4.5 -21 C7 -17 6.5 -11 4.5 -5 Z" fill="#fbfdfd" stroke="#1c4275" stroke-width="1.2" transform="rotate(68) scale(0.92)"/>'
    + '<path d="M-4.5 -5 C-6.5 -11 -7 -17 -4.5 -21 C-2.5 -24.5 2.5 -24.5 4.5 -21 C7 -17 6.5 -11 4.5 -5 Z" fill="var(--shi,#24558f)" stroke="#1c4275" stroke-width="1.2" transform="rotate(128) scale(1.02)"/>'
    + '<path d="M-4.5 -5 C-6.5 -11 -7 -17 -4.5 -21 C-2.5 -24.5 2.5 -24.5 4.5 -21 C7 -17 6.5 -11 4.5 -5 Z" fill="#fbfdfd" stroke="#1c4275" stroke-width="1.2" transform="rotate(-152) scale(0.98)"/>'
    + '<path d="M-3 -4 C-4 -8 -4 -12 -2 -14.5 C-0.5 -16.5 2 -16 3.5 -14 C5 -11.5 4.5 -7.5 3 -4 Z" fill="#fbfdfd" stroke="#1c4275" stroke-width="1.05" transform="rotate(-62) scale(0.95)"/>'
    + '<path d="M-3 -4 C-4 -8 -4 -12 -2 -14.5 C-0.5 -16.5 2 -16 3.5 -14 C5 -11.5 4.5 -7.5 3 -4 Z" fill="#fbfdfd" stroke="#1c4275" stroke-width="1.05" transform="rotate(-8) scale(1.0)"/>'
    + '<path d="M-3 -4 C-4 -8 -4 -12 -2 -14.5 C-0.5 -16.5 2 -16 3.5 -14 C5 -11.5 4.5 -7.5 3 -4 Z" fill="#fbfdfd" stroke="#1c4275" stroke-width="1.05" transform="rotate(46) scale(0.9)"/>'
    + '<path d="M-3 -4 C-4 -8 -4 -12 -2 -14.5 C-0.5 -16.5 2 -16 3.5 -14 C5 -11.5 4.5 -7.5 3 -4 Z" fill="#fbfdfd" stroke="#1c4275" stroke-width="1.05" transform="rotate(112) scale(1.0)"/>'
    + '<circle r="3.4" fill="#1c4275"/>'
    + '<circle r="5.2" fill="none" stroke="#fbfdfd" stroke-width="1.3"/>'
    + '<circle cx="6.8" cy="2.5" r="1.05" fill="var(--rui,#1c4275)"/>'
    + '<circle cx="-2.5" cy="6.8" r="1.05" fill="var(--rui,#1c4275)"/>'
    + '<circle cx="-6.8" cy="-2.5" r="1.05" fill="var(--rui,#1c4275)"/>'
    + '<circle cx="2.5" cy="-6.8" r="1.05" fill="var(--rui,#1c4275)"/>'
    + '</g>';

  /* 小卷叶（涡卷回勾，藤上副笔） */
  const CURL = (x, y) =>
    `<g class="bloom" transform="translate(${x} ${y})">`
    + '<path d="M0 0 C8 -1 11 -8 6.5 -12.5 C3 -15.5 -2.5 -14 -3.5 -9.5 C-4 -6 -1.5 -3.5 1 -4.8 C3 -5.8 3 -8.5 0.8 -8.6" '
    + 'fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></g>';

  /* 三株藤势（官中轴直上 / 斗横斜大弧 / 供双藤轻拱）——与设计稿逐 path 一致 */
  const SPRIG_GUAN =
      '<path class="stem" d="M100 228 C88 204 94 180 102 162" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>'
    + '<path class="stem" d="M102 162 C112 144 106 124 100 108" stroke="currentColor" stroke-width="2.0" stroke-linecap="round"/>'
    + '<path class="stem" d="M100 108 C95 94 97 82 102 70" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
    + '<path class="stem" d="M102 70 C104 62 104 55 102 46" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>'
    + BLOOM('translate(102 40) rotate(8) scale(1.15)')
    + '<path class="stem2" d="M96 166 C88 168 82 170 78 173" stroke="currentColor" stroke-width=".9" stroke-linecap="round"/>'
    + CURL(74, 174);
  const SPRIG_DOU =
      '<path class="stem" d="M10 196 C52 174 96 158 132 128" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>'
    + '<path class="stem" d="M132 128 C158 106 176 82 190 46" stroke="currentColor" stroke-width="2.0" stroke-linecap="round"/>'
    + '<path class="stem" d="M190 46 C192 40 192 34 190 28" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>'
    + '<path class="stem2" d="M164 96 C163 90 163 85 162 80" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>'
    + BLOOM('translate(162 72) rotate(18) scale(1.15)')
    + '<path class="stem2" d="M84 160 C78 165 73 169 68 172" stroke="currentColor" stroke-width=".9" stroke-linecap="round"/>'
    + CURL(64, 175);
  const SPRIG_GONG =
      '<path class="stem" d="M38 228 C28 192 46 158 80 136" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'
    + '<path class="stem" d="M80 136 C92 128 100 120 104 108" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'
    + '<path class="stem" d="M162 228 C172 192 154 158 120 136" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'
    + '<path class="stem" d="M120 136 C108 128 100 120 104 108" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'
    + BLOOM('translate(104 92) rotate(0) scale(1.18)')
    + '<path class="stem2" d="M52 186 C47 183 43 180 39 178" stroke="currentColor" stroke-width=".9" stroke-linecap="round"/>'
    + CURL(35, 176);
  /* 民窑：瘦简一藤一花一叶 */
  const SPRIG_MIN =
      '<path d="M18 226 C44 214 34 192 60 184" stroke="#24558f" stroke-width="1.8" stroke-linecap="round" opacity=".9"/>'
    + '<path d="M60 184 C88 176 80 152 106 146 C130 140 126 116 148 108 C164 102 174 82 184 48" stroke="#24558f" stroke-width="1.3" stroke-linecap="round" opacity=".9"/>'
    + '<path d="M104 140 C102 131 101 123 102 115" stroke="#24558f" stroke-width="1" stroke-linecap="round"/>'
    + '<g transform="translate(102 112) scale(.82)">'
    + '<path d="M-6 -8 C-5 -13 5 -13 6 -8 C4 -5 -4 -5 -6 -8 Z" fill="#1c4275"/>'
    + '<path d="M-3 -11 C-15 -13 -22 -25 -16 -38 C-12 -47 -1 -45 1 -36 C3 -25 2 -15 -3 -11 Z" fill="#fbfdfd" stroke="#1c4275" stroke-width="1.2"/>'
    + '<path d="M-4 -12 C-16 -13 -25 -21 -24 -30 C-23 -37 -16 -38 -12 -31 C-8 -24 -5 -17 -4 -12 Z" fill="#fbfdfd" stroke="#1c4275" stroke-width="1.15"/>'
    + '<path d="M3 -11 C11 -12 18 -21 17 -31 C16 -38 9 -38 6 -31 C4 -24 3 -16 3 -11 Z" fill="#fbfdfd" stroke="#1c4275" stroke-width="1.15"/>'
    + '<path d="M5 -28 C6 -31 7 -33 9 -34 M6 -27 C8 -29 10 -30 12 -30" stroke="#1c4275" stroke-width=".9" fill="none" stroke-linecap="round"/>'
    + '<circle cx="9.5" cy="-34.5" r="1.2" fill="#1c4275"/>'
    + '<circle cx="12.5" cy="-30" r="1.2" fill="#1c4275"/></g>'
    + '<path d="M64 182 C58 186 52 189 46 191" stroke="#24558f" stroke-width=".9" stroke-linecap="round"/>'
    + '<ellipse rx="2.8" ry="9" stroke="#1c4275" stroke-width="1.05" fill="#fbfdfd" transform="translate(40 195) rotate(-58)"/>'
    + '<path d="M46.4 187.4 L33.8 202.4" stroke="#1c4275" stroke-width=".7"/>';

  const sprigFor = (tier) => {
    if (tier === 't-min') return `<svg class="sprig" width="156" height="181" viewBox="0 0 200 232" fill="none" aria-hidden="true">${SPRIG_MIN}</svg>`;
    const map = { 't-guan': [SPRIG_GUAN, 'mid'], 't-dou': [SPRIG_DOU, ''], 't-gong': [SPRIG_GONG, 'wide'] };
    const [svg, extra] = map[tier];
    return `<svg class="sprig2 ${extra}" width="170" height="197" viewBox="0 0 200 232" fill="none" aria-hidden="true">${svg}</svg>`;
  };

  let modal = null;

  function findUserLink() {
    return document.querySelector('.userinfo a[class$="_Name"], a[class$="_Name"]');
  }

  function injectIcon() {
    const a = findUserLink();
    if (!a || a.parentElement.querySelector('.hdw-card-btn')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hdw-card-btn';
    btn.title = '瓷之器 · 身份卡';
    btn.setAttribute('aria-label', '打开身份卡');
    btn.innerHTML = ICON_SVG;
    btn.addEventListener('click', (e) => { e.preventDefault(); openCard(); });
    a.parentElement.appendChild(btn);
  }

  function readData() {
    const a = findUserLink();
    if (!a) return null;
    const m = a.className.match(/(\w+)_Name/);
    const rankKey = m ? m[1] : 'User';
    const rank = RANKS[rankKey] || RANKS.User;
    const name = (a.textContent || '').trim();
    const text = (document.querySelector('.userinfo') || document.body).textContent || '';
    const grab = (re) => { const r = text.match(re); return r ? r[1].trim() : '—'; };
    const up = grab(/上传量：\s*([\d.,]+\s*(?:[KMGT]B|PB))/);
    const down = grab(/下载量：\s*([\d.,]+\s*(?:[KMGT]B|PB))/);
    const bonus = grab(/魔力值[^：]*：\s*([\d.,]+)/);
    const splitUnit = (v) => {
      const m2 = v.match(/^([\d.,]+)\s*(\S+)$/);
      return m2 ? [m2[1], m2[2]] : [v, ''];
    };
    return { name, tier: rank[0], rankCn: rank[1], rankColor: rank[2],
      upN: splitUnit(up)[0], upU: splitUnit(up)[1],
      downN: splitUnit(down)[0], downU: splitUnit(down)[1], bonus };
  }

  function buildModal() {
    const host = document.createElement('div');
    host.id = 'hdw-card-host';
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = '<style>@import url("' + asset('card-modal.css') + '");</style>'
      + '<div class="overlay"><div class="card" role="dialog" aria-modal="true"></div></div>';
    const overlay = root.querySelector('.overlay');
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('on')) closeModal();
    });
    modal = {
      host, overlay,
      card: root.querySelector('.card'),
      open() {
        document.documentElement.appendChild(host);
        requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('on')));
      },
      close() {
        overlay.classList.remove('on');
        setTimeout(() => { if (host.isConnected) host.remove(); }, 240);
      },
    };
    return modal;
  }

  /* 卡面 HTML（弹窗与展示页共用单源；d = readData() 形状） */
  function renderCardHTML(d) {
    return (
        '<i class="glare"></i>'
      + '<main class="field">'
      + `  <div class="rank" style="color:${d.rankColor};${d.rankColor === '#FFFF00' ? ' text-shadow:0 0 1.5px #8a7a00;' : ''}">${escapeHtml(d.name)}</div>`
      + `  <div class="titlecol"><div class="name">${TIER_ALIAS[d.tier]}</div></div>`
      + (d.tier === 't-su' ? '<p class="hint">素坯待绘，上传可期</p>' : sprigFor(d.tier))
      + '</main>'
      + '<section class="data">'
      + '  <div class="lab">上传</div>'
      + `  <div class="num">${escapeHtml(d.upN)}<i>${escapeHtml(d.upU)}</i></div>`
      + '  <div class="duo">'
      + `    <div><span class="lab">下载</span><b>${escapeHtml(d.downN)}<i>${escapeHtml(d.downU)}</i></b></div>`
      + `    <div><span class="lab">魔力值</span><b>${escapeHtml(d.bonus)}</b></div>`
      + '  </div>'
      + '</section>'
      + `<footer class="foot"><span class="mark" style="color:${d.rankColor};${d.rankColor === '#FFFF00' ? ' text-shadow:0 0 1.5px #8a7a00;' : ''}">${escapeHtml(d.rankCn)}</span></footer>`);
  }

  function openCard() {
    const d = readData();
    if (!d) return;
    const m = modal || buildModal();
    m.card.className = 'card ' + d.tier;
    m.card.innerHTML = renderCardHTML(d);
    m.open();
  }

  function closeModal() { if (modal) modal.close(); }

  /* 展示页接口：makeData(rankKey, overrides) → renderCardHTML(makeData(...)) */
  self.HDWCard = {
    makeData(rankKey, o) {
      const rank = RANKS[rankKey] || RANKS.User;
      o = o || {};
      return {
        name: o.name || '用户', tier: rank[0], rankCn: rank[1], rankColor: rank[2],
        upN: o.upN || '0', upU: o.upU || 'TB',
        downN: o.downN || '0', downU: o.downU || 'TB', bonus: o.bonus || '0',
      };
    },
    render: renderCardHTML,
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function init() {
    injectIcon();
    const obs = new MutationObserver(() => injectIcon());
    obs.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('DOMContentLoaded', () => obs.disconnect());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
