/* 瓷之器 — popup 逻辑：渲染主题卡片、写入选择、报告当前站点生效状态 */
'use strict';

const { HDW_THEMES, HDW_META } = self;
const BUILTIN_SITE = 'hdwing.org';

const themeArea = document.getElementById('themeArea');
const statusEl = document.getElementById('siteStatus');
const statusText = document.getElementById('statusText');

/* ── 分区：基础色系 / 瓷器定制（青花瓷、宣德首推）/ 布局重构 ──
   归组依据：BASIC 列表定基础款，themes.js 的 layout 字段定布局款，
   其余入瓷器定制（保持定义序，FEATURED 提前）——未来新增主题自动归位。 */
const BASIC = ['slate', 'nord', 'sepia', 'forest'];
const FEATURED = ['qinghua', 'xuande'];

function themeGroups() {
  const ids = Object.keys(HDW_THEMES);
  return [
    { label: '基础色系', ids: ids.filter((id) => BASIC.includes(id)) },
    {
      label: '瓷器定制',
      ids: ids
        .filter((id) => !BASIC.includes(id) && !HDW_THEMES[id].layout)
        .sort((a, b) => {
          const fa = FEATURED.indexOf(a), fb = FEATURED.indexOf(b);
          return (fa === -1 ? FEATURED.length : fa) - (fb === -1 ? FEATURED.length : fb);
        }),
    },
    { label: '布局重构', ids: ids.filter((id) => HDW_THEMES[id].layout) },
  ];
}

/* ── 单张主题卡 ── */
function makeCard(id, t) {
  const btn = document.createElement('button');
  btn.className = 'card';
  btn.dataset.theme = id;
  btn.type = 'button';
  btn.title = t.name + '：' + t.desc;

  const swatch = document.createElement('div');
  swatch.className = 'swatch';
  for (const c of t.swatch) {
    const s = document.createElement('span');
    s.style.background = c;
    swatch.appendChild(s);
  }

  const name = document.createElement('div');
  name.className = 'card-name';
  const label = document.createElement('span');
  label.textContent = t.name;
  const kind = document.createElement('span');
  kind.className = 'kind ' + (t.layout ? 'k-layout' : t.kind === 'dark' ? 'k-dark' : 'k-light');
  kind.textContent = t.layout ? '布局' : t.kind === 'dark' ? '深色' : '浅色';
  name.append(label, kind);

  const desc = document.createElement('div');
  desc.className = 'card-desc';
  desc.textContent = t.desc;

  btn.append(swatch, name, desc);

  /* 宣德卡片：右下角「流光」开关（关 = nav 釉下流光静止） */
  if (id === 'xuande') {
    const tg = document.createElement('label');
    tg.className = 'motion-toggle';
    tg.title = 'nav 釉下流光';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = true;
    const track = document.createElement('span');
    track.className = 'mt-track';
    const thumb = document.createElement('span');
    thumb.className = 'mt-thumb';
    track.appendChild(thumb);
    tg.append(cb, track);
    tg.addEventListener('click', (e) => e.stopPropagation());
    tg.addEventListener('change', () => {
      chrome.storage.sync.set({ xuandeMotion: cb.checked });
    });
    chrome.storage.sync.get({ xuandeMotion: HDW_META.DEFAULTS.xuandeMotion })
      .then(({ xuandeMotion }) => { cb.checked = xuandeMotion; });
    btn.appendChild(tg);
  }

  return btn;
}

/* ── 渲染分区 ── */
function buildCards() {
  const frag = document.createDocumentFragment();
  for (const g of themeGroups()) {
    const section = document.createElement('section');
    section.className = 'group';
    const head = document.createElement('div');
    head.className = 'group-head';
    const ht = document.createElement('span');
    ht.textContent = g.label;
    head.appendChild(ht);
    const grid = document.createElement('div');
    grid.className = 'grid';
    for (const id of g.ids) grid.appendChild(makeCard(id, HDW_THEMES[id]));
    section.append(head, grid);
    frag.appendChild(section);
  }
  themeArea.appendChild(frag);
}

/* ── 选中态 ── */
function markSelection(theme) {
  document.querySelectorAll('[data-theme]').forEach((el) => {
    el.classList.toggle('selected', el.dataset.theme === theme);
  });
}

themeArea.addEventListener('click', (e) => {
  const card = e.target.closest('[data-theme]');
  if (!card) return;
  chrome.storage.sync.set({ theme: card.dataset.theme });
});

document.querySelector('.special-row').addEventListener('click', (e) => {
  const item = e.target.closest('[data-theme]');
  if (!item) return;
  chrome.storage.sync.set({ theme: item.dataset.theme });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.theme) markSelection(changes.theme.newValue);
});

/* ── 当前标签页是否命中站点 ── */
async function reportSite() {
  let host = '';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    host = tab?.url ? new URL(tab.url).hostname : '';
  } catch { /* 无权限访问的页面 */ }

  const hit = host === BUILTIN_SITE || host.endsWith('.' + BUILTIN_SITE);

  statusEl.classList.toggle('active', hit);
  statusText.textContent = hit
    ? host + ' · 主题生效中'
    : host
      ? host + ' · 仅在 hdwing.org 生效'
      : '无法读取当前页面';
}

document.getElementById('openOptions').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
document.getElementById('openCustom').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

buildCards();
chrome.storage.sync.get({ theme: HDW_META.DEFAULTS.theme }).then(({ theme }) => {
  const valid = HDW_THEMES[theme] || theme === 'auto' || theme === 'off';
  markSelection(valid ? theme : HDW_META.DEFAULTS.theme);
});
reportSite();
