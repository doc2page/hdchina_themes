/* 瓷之器 — options 逻辑：主题选择 / 自定义 CSS */
'use strict';

const { HDW_THEMES, HDW_META } = self;

/* ═══ Tab 切换 ═══════════════════════════════════ */

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('is-on', t === tab));
    document.querySelectorAll('.panel').forEach((p) =>
      p.classList.toggle('is-on', p.id === 'panel-' + tab.dataset.panel)
    );
  });
});

/* ═══ 主题 ═══════════════════════════════════════ */

const themeGrid = document.getElementById('themeGrid');

function buildThemeCards() {
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
  themeGrid.appendChild(frag);
}

function markSelection(theme) {
  document.querySelectorAll('[data-theme]').forEach((el) => {
    el.classList.toggle('selected', el.dataset.theme === theme);
  });
}

document.addEventListener('click', (e) => {
  const item = e.target.closest('#panel-themes [data-theme]');
  if (!item) return;
  chrome.storage.sync.set({ theme: item.dataset.theme });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.theme) markSelection(changes.theme.newValue);
});

buildThemeCards();
chrome.storage.sync.get({ theme: HDW_META.DEFAULTS.theme }).then(({ theme }) => {
  const valid = HDW_THEMES[theme] || theme === 'auto' || theme === 'off';
  markSelection(valid ? theme : HDW_META.DEFAULTS.theme);
});

/* ═══ 自定义 CSS ═════════════════════════════════ */

const editor = document.getElementById('cssEditor');
const cssState = document.getElementById('cssState');
let saveTimer = null;

chrome.storage.local.get({ customCSS: HDW_META.DEFAULTS.customCSS }).then(({ customCSS }) => {
  editor.value = customCSS;
});

async function saveCSS() {
  try {
    await chrome.storage.local.set({ customCSS: editor.value });
    cssState.textContent = '已保存 · ' + new Date().toLocaleTimeString();
    cssState.className = 'hint ok';
  } catch (e) {
    cssState.textContent = '保存失败：' + e.message;
    cssState.className = 'hint err';
  }
}

document.getElementById('cssSave').addEventListener('click', saveCSS);
document.getElementById('cssClear').addEventListener('click', () => {
  if (editor.value && !editor.value.trim()) { editor.value = ''; saveCSS(); return; }
  if (editor.value && confirm('清空全部自定义 CSS？')) {
    editor.value = '';
    saveCSS();
  }
});
editor.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveCSS();
  }
});
editor.addEventListener('input', () => {
  cssState.textContent = '有未保存的修改…';
  cssState.className = 'hint';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCSS, 1600); /* 停止输入 1.6s 后自动保存 */
});
