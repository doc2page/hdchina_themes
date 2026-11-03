/*
 * 瓷之器 — 用户身份卡（生长体系终稿，设计源 tools/grow_design.html / growmaster）：
 * 顶栏用户名后瓷片图标 → 点击弹出身份卡（Shadow DOM，青花基调恒定，独立于主题开关）。
 * 等级 = 一株缠枝莲的生长（对角斜生骨架，21 级参数切片）；官方组矾红叙事；
 * 双印章（横向铁律）：左上名章印泥=等级色、底部官印矾红徽记；口沿一线=等级色；
 * 白丁纯白无物。数据全站顶栏 .userinfo 直取零请求。
 */
(function () {
  'use strict';

  /* ── 色板（与设计稿同源） ── */
  const C = { deep: '#1c4275', mid: '#24558f', pale: '#7ba3c4', white: '#fbfdfd',
              red: '#b5443c', redD: '#8e3630', gold: '#b08d4a', fade: '#966e78' };

  /* ── 骨架：一株主藤（21 级共用）对角斜生（先声明供 RANKS 表引用） ── */
  const P = [[34,226],[60,206],[54,178],[86,171],[78,139],[108,131],[102,99],[130,92],[118,64],[134,52]];
  const SEGW = [3.2,2.98,2.76,2.54,2.32,2.1,1.88,1.66,1.44];
  const SIDE = [146, 116];
  const tang = (i) => { const a = P[Math.max(0, i-1)], b = P[Math.min(9, i+1)]; return [b[0]-a[0], b[1]-a[1]]; };
  const ctrl = (i) => { const a = P[i], b = P[i+1], ta = tang(i), tb = tang(i+1), k = .3;
    return [[a[0]+ta[0]*k, a[1]+ta[1]*k], [b[0]-tb[0]*k, b[1]-tb[1]*k]]; };
  const segPath = (i) => { const [c1, c2] = ctrl(i), a = P[i], b = P[i+1];
    return `M${a[0]} ${a[1]} C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${b[0]} ${b[1]}`; };
  const MP = (i) => { const [c1, c2] = ctrl(i), a = P[i], b = P[i+1];
    return [(a[0]+3*c1[0]+3*c2[0]+b[0])/8, (a[1]+3*c1[1]+3*c2[1]+b[1])/8]; };
  const STAFF_BASE = (() => {
    const m0 = MP(0), m2 = MP(2), m4 = MP(4), m6 = MP(6);
    return { segs: 9,
      blooms: [{ x: P[9][0], y: P[9][1], s: .92, rot: 6, petal: 'alt' }, { x: SIDE[0], y: SIDE[1], s: .78, rot: 14, petal: 'alt' }],
      sides: [{ n: 5, x: SIDE[0], y: SIDE[1] }],
      leaves: [{ x: m0[0], y: m0[1], side: -1, s: .62, mode: 'pale' }, { x: m2[0], y: m2[1], side: 1, s: .72, mode: 'white' },
               { x: m4[0], y: m4[1], side: -1, s: .72, mode: 'white' }, { x: m6[0], y: m6[1], side: 1, s: .62, mode: 'pale' }],
      curls: [[58, 212, true]] };
  })();

  /* 官方组生长配置（公共基底 + 红差异） */
  function staffCfg(key) {
    const c = JSON.parse(JSON.stringify(STAFF_BASE));
    switch (key) {
      case 'Uploader': c.bud = { x: MP(5)[0] + 9, y: MP(5)[1] - 4, s: 1.05, red: 1 }; break;
      case 'Seeder': c.blooms[0] = { x: P[9][0], y: P[9][1], s: .92, rot: 6, petal: 'red1' }; break;
      case 'Flack': c.blooms[0] = { x: P[9][0], y: P[9][1], s: .92, rot: 6, petal: 'red' }; break;
      case 'ForumModerator': c.blooms[0] = { x: P[9][0], y: P[9][1], s: .92, rot: 6, petal: 'red' };
        c.blooms[1] = { x: SIDE[0], y: SIDE[1], s: .78, rot: 14, petal: 'red' }; break;
      case 'Moderator': c.cluster = { redN: 2 }; c.blooms = [{ x: SIDE[0], y: SIDE[1], s: .78, rot: 14, petal: 'alt' }]; break;
      case 'Staff': c.redStem = [4, 7]; break;
      case 'StaffLeader': c.redStem = [0, 4]; break;
      case 'Administrator': c.redStem = [0, 8];
        c.blooms[0] = { x: P[9][0], y: P[9][1], s: .92, rot: 6, petal: 'red' }; break;
      case 'SysOp': c.redStem = [0, 8]; c.gold = 1;
        c.blooms = [{ x: P[9][0], y: P[9][1], s: .92, rot: 6, petal: 'red' }, { x: SIDE[0], y: SIDE[1], s: .78, rot: 14, petal: 'red' }]; break;
      case 'Retiree': c.redStem = [0, 8]; c.redFade = 1; break;
    }
    return c;
  }

  /* ── 等级表：[站点等级色, 中文名, 雅称, 用户线生长配置]（官方组配置走 staffCfg） ── */
  const RANKS = {
    User: ['#000000', '群众演员', '青禾', { segs: 1, tip: 1, tipS: 1.25 }],
    Peasant: ['#708090', '封杀对象', '白丁', { empty: 1 }],
    PowerUser: ['#B38512', '客串龙套', '抟泥', { segs: 2, tip: 1, tipS: 1.15, leaves: [{ x: MP(1)[0], y: MP(1)[1], side: 1, s: .58, mode: 'white' }] }],
    EliteUser: ['#008B8B', '领衔主演', '初窑', { segs: 3, bud: { x: P[3][0], y: P[3][1] + 1, s: 1.0 },
      leaves: [{ x: MP(0)[0], y: MP(0)[1], side: -1, s: .55, mode: 'pale' }, { x: MP(2)[0], y: MP(2)[1], side: 1, s: .62, mode: 'white' }] }],
    CrazyUser: ['#00BFFF', '成名大腕', '成器', { segs: 5, half: { x: P[5][0], y: P[5][1] + 5, s: .72 },
      leaves: [{ x: MP(1)[0], y: MP(1)[1], side: 1, s: .6, mode: 'white' }, { x: MP(3)[0], y: MP(3)[1], side: -1, s: .68, mode: 'white' }] }],
    InsaneUser: ['#8B008B', '金牌经纪', '出窑', { segs: 6, blooms: [{ x: P[6][0], y: P[6][1], s: .95, rot: 8, petal: 'alt' }],
      leaves: [{ x: MP(0)[0], y: MP(0)[1], side: -1, s: .58, mode: 'pale' }, { x: MP(2)[0], y: MP(2)[1], side: 1, s: .66, mode: 'white' }, { x: MP(4)[0], y: MP(4)[1], side: -1, s: .62, mode: 'white' }] }],
    VeteranUser: ['#483D8B', '最佳导演', '观澜', { segs: 7, blooms: [{ x: P[7][0], y: P[7][1], s: .95, rot: -6, petal: 'alt' }, { x: 112, y: 122, s: .78, rot: 16, petal: 'alt' }],
      sides: [{ n: 4, x: 112, y: 122 }],
      leaves: [{ x: MP(1)[0], y: MP(1)[1], side: 1, s: .6, mode: 'white' }, { x: MP(3)[0], y: MP(3)[1], side: -1, s: .68, mode: 'white' }, { x: MP(5)[0], y: MP(5)[1], side: 1, s: .6, mode: 'pale' }] }],
    ExtremeUser: ['#FF5A00', '大制作人', '照夜', { segs: 9, blooms: [{ x: P[9][0], y: P[9][1], s: .98, rot: 5, petal: 'alt' }, { x: SIDE[0], y: SIDE[1], s: .78, rot: 16, petal: 'alt' }, { x: MP(5)[0] - 4, y: MP(5)[1], s: .85, rot: -10, petal: 'alt' }],
      sides: [{ n: 5, x: SIDE[0], y: SIDE[1] }],
      leaves: [{ x: MP(0)[0], y: MP(0)[1], side: -1, s: .6, mode: 'pale' }, { x: MP(2)[0], y: MP(2)[1], side: 1, s: .66, mode: 'white' }, { x: MP(6)[0], y: MP(6)[1], side: -1, s: .62, mode: 'white' }],
      curls: [[58, 212, true]] }],
    UltimateUser: ['#006400', '国际巨星', '流霞', { segs: 9,
      blooms: [{ x: P[9][0], y: P[9][1], s: .98, rot: 5, petal: 'alt' }, { x: SIDE[0], y: SIDE[1], s: .78, rot: 16, petal: 'alt' }, { x: MP(5)[0] - 4, y: MP(5)[1], s: .85, rot: -10, petal: 'alt' }, { x: 58, y: 160, s: .74, rot: -18, petal: 'alt' }],
      sides: [{ n: 5, x: SIDE[0], y: SIDE[1] }, { n: 3, x: 58, y: 160 }],
      leaves: [{ x: MP(0)[0], y: MP(0)[1], side: -1, s: .6, mode: 'pale' }, { x: MP(2)[0], y: MP(2)[1], side: 1, s: .66, mode: 'white' }, { x: MP(6)[0], y: MP(6)[1], side: -1, s: .62, mode: 'white' }, { x: MP(4)[0], y: MP(4)[1], side: 1, s: .6, mode: 'pale' }],
      curls: [[58, 212, true], [124, 84, false]] }],
    NexusMaster: ['#38ACEC', '影业帝国', '千峰', { segs: 9,
      blooms: [{ x: P[9][0], y: P[9][1], s: .92, rot: 6, petal: 'alt' }, { x: SIDE[0], y: SIDE[1], s: .78, rot: 16, petal: 'alt' }, { x: 58, y: 160, s: .74, rot: -18, petal: 'alt' }, { x: MP(2)[0], y: MP(2)[1], s: .85, rot: 12, petal: 'alt' }, { x: MP(5)[0] - 4, y: MP(5)[1], s: .8, rot: -10, petal: 'alt' }],
      sides: [{ n: 5, x: SIDE[0], y: SIDE[1] }, { n: 3, x: 58, y: 160 }],
      leaves: [{ x: MP(0)[0], y: MP(0)[1], side: -1, s: .66, mode: 'pale' }, { x: MP(1)[0], y: MP(1)[1], side: 1, s: .64, mode: 'white' }, { x: MP(3)[0], y: MP(3)[1], side: -1, s: .7, mode: 'white' }, { x: MP(4)[0], y: MP(4)[1], side: 1, s: .66, mode: 'pale' }, { x: MP(6)[0], y: MP(6)[1], side: -1, s: .64, mode: 'white' }, { x: MP(7)[0], y: MP(7)[1], side: 1, s: .6, mode: 'pale' }],
      curls: [[58, 212, true], [124, 84, false]], back: [[44, 94, 1.12], [160, 182, 1.0], [36, 150, .75]] }],
    VIP: ['#009F00', '贵宾', '霁月', { segs: 9, gold: 1,
      blooms: [{ x: P[9][0], y: P[9][1], s: .92, rot: 6, petal: 'alt' }, { x: SIDE[0], y: SIDE[1], s: .78, rot: 16, petal: 'alt' }, { x: 58, y: 160, s: .74, rot: -18, petal: 'alt' }, { x: MP(2)[0], y: MP(2)[1], s: .85, rot: 12, petal: 'alt' }, { x: MP(5)[0] - 4, y: MP(5)[1], s: .8, rot: -10, petal: 'alt' }],
      sides: [{ n: 5, x: SIDE[0], y: SIDE[1] }, { n: 3, x: 58, y: 160 }],
      leaves: [{ x: MP(0)[0], y: MP(0)[1], side: -1, s: .66, mode: 'pale' }, { x: MP(1)[0], y: MP(1)[1], side: 1, s: .64, mode: 'white' }, { x: MP(3)[0], y: MP(3)[1], side: -1, s: .7, mode: 'white' }, { x: MP(4)[0], y: MP(4)[1], side: 1, s: .66, mode: 'pale' }, { x: MP(6)[0], y: MP(6)[1], side: -1, s: .64, mode: 'white' }, { x: MP(7)[0], y: MP(7)[1], side: 1, s: .6, mode: 'pale' }],
      curls: [[58, 212, true], [124, 84, false]], back: [[44, 94, 1.12], [160, 182, 1.0], [36, 150, .75]] }],
    Uploader: ['#DC143C', '发布员', '拾遗', null],
    Seeder: ['#0000FF', '史前仓库', '渊藏', null],
    Flack: ['#FFFF00', '宣传组', '扬芬', null],
    ForumModerator: ['#B700B7', '论坛版主', '拱辰', null],
    Moderator: ['#1A3DD2', '总版主', '执圭', null],
    Staff: ['#AA3838', '管理组', '奉常', null],
    StaffLeader: ['#8b0000', '主管', '秉钧', null],
    Administrator: ['#4b0082', '管理员', '鼎彝', null],
    SysOp: ['#a0522d', '维护开发员', '司窑', null],
    Retiree: ['#1cc6d5', '荣誉会员', '挂冠', null],
  };

  /* ── 零件库（设计稿同源） ── */
  const D_O = 'M-4.5 -5 C-6.5 -11 -7 -17 -4.5 -21 C-2.5 -24.5 2.5 -24.5 4.5 -21 C7 -17 6.5 -11 4.5 -5 Z';
  const D_I = 'M-3 -4 C-4 -8 -4 -12 -2 -14.5 C-.5 -16.5 2 -16 3.5 -14 C5 -11.5 4.5 -7.5 3 -4 Z';
  const ROT_O = [[-200,1.15],[-90,1.05],[-38,.95],[18,1.08],[68,.92],[128,1.02],[-152,.98]];
  const ROT_I = [[-62,.95],[-8,1.0],[46,.9],[112,1.0]];

  function bloom(x, y, s, rot, petal, rui) {
    const isR = (i) => petal === 'red' || (petal === 'red1' && i === 3);
    let out = `<g transform="translate(${x} ${y}) rotate(${rot||0}) scale(${s})">`;
    ROT_O.forEach(([r, sc], i) => {
      const red = isR(i), fill = red ? C.red : (i % 2 ? C.mid : C.white);
      out += `<path d="${D_O}" fill="${fill}" stroke="${red?C.redD:C.deep}" stroke-width="${red?1.15:1.2}" transform="rotate(${r}) scale(${sc})"/>`;
    });
    ROT_I.forEach(([r, sc]) => {
      out += `<path d="${D_I}" fill="${C.white}" stroke="${C.deep}" stroke-width="1.05" transform="rotate(${r}) scale(${sc})"/>`;
    });
    out += `<circle r="3.4" fill="${rui==='gold'?C.gold:C.deep}"/><circle r="5.2" fill="none" stroke="${C.white}" stroke-width="1.3"/>`;
    if (rui === 'gold') out += `<circle r="7.8" fill="none" stroke="${C.gold}" stroke-width="1.3" opacity=".92"/>`;
    [[6.8,2.5],[-2.5,6.8],[-6.8,-2.5],[2.5,-6.8]].forEach(([cx,cy]) =>
      out += `<circle cx="${cx}" cy="${cy}" r="${rui==='gold'?1.7:1.05}" fill="${rui==='gold'?C.gold:C.deep}"/>`);
    return out + '</g>';
  }
  function mini(x, y, s, red) {
    let out = `<g transform="translate(${x} ${y}) scale(${s})">`;
    for (let i = 0; i < 5; i++)
      out += `<ellipse rx="2.7" ry="6.2" cy="-5.4" fill="${red?C.red:C.white}" stroke="${red?C.redD:C.deep}" stroke-width=".8" transform="rotate(${i*72})"/>`;
    return out + `<circle r="1.7" fill="${red?C.redD:C.deep}"/></g>`;
  }
  function bud(x, y, s, red) {
    const body = red ? C.red : C.white, seam = red ? C.redD : C.deep;
    return `<g transform="translate(${x} ${y}) scale(${s})">`
      + `<path d="M-6 -8 C-5 -13 5 -13 6 -8 C4 -5 -4 -5 -6 -8 Z" fill="${C.deep}" transform="translate(0 7.4) scale(.82)"/>`
      + `<path d="M-5.2 -1 C-6.7 -5 -6.5 -10.2 -4 -13.4 C-2.8 -14.8 -1.2 -15.7 .4 -15.9 C.9 -14.9 1.6 -13.9 2.6 -13.1 C4.3 -11.7 5.8 -9.6 5.9 -6 C6 -3.8 5.6 -1.9 5 -1 C3 -.2 -3 -.2 -5.2 -1 Z" fill="${body}" stroke="${seam}" stroke-width="1.05" stroke-linejoin="round"/>`
      + `<path d="M-3.1 -12 C-4.3 -8.6 -4.2 -4.8 -3.2 -1.7" stroke="${seam}" stroke-width=".85" fill="none" stroke-linecap="round"/>`
      + `<path d="M3.1 -12.2 C4.2 -8.8 4.1 -5 3.2 -1.8" stroke="${seam}" stroke-width=".85" fill="none" stroke-linecap="round"/>`
      + `<path d="M.5 -14.7 C.2 -12.8 .1 -10.9 .5 -9" stroke="${seam}" stroke-width=".7" fill="none" stroke-linecap="round"/></g>`;
  }
  function half(x, y, s, red) {
    const c = red ? C.red : C.mid, st = red ? C.redD : C.deep;
    return `<g transform="translate(${x} ${y}) scale(${s})">`
      + `<path d="${D_O}" fill="${C.white}" stroke="${C.deep}" stroke-width="1.2" transform="rotate(-200) scale(0.95)"/>`
      + `<path d="${D_O}" fill="${c}" stroke="${st}" stroke-width="1.2" transform="rotate(-90) scale(1.0)"/>`
      + `<path d="${D_O}" fill="${c}" stroke="${st}" stroke-width="1.2" transform="rotate(128) scale(1.0)"/>`
      + `<path d="${D_I}" fill="${C.white}" stroke="${C.deep}" stroke-width="1.05" transform="rotate(-42) scale(.88)"/>`
      + `<path d="${D_I}" fill="${C.white}" stroke="${C.deep}" stroke-width="1.05" transform="rotate(-8) scale(.96)"/>`
      + `<path d="${D_I}" fill="${C.white}" stroke="${C.deep}" stroke-width="1.05" transform="rotate(26) scale(.92)"/>`
      + `<path d="${D_I}" fill="${C.white}" stroke="${C.deep}" stroke-width="1.05" transform="rotate(58) scale(1.0)"/>`
      + `<circle r="2.6" fill="${C.deep}"/></g>`;
  }
  function sprout(x, y, s, rot) {
    return `<g transform="translate(${x} ${y}) rotate(${rot||0}) scale(${s})">`
      + `<path d="M0 8.5 C.5 6.5 .5 4.5 0 3" stroke="${C.deep}" stroke-width=".9" fill="none" stroke-linecap="round"/>`
      + `<ellipse rx="1.05" ry="2.3" fill="${C.white}" stroke="${C.deep}" stroke-width=".7" transform="translate(2.7 4.6) rotate(38)"/>`
      + `<path d="M0 3 C-1.8 2.6 -2.7 .8 -1.9 -1.2 C-1.2 -2.8 -.3 -3.7 0 -4.3 C.4 -3.6 1.3 -2.6 1.9 -1.1 C2.7 .8 1.8 2.6 0 3 Z" fill="${C.white}" stroke="${C.deep}" stroke-width=".85" stroke-linejoin="round"/></g>`;
  }
  function curl(x, y, flip) {
    return `<g transform="translate(${x} ${y})${flip?' scale(-1,1)':''}">`
      + `<path d="M0 0 C8 -1 11 -8 6.5 -12.5 C3 -15.5 -2.5 -14 -3.5 -9.5 C-4 -6 -1.5 -3.5 1 -4.8 C3 -5.8 3 -8.5 .8 -8.6" `
      + `fill="${C.mid}" fill-opacity=".22" stroke="${C.deep}" stroke-width="1.1" stroke-linecap="round"/></g>`;
  }
  function leaf(x, y, side, s, mode) {
    const fill = mode === 'pale' ? C.pale : C.white;
    return `<g transform="translate(${x} ${y}) scale(${side * s}) rotate(${side>0?10:-10})">`
      + `<path d="M0 0 Q5 -1 9 -3.5" stroke="${C.deep}" stroke-width="1" fill="none" stroke-linecap="round"/>`
      + `<path d="M9 -3.5 C10.5 -8 13.5 -10.5 17 -10 C19.5 -9.6 21 -7.4 20.6 -5 C23.4 -4.4 25 -1.9 24.2 .7 C26.4 2.3 26.6 5.3 24.6 7.1 C24.9 10 22.8 12.2 19.9 12 C18 14.4 14.4 14.8 12.2 13 C9.4 13.6 7 12 6.6 9.4 C4.4 8.6 3.3 6.2 4.2 4 C6.5 2 8 -1 9 -3.5 Z" fill="${fill}" stroke="${C.deep}" stroke-width="1" stroke-linejoin="round"/>`
      + `<path d="M9.5 -3 Q14 3 13.5 9" stroke="${C.deep}" stroke-width=".7" fill="none" stroke-linecap="round"/>`
      + `<path d="M12.6 -5.2 L16.8 -4.4 M13.4 1 L17.6 1.6 M12.8 7 L16.6 8" stroke="${C.deep}" stroke-width=".5" opacity=".8"/></g>`;
  }
  function back(x, y, s) {
    let out = `<g transform="translate(${x} ${y}) scale(${s})" opacity=".42">`;
    for (let i = 0; i < 6; i++)
      out += `<ellipse rx="4.6" ry="9" cy="-8" fill="${C.pale}" transform="rotate(${i*60})"/>`;
    return out + `<circle r="3.4" fill="${C.white}"/></g>`;
  }
  function ground() {
    return `<g>`
      + `<path d="M10 229 Q36 226.5 64 229" stroke="${C.pale}" stroke-width="1.1" fill="none" opacity=".85"/>`
      + `<path d="M17 232.5 Q37 230.5 57 232.5" stroke="${C.pale}" stroke-width=".7" fill="none" opacity=".5"/>`
      + `<path d="M18 228 C17 225 18 222.5 20.5 221" stroke="${C.pale}" stroke-width=".9" fill="none" stroke-linecap="round"/>`
      + `<path d="M54 228 C55.5 225.5 55 223 52.5 221.5" stroke="${C.pale}" stroke-width=".9" fill="none" stroke-linecap="round"/></g>`;
  }
  function sidePath(n, ex, ey, red) {
    const a = P[n], mx = (a[0]+ex)/2 + (ex>a[0]?-4:4), my = (a[1]+ey)/2 - 7;
    return `<path d="M${a[0]} ${a[1]} Q ${mx} ${my} ${ex} ${ey}" stroke="${red?C.red:C.deep}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  }

  function buildPlant(cfg) {
    if (!cfg || cfg.empty) return '';
    let s = '';
    (cfg.back || []).forEach(([x, y, sc]) => s += back(x, y, sc));
    s += ground();
    const redSeg = (i) => cfg.redStem && i >= cfg.redStem[0] && i <= cfg.redStem[1];
    for (let i = 0; i < cfg.segs; i++) {
      const len = Math.round(Math.hypot(P[i+1][0]-P[i][0], P[i+1][1]-P[i][1]) * 1.15);
      s += `<path class="stem" style="--dl:${len}px;--di:${i}" d="${segPath(i)}" stroke="${redSeg(i) ? (cfg.redFade ? C.fade : C.red) : C.deep}" stroke-width="${SEGW[i]}" fill="none" stroke-linecap="round"/>`;
    }
    for (let i = 1; i < cfg.segs; i++)
      s += `<circle cx="${P[i][0]}" cy="${P[i][1]}" r="1.5" fill="${redSeg(i) ? (cfg.redFade ? C.fade : C.red) : C.deep}"/>`;
    /* 挂件随藤同步生长：每个挂件的出现延迟 = 其挂点所在藤段描线完成时刻
       segAtY: y 越大越近根部（段号越小）；段 i 完成时刻 = 0.28+(i+1)*0.13+0.42 */
    const segAtY = (y) => {
      let seg = 0;
      for (let i = 0; i < Math.min(cfg.segs, 9); i++) if (y < P[i][1]) seg = i;
      return seg;
    };
    const sprDelay = (y) => (0.28 + (segAtY(y) + 1) * 0.13 + 0.3).toFixed(2);
    let rnd = 0;
    const vary = () => {
      rnd = (rnd * 9301 + 49297) % 233280;  // 确定性伪随机（同卡同态）
      return rnd / 233280;
    };
    const varyAttrs = () => `--prd:${(4 + vary() * 2.5).toFixed(2)}s;--ph:${(vary() * 4).toFixed(2)}s;--am:${(0.8 + vary()).toFixed(2)}deg`;
    let after = '';
    (cfg.sides || []).forEach((sd) => after += `<g class="spr" style="--t:${sprDelay(P[sd.n][1])}s;${varyAttrs()}">${sidePath(sd.n, sd.x, sd.y, sd.red)}</g>`);
    (cfg.leaves || []).forEach((lf) => after += `<g class="spr" style="--t:${sprDelay(lf.y)}s;${varyAttrs()}">${leaf(lf.x, lf.y, lf.side, lf.s, lf.mode)}</g>`);
    (cfg.curls || []).forEach((cr) => after += `<g class="spr" style="--t:${sprDelay(cr[1])}s;${varyAttrs()}">${curl(cr[0], cr[1], cr[2])}</g>`);
    (cfg.blooms || []).forEach((b) => after += `<g class="spr" style="--t:${sprDelay(b.y)}s;${varyAttrs()}">${bloom(b.x, b.y, b.s, b.rot, b.petal, cfg.gold ? 'gold' : null)}</g>`);
    if (cfg.half) after += `<g class="spr" style="--t:${sprDelay(cfg.half.y)}s;${varyAttrs()}">${half(cfg.half.x, cfg.half.y, cfg.half.s, cfg.half.red)}</g>`;
    if (cfg.bud) after += `<g class="spr" style="--t:${sprDelay(cfg.bud.y)}s;${varyAttrs()}">${bud(cfg.bud.x, cfg.bud.y, cfg.bud.s, cfg.bud.red)}</g>`;
    if (cfg.cluster) {
      const a = P[9];
      after += `<g class="spr" style="--t:${sprDelay(a[1])}s;${varyAttrs()}">`
        + `<path d="M${a[0]} ${a[1]} C ${a[0]+7} ${a[1]-4}, ${a[0]+12} ${a[1]-7}, ${a[0]+17.5} ${a[1]-11}" stroke="${C.deep}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
      const pts = [[a[0]+7.5, a[1]-3.5, 1.06], [a[0]+13, a[1]-8, .86], [a[0]+17.5, a[1]-11.5, .68]];
      pts.forEach((pt, i) => after += mini(pt[0], pt[1], pt[2], i < (cfg.cluster.redN || 0)));
      after += bud(a[0]+20.5, a[1]-14.5, .48, (cfg.cluster.redN || 0) >= 3) + '</g>';
    }
    if (cfg.tip) after += `<g class="spr" style="--t:${(0.28 + cfg.segs * 0.13 + 0.3).toFixed(2)}s;${varyAttrs()}">${sprout(P[cfg.segs][0], P[cfg.segs][1] - 2, cfg.tipS || 1, -22)}</g>`;
    return s + `<g class="grow">${after}</g>`;
  }

  /* ── 印章（横向铁律；印泥/限宽/特例同设计稿） ── */
  const SOFT_INKS = ['#00BFFF', '#38ACEC', '#1cc6d5'];
  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }
  function nameSeal(name, color) {
    let fs = 12.5, disp = name;    /* ASCII 字符实际渲染宽约为中文一半——有效字宽混合计算，印面不留大空 */
    const units = [...name].reduce((u, ch) => u + (ch.charCodeAt(0) < 128 ? 0.55 : 1), 0);
    let w = Math.round(units * 13) + 10;
    const MAXW = 118;
    if (w > MAXW) { fs = 10.5; w = Math.round(units * 11) + 10; }
    if (w > MAXW) { disp = [...name].slice(0, 9).join('') + '…'; w = 9 * 11 + 10; }
    const tone = color === '#FFFF00' ? ' sy' : SOFT_INKS.includes(color) ? ' ss' : '';
    return `<div class="seal seal-n${tone}" style="--ink:${color};width:${w}px">`
      + `<span class="txt" style="font-size:${fs}px">${escapeHtml(disp)}</span></div>`;
  }
  function rankSeal(cn) {
    const w = cn.length * 12.5 + 18;
    return `<div class="seal seal-r" style="--ink:#b5443c;width:${w}px">`
      + `<span class="txt" style="font-size:11px">${escapeHtml(cn)}</span></div>`;
  }

  const asset = (p) => (self.chrome && chrome.runtime && chrome.runtime.getURL)
    ? chrome.runtime.getURL('content/' + p)
    : '/repo/content/' + p;

  const ICON_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    + 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M4 8.5 L12 3.5 L20 8.5 L20 18.5 L12 21.5 L4 18.5 Z"/>'
    + '<path d="M4 8.5 L12 12.5 L20 8.5"/><path d="M12 12.5 L12 21.5"/>'
    + '<path d="M8 6 L16 10" opacity=".55"/></svg>';

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
    const r = RANKS[rankKey] || RANKS.User;
    const name = (a.textContent || '').trim();
    const text = (document.querySelector('.userinfo') || document.body).textContent || '';
    const grab = (re) => { const rr = text.match(re); return rr ? rr[1].trim() : '—'; };
    const up = grab(/上传量：\s*([\d.,]+\s*(?:[KMGT]B|PB))/);
    const down = grab(/下载量：\s*([\d.,]+\s*(?:[KMGT]B|PB))/);
    const bonus = grab(/魔力值[^：]*：\s*([\d.,]+)/);
    const splitUnit = (v) => { const mm = v.match(/^([\d.,]+)\s*(\S+)$/); return mm ? [mm[1], mm[2]] : [v, '']; };
    return {
      name, rankKey, color: r[0], cn: r[1], alias: r[2],
      cfg: r[3] || staffCfg(rankKey),
      upN: splitUnit(up)[0], upU: splitUnit(up)[1],
      downN: splitUnit(down)[0], downU: splitUnit(down)[1], bonus,
    };
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

  function renderCardHTML(d) {
    const white = d.rankKey === 'Peasant';
    const plant = buildPlant(d.cfg);
    const rim = white ? '' : `--rim:${hexA(d.color, d.color === '#FFFF00' ? .75 : .55)};`;
    return (
      `<div class="card${white ? ' bare' : ''}" style="${rim}">`
      + '<i class="glare"></i>'
      + nameSeal(d.name, d.color)
      + `<div class="titlecol"${white ? ' style="color:rgba(141,135,122,.72);font-weight:500"' : ''}>${escapeHtml(d.alias)}</div>`
      + (plant ? `<svg class="plant" viewBox="0 6 200 232" preserveAspectRatio="xMidYMin meet" aria-hidden="true" style="--nseg:${(d.cfg.segs||9)}">${plant}</svg>` : '')
      + (white ? '<p class="hint">素坯待绘，上传可期</p>' : '')
      + '<section class="data">'
      + '  <div class="lab">上传</div>'
      + `  <div class="num">${escapeHtml(d.upN)}<i>${escapeHtml(d.upU)}</i></div>`
      + '  <div class="duo">'
      + `    <div><span class="lab">下载</span><b>${escapeHtml(d.downN)}<i>${escapeHtml(d.downU)}</i></b></div>`
      + `    <div><span class="lab">魔力值</span><b>${escapeHtml(d.bonus)}</b></div>`
      + '  </div>'
      + '</section>'
      + rankSeal(d.cn)
      + '</div>');
  }

  function openCard() {
    const d = readData();
    if (!d) return;
    const m = modal || buildModal();
    m.card.innerHTML = renderCardHTML(d);
    m.open();
  }

  function closeModal() { if (modal) modal.close(); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  /* 展示页接口（serve_preview /cards 演示用） */
  self.HDWCard = {
    render(rankKey, o) {
      o = o || {};
      const r = RANKS[rankKey] || RANKS.User;
      const d = {
        name: o.name || '用户', rankKey, color: r[0], cn: r[1], alias: r[2],
        cfg: r[3] || staffCfg(rankKey),
        upN: o.upN || '0', upU: o.upU || 'TB', downN: o.downN || '0', downU: o.downU || 'TB', bonus: o.bonus || '0',
      };
      return renderCardHTML(d);
    },
  };

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
