/*
 * 瓷之器 — 内容脚本
 * document_start 运行：读取主题选择，向 <html> 注入变量与 hdw-on 类。
 * core.css 由 manifest 声明注入，仅在选择非「原版」时通过类名整体生效，
 * 因此主题在首帧前就位，无闪白。切换主题由 storage 广播驱动，免刷新。
 */
(function () {
  'use strict';

  const { HDW_THEMES, HDW_META } = self;
  const VAR_STYLE_ID = 'hdw-vars-style';
  const CUSTOM_STYLE_ID = 'hdw-custom-style';
  const ON_CLASS = 'hdw-on';

  const root = document.documentElement;
  const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');
  const DARK_CLASS = 'hdw-dark';
  const THEME_CLASS_PREFIX = 'hdw-t-';

  function ensureStyle(id) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      root.appendChild(el);
    }
    return el;
  }

  /* theme: 'auto' | 'off' | 主题 id。auto 深色时套 AUTO_DARK，浅色回原版 */
  function effectiveTheme(theme) {
    if (theme === 'auto') return darkMQ.matches ? HDW_META.AUTO_DARK : null;
    if (theme === 'off') return null;
    return HDW_THEMES[theme] ? theme : null;
  }

  function render(theme, customCSS) {
    const active = effectiveTheme(theme);
    const varStyle = ensureStyle(VAR_STYLE_ID);

    /* 主题专属类（hdw-t-<id>）：携带该主题的专属装饰层，切换时先清旧类 */
    for (const cls of [...root.classList]) {
      if (cls.startsWith(THEME_CLASS_PREFIX)) root.classList.remove(cls);
    }

    if (active) {
      varStyle.textContent = HDW_META.varsToCSS(HDW_THEMES[active]);
      root.classList.add(ON_CLASS, THEME_CLASS_PREFIX + active);
      root.classList.toggle(DARK_CLASS, HDW_THEMES[active].kind === 'dark');
    } else {
      varStyle.textContent = '';
      root.classList.remove(ON_CLASS, DARK_CLASS);
    }

    /* 自定义 CSS 独立于主题开关，始终注入 */
    ensureStyle(CUSTOM_STYLE_ID).textContent = customCSS || '';
  }

  async function state() {
    const sync = await chrome.storage.sync.get({ theme: HDW_META.DEFAULTS.theme });
    const local = await chrome.storage.local.get({ customCSS: HDW_META.DEFAULTS.customCSS });
    return { theme: sync.theme, customCSS: local.customCSS };
  }

  function apply() {
    state().then((s) => render(s.theme, s.customCSS)).catch(() => {});
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.theme) apply();
    if (area === 'local' && changes.customCSS) apply();
  });

  darkMQ.addEventListener('change', () => {
    state()
      .then((s) => {
        if (s.theme === 'auto') render(s.theme, s.customCSS);
      })
      .catch(() => {});
  });

  apply();
})();
