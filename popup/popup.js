/* 瓷之器 — popup 逻辑：渲染主题卡片、写入选择、报告当前站点生效状态 */
'use strict';

const { HDW_THEMES, HDW_META } = self;
const BUILTIN_SITE = 'hdwing.org';

const grid = document.getElementById('themeGrid');
const statusEl = document.getElementById('siteStatus');
const statusText = document.getElementById('statusText');

/* ── 渲染主题卡片 ── */
function buildCards() {
  const frag = document.createDocumentFragment();
  for (const [id, t] of Object.entries(HDW_THEMES)) {
    const btn = document.createElement('button');
    btn.className = 'card';
    btn.dataset.theme = id;
    btn.type = 'button';

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
    kind.className = 'kind';
    kind.textContent = t.kind;
    name.append(label, kind);

    const desc = document.createElement('div');
    desc.className = 'card-desc';
    desc.textContent = t.desc;

    btn.append(swatch, name, desc);
    frag.appendChild(btn);
  }
  grid.appendChild(frag);
}

/* ── 选中态 ── */
function markSelection(theme) {
  document.querySelectorAll('[data-theme]').forEach((el) => {
    el.classList.toggle('selected', el.dataset.theme === theme);
  });
}

grid.addEventListener('click', (e) => {
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
