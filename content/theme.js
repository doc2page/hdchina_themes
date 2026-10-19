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
  const LAYOUT_CLASS_PREFIX = 'hdw-layout-';

  /* 布局系主题（如定窑）：测量顶栏实际高度写入 CSS 变量，
     供侧栏 top 定位（纯 CSS 无法感知可变高度的顶栏）。
     不改动 DOM，仅提供测量值——布局仍全部由 CSS 完成。 */
  function measureHeader() {
    const header = document.querySelector('.headerbox');
    if (header) {
      root.style.setProperty('--hdw-header-h', header.offsetHeight + 'px');
    }
  }

  /* 首帧 document_start 时 body 尚未解析，布局类先挂起，
     DOMContentLoaded 应用后测量。注意顺序必须是「先加类、后测量」：
     布局类会改变顶栏自身高度（全宽/卡片化），测量布局前的旧高度
     会导致侧栏定位偏移（切换主题时侧栏上移、跳转页面才恢复的根因）。 */
  let pendingLayout = null;

  function applyLayoutClass(layout) {
    if (!layout) return;
    if (document.body) {
      root.classList.add(LAYOUT_CLASS_PREFIX + layout);
      measureHeader();                     /* offsetHeight 强制同步布局，拿到加类后的高度 */
      requestAnimationFrame(measureHeader); /* 下一帧双保险（样式全部就位后） */
    } else {
      pendingLayout = layout;
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    if (pendingLayout) {
      root.classList.add(LAYOUT_CLASS_PREFIX + pendingLayout);
      pendingLayout = null;
    }
    measureHeader();
    requestAnimationFrame(measureHeader);
    setTimeout(measureHeader, 400);
  });
  window.addEventListener('load', measureHeader);
  window.addEventListener('resize', measureHeader);

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

  /* 主题热缓存：chrome.storage.get 是异步的，冷启动时首帧可能在
     storage 返回前渲染——布局主题会先闪一瞬无主题状态（侧栏
     "重新渲染"感的根源）。localStorage 同步读取可赶在首帧前应用；
     storage 为权威源，onChanged 时同步刷新缓存。 */
  const LS_THEME = 'hdw-theme-cache';
  const LS_CUSTOM = 'hdw-custom-cache';

  function lsGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { /* 隐私模式等场景忽略 */ }
  }

  function render(theme, customCSS, xuandeMotion) {
    lsSet(LS_THEME, theme);
    lsSet(LS_CUSTOM, customCSS || '');
    const active = effectiveTheme(theme);
    const varStyle = ensureStyle(VAR_STYLE_ID);

    /* 主题专属类（hdw-t-<id>）与布局类（hdw-layout-<name>）：切换时先清旧类 */
    for (const cls of [...root.classList]) {
      if (cls.startsWith(THEME_CLASS_PREFIX) || cls.startsWith(LAYOUT_CLASS_PREFIX)) {
        root.classList.remove(cls);
      }
    }

    if (active) {
      const theme = HDW_THEMES[active];
      varStyle.textContent = HDW_META.varsToCSS(theme);
      root.classList.add(ON_CLASS, THEME_CLASS_PREFIX + active);
      pendingLayout = null;
      applyLayoutClass(theme.layout);
      root.classList.toggle(DARK_CLASS, theme.kind === 'dark');
    } else {
      varStyle.textContent = '';
      root.classList.remove(ON_CLASS, DARK_CLASS);
    }

    /* 宣德流光开关：关闭时挂 hdw-xd-still（core.css 隐藏 nav 流光层，微亮底保留） */
    root.classList.toggle('hdw-xd-still', active === 'xuande' && xuandeMotion === false);

    /* 自定义 CSS 独立于主题开关，始终注入 */
    ensureStyle(CUSTOM_STYLE_ID).textContent = customCSS || '';
  }

  async function state() {
    const sync = await chrome.storage.sync.get({
      theme: HDW_META.DEFAULTS.theme,
      xuandeMotion: HDW_META.DEFAULTS.xuandeMotion,
    });
    const local = await chrome.storage.local.get({ customCSS: HDW_META.DEFAULTS.customCSS });
    return { theme: sync.theme, customCSS: local.customCSS, xuandeMotion: sync.xuandeMotion };
  }

  function apply() {
    /* 首帧热路径：localStorage 同步值立即应用（无则跳过），
       storage 权威结果到达后校正（正常情况下两者一致，无感） */
    const cachedTheme = lsGet(LS_THEME);
    if (cachedTheme !== null) {
      render(cachedTheme, lsGet(LS_CUSTOM) || '', true);
    }
    state().then((s) => render(s.theme, s.customCSS, s.xuandeMotion)).catch(() => {});
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.theme) apply();
    if (area === 'sync' && changes.xuandeMotion) {
      root.classList.toggle('hdw-xd-still', changes.xuandeMotion.newValue === false);
    }
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
