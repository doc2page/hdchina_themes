/*
 * 瓷之器 — 主题定义
 * 每个主题是一组 CSS 自定义属性，供 content/core.css 引用。
 * 该文件同时被 content script 与扩展页面（popup/options）加载，
 * 通过 self.HDW_THEMES 暴露，无模块依赖。
 */
(function (global) {
  'use strict';

  /*
   * 变量含义速查（对应原站 main.css 中的硬编码色）：
   * page          body / html 背景（原 #738ba8）
   * outer         #all_box、.cbox 内容外框（原 #b9c5d3）
   * border        主边框（原 #738ba8）
   * border-soft   软边框 / 分隔线（原 #ccc、#76aee2）
   * nav           #site_nav 导航条（原 #738ba8）
   * nav-text      导航文字（原 #b9c5d3）
   * nav-hover     导航 hover / 激活底（原 #b9c5d3）
   * header(-2)    #site_header 渐变起止（原 #F5F5F5 + logo_back.png）
   * content       table.mainouter 正文底（原 #f5f4ea）
   * panel         面板头 / 表头（原 #F5F5F5、#DFDFDF、#F6F6F6）
   * panel-2       td.colhead（原 #ccc）
   * subpanel(-2)  子面板（原 #cdd7e3 / #c1cddc）
   * row           数据行底（原 #f8f8f8、#fff、#e5e5e5）
   * row-alt(-2)   斑马纹（原 #b1bdcb / #b9c5d3）
   * row-hover     行 hover（原 #efefef）
   * sticky(-2/-3) 置顶 / 精华行（原 #c7d3e1 / #bac9da / #EADFE0）
   * text(-soft)   正文 / 次级文字（原 #000、#48506B / #666、#666d83）
   * title(-hover) 种子名链接（原 #000 / #d9534f）
   * link(-strong/-hover) 链接（原 #3b4256 / #204d78 / #0083ff）
   * accent(-soft) 强调色（原 #337ab7、#5497d5 / #76aee2）
   * btn(-text/-border) 按钮（原 btnbg.gif）
   * input(-text)  输入控件底 / 文字
   * tooltip(-text) domTT 弹层（原 #738ba8 / #000）
   * suggest       搜索联想底（原 #ccc）
   * free / twoup / twoupfree / halfdown / twouphalf
   *               促销底色（原 #ffff99 / #ffecec / #ccff99 / #cccdf8 / #96dbea），
   *               暗色主题保留色相、降低明度，折扣状态仍可辨识
   * logo-filter   站点 logo 的滤镜（暗色主题反色使其在深底上可读；浅色为 none）
   * scrollbar     自定义滚动条 thumb
   */

  const THEMES = {
    slate: {
      name: '暗夜',
      desc: '原站灰蓝的深色演绎，默认之选',
      kind: 'dark',
      swatch: ['#171c23', '#26303d', '#2e3947', '#5b8fc7', '#c9d3df'],
      vars: {
        page: '#171c23',
        outer: '#1f2630',
        border: '#0e1319',
        'border-soft': '#3a4757',

        nav: '#26303d',
        'nav-text': '#b9c5d3',
        'nav-hover': '#35424f',
        'nav-hover-text': '#e6edf5',

        header: '#232b36',
        header2: '#1c242e',
        'header-text': '#c3ccd8',

        content: '#222a34',
        panel: '#2b3542',
        'panel-2': '#333f4e',
        subpanel: '#2e3947',
        'subpanel-2': '#344050',

        row: '#27303c',
        'row-alt': '#2d3846',
        'row-alt-2': '#313d4c',
        'row-hover': '#3a4757',
        sticky: '#33404f',
        sticky2: '#384657',
        sticky3: '#454052',

        text: '#c9d3df',
        'text-soft': '#8a97a8',
        title: '#dfe7f0',
        'title-hover': '#e8756f',
        link: '#9ab8d4',
        'link-strong': '#7fb0dd',
        'link-hover': '#62a8e8',

        accent: '#5b8fc7',
        'accent-soft': '#46698e',

        btn: '#36424f',
        'btn-text': '#cdd7e3',
        'btn-border': '#48576a',

        input: '#1d242d',
        'input-text': '#c9d3df',

        tooltip: '#0f1318',
        'tooltip-text': '#c9d3df',
        suggest: '#2b3542',

        free: '#4a4426',
        twoup: '#4a3333',
        twoupfree: '#35482b',
        halfdown: '#323a58',
        twouphalf: '#2b4a58',

        'logo-filter': 'invert(0.91) hue-rotate(180deg) saturate(0.85)',
        scrollbar: '#39465a',
      },
    },



    nord: {
      name: 'Nord',
      desc: '极夜与霜雪，冷冽均衡',
      kind: 'dark',
      swatch: ['#2e3440', '#3b4252', '#434c5e', '#88c0d0', '#d8dee9'],
      vars: {
        page: '#2e3440',
        outer: '#353c4b',
        border: '#232833',
        'border-soft': '#434c5e',

        nav: '#3b4252',
        'nav-text': '#d0d7e2',
        'nav-hover': '#434c5e',
        'nav-hover-text': '#eceff4',

        header: '#3b4252',
        header2: '#333b4a',
        'header-text': '#d8dee9',

        content: '#2e3440',
        panel: '#3b4252',
        'panel-2': '#434c5e',
        subpanel: '#434c5e',
        'subpanel-2': '#4c566a',

        row: '#333b48',
        'row-alt': '#3b4252',
        'row-alt-2': '#40485a',
        'row-hover': '#4c566a',
        sticky: '#434c5e',
        sticky2: '#48536a',
        sticky3: '#584c62',

        text: '#d3dae6',
        'text-soft': '#a0abbf',
        title: '#e5e9f0',
        'title-hover': '#bf616a',
        link: '#88c0d0',
        'link-strong': '#81a1c1',
        'link-hover': '#8fbcbb',

        accent: '#88c0d0',
        'accent-soft': '#5e81ac',

        btn: '#434c5e',
        'btn-text': '#eceff4',
        'btn-border': '#4c566a',

        input: '#2a303b',
        'input-text': '#d3dae6',

        tooltip: '#232833',
        'tooltip-text': '#d3dae6',
        suggest: '#3b4252',

        free: '#4e4a33',
        twoup: '#4e3a3a',
        twoupfree: '#3d4a35',
        halfdown: '#3a3f55',
        twouphalf: '#354a55',

        'logo-filter': 'invert(0.9) hue-rotate(180deg) saturate(0.8)',
        scrollbar: '#434c5e',
      },
    },

    sepia: {
      name: '纸墨',
      desc: '暖米护眼，浅色但去冷光',
      kind: 'light',
      swatch: ['#d8cfba', '#8a7a5e', '#ece3cd', '#a0692c', '#3f382c'],
      vars: {
        page: '#cfc5ad',
        outer: '#e6ddc8',
        border: '#8a7a5e',
        'border-soft': '#c9bda0',

        nav: '#5c5243',
        'nav-text': '#e8e0cd',
        'nav-hover': '#e6ddc8',
        'nav-hover-text': '#3f382c',

        header: '#efe8d6',
        header2: '#e6dcc6',
        'header-text': '#3f382c',

        content: '#f4eede',
        panel: '#ece3cd',
        'panel-2': '#e0d5ba',
        subpanel: '#e9dfc8',
        'subpanel-2': '#e2d6ba',

        row: '#f0e9d7',
        'row-alt': '#e6dcc6',
        'row-alt-2': '#e2d7bf',
        'row-hover': '#ece2ca',
        sticky: '#e6dcc6',
        sticky2: '#e2d7bf',
        sticky3: '#e8d9cd',

        text: '#3f382c',
        'text-soft': '#7a7060',
        title: '#332c20',
        'title-hover': '#b0522e',
        link: '#6b5b3e',
        'link-strong': '#7a5c2e',
        'link-hover': '#b06f2a',

        accent: '#a0692c',
        'accent-soft': '#c2a76d',

        btn: '#e0d5ba',
        'btn-text': '#4a4131',
        'btn-border': '#c2b390',

        input: '#faf5e9',
        'input-text': '#3f382c',

        tooltip: '#5c5243',
        'tooltip-text': '#f0e9d7',
        suggest: '#ece3cd',

        free: '#f0e6ad',
        twoup: '#f2dcdc',
        twoupfree: '#ddeec5',
        halfdown: '#dcdcf4',
        twouphalf: '#d3ecf2',

        'logo-filter': 'none',
        scrollbar: '#c2b390',
      },
    },

    forest: {
      name: '松烟',
      desc: '松墨入夜，苔绿点睛',
      kind: 'dark',
      swatch: ['#101813', '#1c2a21', '#243529', '#6fae75', '#c8d4c5'],
      vars: {
        page: '#101813',
        outer: '#17221b',
        border: '#0a0f0c',
        'border-soft': '#2c3e31',

        nav: '#1c2a21',
        'nav-text': '#b6c8b4',
        'nav-hover': '#26382c',
        'nav-hover-text': '#e2eee0',

        header: '#1a2820',
        header2: '#141f18',
        'header-text': '#c2cfbf',

        content: '#141f18',
        panel: '#1e2c23',
        'panel-2': '#243529',
        subpanel: '#213026',
        'subpanel-2': '#27392e',

        row: '#182319',
        'row-alt': '#1e2c23',
        'row-alt-2': '#213026',
        'row-hover': '#26382c',
        sticky: '#223427',
        sticky2: '#273a2c',
        sticky3: '#35342a',

        text: '#c8d4c5',
        'text-soft': '#87987f',
        title: '#dfe9da',
        'title-hover': '#e8756f',
        link: '#9cc39a',
        'link-strong': '#7fb884',
        'link-hover': '#62c077',

        accent: '#6fae75',
        'accent-soft': '#3f6a4a',

        btn: '#243529',
        'btn-text': '#cfe0c8',
        'btn-border': '#33503c',

        input: '#0e1710',
        'input-text': '#c8d4c5',

        tooltip: '#0a0f0c',
        'tooltip-text': '#c8d4c5',
        suggest: '#1e2c23',

        free: '#48421f',
        twoup: '#482e2e',
        twoupfree: '#2e4425',
        halfdown: '#2b3a5e',
        twouphalf: '#1f4757',

        'logo-filter': 'invert(0.9) hue-rotate(180deg) saturate(0.85)',
        scrollbar: '#2c3e31',
      },
    },

    /*
     * 青花瓷 — 白地青花。瓷白釉面为底，青花分五色为骨，
     * 矾红一点作睛。配套专属装饰层见 core.css 的 hdw-t-qinghua 区块：
     * 锦地暗纹 / 釉面高光 / 弦纹分隔 / 开光导航 / 影青表头 / 瓷钮描边。
     */
    qinghua: {
      name: '青花瓷',
      desc: '白地青花，瓷韵入屏（深度定制款）',
      kind: 'light',
      swatch: ['#f6f8f8', '#1c4275', '#24558f', '#3c6ca0', '#b5443c'],
      vars: {
        /* page = 绢帛托青，outer/content = 瓷面与釉白 */
        page: '#a7b8c6',
        outer: '#e9eef1',
        border: '#16406e',
        'border-soft': '#b6c9d7',

        /* nav = 头浓青花带 */
        nav: '#1c4275',
        'nav-text': '#d9e5ef',
        'nav-hover': '#2a568c',
        'nav-hover-text': '#ffffff',

        /* header = 釉白 */
        header: '#f9fbfb',
        header2: '#ecf1f3',
        'header-text': '#1e3a5c',

        content: '#f5f8f8',
        panel: '#e3ecf1',
        'panel-2': '#d7e4ec',
        subpanel: '#e6eef3',
        'subpanel-2': '#dce7ef',

        row: '#f1f5f7',
        'row-alt': '#e8eff3',
        'row-alt-2': '#e2ebf1',
        'row-hover': '#d9e6ee',
        sticky: '#d8e6f0',
        sticky2: '#cfe0ec',
        sticky3: '#e9dfe4',

        /* text = 墨青；title = 头浓；hover = 矾红彩 */
        text: '#24364a',
        'text-soft': '#5c7286',
        title: '#143257',
        'title-hover': '#b5443c',
        link: '#24558f',
        'link-strong': '#194a7d',
        'link-hover': '#0d6cb5',

        accent: '#24558f',
        'accent-soft': '#3c6ca0',

        /* btn = 描青瓷钮（白底青字青边） */
        btn: '#eef4f7',
        'btn-text': '#1c4677',
        'btn-border': '#9cb9cf',

        input: '#fbfdfd',
        'input-text': '#24364a',

        /* tooltip = 青花瓷片 */
        tooltip: '#143257',
        'tooltip-text': '#edf3f8',
        suggest: '#eef4f8',

        /* 促销色转瓷调 */
        free: '#f0e6c3',
        twoup: '#efdfe0',
        twoupfree: '#e3eec7',
        halfdown: '#e0e4f5',
        twouphalf: '#d5ecef',

        'logo-filter': 'none',
        scrollbar: '#7ba3c4',
      },
    },

    /*
     * 梅子青 — 龙泉青瓷。无彩绘，装饰全凭釉层厚薄「显色」：
     * 容器积釉渐变（上浅下深）、暗刻纹极淡如影。铁足赭一点作睛。
     * 配套专属装饰层见 core.css 的 hdw-t-meiziqing 区块：
     * 暗刻云纹锦地 / 积釉渐变 / 弦纹分隔 / 莲瓣器足 / 玉瓷钮。
     */
    meiziqing: {
      name: '梅子青',
      desc: '龙泉釉色，温润如玉（深度定制款）',
      kind: 'light',
      swatch: ['#edf2ed', '#7fb5a3', '#4f7c6a', '#8a8683', '#35423a'],
      vars: {
        /* page = 石灰泛青，outer/content = 玉白瓷面 */
        page: '#dde6df',
        outer: '#edf2ed',
        border: '#6f9a87',
        'border-soft': '#cdd9d0',

        /* nav = 积釉深青带 */
        nav: '#4f7c6a',
        'nav-text': '#e6efe8',
        'nav-hover': '#5f8d7a',
        'nav-hover-text': '#ffffff',

        /* header = 釉薄泛白 */
        header: '#f4f8f4',
        header2: '#eaf1ec',
        'header-text': '#2f4639',

        content: '#f3f7f3',
        panel: '#e5eee7',
        'panel-2': '#d9e6dc',
        subpanel: '#e8f0ea',
        'subpanel-2': '#dfeadf',

        row: '#eff4ef',
        'row-alt': '#e7efe9',
        'row-alt-2': '#e2ebe5',
        'row-hover': '#dce7de',
        sticky: '#dfeae1',
        sticky2: '#d8e4da',
        sticky3: '#e8e4d2',

        /* text = 墨青褐（深木褐带绿）；hover = 铁足赭 */
        text: '#35423a',
        'text-soft': '#6d7b70',
        title: '#2d3f34',
        'title-hover': '#9c4f35',
        link: '#3f7a63',
        'link-strong': '#336850',
        'link-hover': '#2e8a66',

        accent: '#5d9480',
        'accent-soft': '#a9c9b9',

        /* btn = 玉瓷钮（玉白底青字青边） */
        btn: '#eaf1ec',
        'btn-text': '#35594a',
        'btn-border': '#b0ccbd',

        input: '#fbfdfb',
        'input-text': '#35423a',

        /* tooltip = 青釉瓷片 */
        tooltip: '#3a6152',
        'tooltip-text': '#eef5ef',
        suggest: '#e9f1ec',

        free: '#f0e9c0',
        twoup: '#f2dcdc',
        twoupfree: '#dfecc5',
        halfdown: '#e0e4f4',
        twouphalf: '#d5ecef',

        'logo-filter': 'none',
        scrollbar: '#9bbcad',
      },
    },

    /*
     * 胭脂红 — 宫廷粉彩。冷调胭脂为地、暗金描线、墨绿透气：
     * 红金为主，金得克制。配套专属装饰层见 core.css 的 hdw-t-yanzhihong 区块：
     * 团花锦地 / 缎面柔光 / 金弦分隔 / 如意纹带 / 描金开光 / 金口圆钮。
     */
    yanzhihong: {
      name: '胭脂红',
      desc: '宫廷粉彩，红金相彰（深度定制款）',
      kind: 'dark',
      swatch: ['#6b1f3a', '#83294a', '#b08d4a', '#4a6b6e', '#ecdfd3'],
      vars: {
        page: '#3f1220',
        outer: '#571b2f',
        border: '#2b0c18',
        'border-soft': '#7d2c44',

        /* nav = 胭脂正色带 */
        nav: '#6b1f3a',
        'nav-text': '#ecd9d3',
        'nav-hover': '#83294a',
        'nav-hover-text': '#ffffff',

        header: '#631e37',
        header2: '#551a2f',
        'header-text': '#e8d5cc',

        content: '#5c1c33',
        panel: '#6d2340',
        'panel-2': '#7d2c48',
        subpanel: '#712844',
        'subpanel-2': '#792e49',

        row: '#621f38',
        'row-alt': '#6b2440',
        'row-alt-2': '#722845',
        'row-hover': '#7f2d4a',
        sticky: '#742946',
        sticky2: '#7e2f4b',
        /* 精华行偏金褐，如器上描金 */
        sticky3: '#71393f',

        /* text = 粉米白；hover = 描金高光 */
        text: '#ecdfd3',
        'text-soft': '#c4a091',
        title: '#f5e9dc',
        'title-hover': '#d4b878',
        link: '#cfab6e',
        'link-strong': '#dcbf85',
        'link-hover': '#e6d196',

        accent: '#b08d4a',
        'accent-soft': '#8c6b35',

        /* btn = 描金勾线钮（红底粉白字金边） */
        btn: '#6d2340',
        'btn-text': '#ecdcc8',
        'btn-border': '#9a7440',

        input: '#4b1527',
        'input-text': '#ecdfd3',

        tooltip: '#33101c',
        'tooltip-text': '#ecdfd3',
        suggest: '#6b2440',

        free: '#4f4526',
        twoup: '#5a2e34',
        twoupfree: '#3d4a35',
        halfdown: '#3a3f55',
        twouphalf: '#354a55',

        'logo-filter': 'invert(0.88) hue-rotate(180deg) saturate(0.75)',
        scrollbar: '#8c3a55',
      },
    },

    /*
     * 曜变 — 建盏油滴。冷玄黑吸光为底、银灰油滴带蓝绿虹光、
     * 亮金严限 5% 面积只做口沿描边与焦点。配套专属装饰层见
     * core.css 的 hdw-t-yaobian 区块：
     * 油滴锦地（纯 radial-gradient 结晶斑）/ 金口沿线 / 曜斑题饰 /
     * 幽光按钮 / 盏形圆钮（黑釉金环）。
     */
    yaobian: {
      name: '曜变',
      desc: '建盏油滴，幽光曜金（深度定制款）',
      kind: 'dark',
      swatch: ['#0d1214', '#131a1c', '#5f6e70', '#6b4f2e', '#d4a94e'],
      vars: {
        page: '#0b0f11',
        outer: '#12181b',
        border: '#05080a',
        'border-soft': '#2a3336',

        /* nav = 冷玄黑，装饰层覆金口沿线 */
        nav: '#151c1f',
        'nav-text': '#a8b4b8',
        'nav-hover': '#20292d',
        'nav-hover-text': '#e9eff1',

        header: '#141a1d',
        header2: '#101519',
        'header-text': '#b0bcc0',

        content: '#10161a',
        panel: '#161e22',
        'panel-2': '#1c252a',
        subpanel: '#182024',
        'subpanel-2': '#1d262b',

        row: '#131a1d',
        'row-alt': '#171f22',
        'row-alt-2': '#192226',
        'row-hover': '#20292d',
        sticky: '#1a2327',
        sticky2: '#1e282c',
        sticky3: '#26252b',

        /* text = 银灰；hover = 亮金（口沿包边同源） */
        text: '#b8c4c8',
        'text-soft': '#6f7e84',
        title: '#dde5e8',
        'title-hover': '#d4a94e',
        link: '#8fa4ad',
        'link-strong': '#a0b5bd',
        /* 虹光蓝：油滴边缘的一线幽蓝 */
        'link-hover': '#5db3bd',

        accent: '#c09a4e',
        'accent-soft': '#6b4f2e',

        btn: '#1a2226',
        'btn-text': '#c4d0d4',
        'btn-border': '#3a4448',

        input: '#0d1315',
        'input-text': '#b8c4c8',

        tooltip: '#070b0c',
        'tooltip-text': '#b8c4c8',
        suggest: '#161e22',

        free: '#4a4426',
        twoup: '#4a3333',
        twoupfree: '#35482b',
        halfdown: '#323a58',
        twouphalf: '#2b4a58',

        'logo-filter': 'invert(0.9) hue-rotate(180deg) saturate(0.7)',
        scrollbar: '#2e393d',
      },
    },

    /*
     * 陶土 — 粗陶野兽派（Neo-brutalism）：粗黑边框、无模糊硬阴影、
     * 直角、砖红 + 墨绿 + 米黄三色对撞、hover 红绿直接切换。
     * 与官窑细瓷（青花 / 胭脂红）构成从精到粗的光谱。
     * 配套专属装饰层见 core.css 的 hdw-t-taotu 区块：
     * 粗黑边硬阴影容器 / 墨绿 nav 红底线 / 红条标题 / 按压式按钮。
     */
    taotu: {
      name: '陶土',
      desc: '粗陶野兽派，硬朗直角（深度定制款）',
      kind: 'light',
      swatch: ['#eee7d7', '#a94b3d', '#315044', '#292b27', '#fff4df'],
      vars: {
        page: '#eee7d7',
        outer: '#f8f2e5',
        border: '#292b27',
        'border-soft': '#b8ae9a',

        /* nav = 墨绿，装饰层加 4px 红底线 */
        nav: '#315044',
        'nav-text': '#fff4df',
        'nav-hover': '#a94b3d',
        'nav-hover-text': '#fff4df',

        header: '#e1d6bd',
        header2: '#d8cdb5',
        'header-text': '#292b27',

        content: '#f8f2e5',
        panel: '#e1d6bd',
        'panel-2': '#d8cdb5',
        subpanel: '#d8cdb5',
        'subpanel-2': '#d2c8b5',

        row: '#f5eddd',
        'row-alt': '#eee7d7',
        'row-alt-2': '#ebe0ca',
        'row-hover': '#ebe0ca',
        sticky: '#e1d6bd',
        sticky2: '#d8cdb5',
        sticky3: '#e8dcc8',

        /* text = 墨黑；link = 砖红，hover 直接切墨绿 */
        text: '#292b27',
        'text-soft': '#5f5a50',
        title: '#292b27',
        'title-hover': '#7a3226',
        link: '#a94b3d',
        'link-strong': '#8f3d31',
        'link-hover': '#315044',

        accent: '#a94b3d',
        'accent-soft': '#b8ae9a',

        /* btn = 砖红底米白字黑边（装饰层加硬阴影与按压位移） */
        btn: '#a94b3d',
        'btn-text': '#fff4df',
        'btn-border': '#292b27',

        input: '#fffaf0',
        'input-text': '#292b27',

        tooltip: '#292b27',
        'tooltip-text': '#fff4df',
        suggest: '#f5eddd',

        free: '#f0e6ad',
        twoup: '#f2dcdc',
        twoupfree: '#ddeec5',
        halfdown: '#dcdcf4',
        twouphalf: '#d3ecf2',

        'logo-filter': 'none',
        scrollbar: '#b8ae9a',
      },
    },

    /*
     * 哥窑 — 开片青釉 x 复古终端：8px 网格底纹如哥窑开片（金丝铁线），
     * 半透明纸层浮于网格之上，苔绿 + 荧光绿（#9bbc0f）点睛，
     * 控件 Courier 等宽、直角粗边、柔和硬阴影。
     * 配套专属装饰层见 core.css 的 hdw-t-geyao 区块：
     * 网格底 / 半透明容器 / 荧光绿激活 / 等宽按钮 / 聚焦绿影。
     */
    geyao: {
      name: '哥窑',
      desc: '开片网格，复古终端（深度定制款）',
      kind: 'light',
      swatch: ['#c6d0c9', '#557c35', '#9bbc0f', '#d9e4c5', '#44483f'],
      vars: {
        page: '#c6d0c9',
        outer: 'rgba(250, 250, 244, 0.72)',
        border: '#44483f',
        'border-soft': '#a5a59b',

        /* nav = 米灰绿半透明（info_block 风），装饰层加底黑线 */
        nav: 'rgba(217, 217, 206, 0.78)',
        'nav-text': '#34452c',
        'nav-hover': '#d4e3bb',
        'nav-hover-text': '#344b29',

        header: 'rgba(226, 226, 216, 0.78)',
        header2: 'rgba(217, 217, 206, 0.78)',
        'header-text': '#34452c',

        content: 'rgba(250, 250, 244, 0.72)',
        panel: 'rgba(213, 223, 197, 0.82)',
        'panel-2': 'rgba(206, 218, 188, 0.85)',
        subpanel: 'rgba(217, 217, 206, 0.82)',
        'subpanel-2': 'rgba(210, 212, 199, 0.85)',

        row: 'rgba(250, 250, 244, 0.6)',
        'row-alt': 'rgba(244, 246, 236, 0.65)',
        'row-alt-2': 'rgba(240, 243, 232, 0.7)',
        'row-hover': 'rgba(238, 243, 229, 0.72)',
        sticky: 'rgba(238, 243, 229, 0.8)',
        sticky2: 'rgba(232, 238, 222, 0.85)',
        sticky3: 'rgba(238, 233, 220, 0.8)',

        /* text = 墨绿灰；link = 苔绿，hover 深绿 */
        text: '#30342d',
        'text-soft': '#666d61',
        title: '#2c3a24',
        'title-hover': '#31551d',
        link: '#557c35',
        'link-strong': '#31551d',
        'link-hover': '#31551d',

        accent: '#557c35',
        'accent-soft': '#9bbc0f',

        /* btn = 浅绿底墨绿字黑边（装饰层加等宽字与硬阴影） */
        btn: '#d9e4c5',
        'btn-text': '#33452a',
        'btn-border': '#3e4538',

        input: 'rgba(255, 254, 245, 0.9)',
        'input-text': '#30342d',

        tooltip: '#34452c',
        'tooltip-text': '#f5f3e8',
        suggest: '#eeeadd',

        free: '#f0e6ad',
        twoup: '#f2dcdc',
        twoupfree: '#ddeec5',
        halfdown: '#dcdcf4',
        twouphalf: '#d3ecf2',

        'logo-filter': 'none',
        scrollbar: '#557c35',
      },
    },

    /*
     * 天青 — 汝窑。「雨过天青云破处」：宋人美学的静与简，
     * 玛瑙入釉的乳浊温润、蝉翼细纹若有若无、晨星寥落、芝麻钉痕。
     * 配套专属装饰层见 core.css 的 hdw-t-tianqing 区块：
     * 蝉翼纹锦地 / 釉面乳浊光 / 晨星微点 / 芝麻钉题饰 / 素器足。
     */
    tianqing: {
      name: '天青',
      desc: '汝窑雨过天青，静的极致（深度定制款）',
      kind: 'light',
      swatch: ['#eaf2f1', '#5f8b8d', '#d7e4e3', '#8a5a4a', '#33413f'],
      vars: {
        /* page = 雨过天空，content = 釉面天青 */
        page: '#d7e4e3',
        outer: '#e6efee',
        border: '#87a3a0',
        'border-soft': '#c3d5d3',

        /* nav = 天青深处（宋器素身，装饰层只加口沿一线） */
        nav: '#5f8b8d',
        'nav-text': '#e5efee',
        'nav-hover': '#73999a',
        'nav-hover-text': '#ffffff',

        header: '#e9f1f0',
        header2: '#e0ebeb',
        'header-text': '#33413f',

        content: '#eaf2f1',
        panel: '#dfebea',
        'panel-2': '#d5e5e4',
        subpanel: '#e2eeed',
        'subpanel-2': '#dae9e8',

        row: '#e9f1f0',
        'row-alt': '#e2edec',
        'row-alt-2': '#deeae9',
        'row-hover': '#d9e8e7',
        sticky: '#dfebea',
        sticky2: '#d9e7e6',
        sticky3: '#e8e9dd',

        /* text = 墨青；hover = 香灰胎泛紫 */
        text: '#33413f',
        'text-soft': '#6e7f7d',
        title: '#2b3a38',
        'title-hover': '#8a5a4a',
        link: '#4a7b7d',
        'link-strong': '#3d6b6d',
        'link-hover': '#2f5e60',

        accent: '#5f8b8d',
        'accent-soft': '#a9c6c5',

        btn: '#e6f0ef',
        'btn-text': '#3d5f60',
        'btn-border': '#a9c2c0',

        input: '#f4f9f8',
        'input-text': '#33413f',

        tooltip: '#4a7274',
        'tooltip-text': '#eaf2f1',
        suggest: '#e6efee',

        free: '#f0e6c0',
        twoup: '#f2dcdc',
        twoupfree: '#ddeec5',
        halfdown: '#e0e4f4',
        twouphalf: '#d5ecef',

        'logo-filter': 'none',
        scrollbar: '#a9c2c0',
      },
    },

    /*
     * 钧天 — 钧窑窑变。「入窑一色，出窑万彩」：铜红在还原焰中
     * 不可预知地熔融——玫瑰紫、海棠红、茄皮紫、天青、月白。
     * 名取《钧天广乐》（天上仙乐）。配套专属装饰层见 core.css 的
     * hdw-t-juntian 区块：熔融渐变锦地（fixed + 40s 窑火未熄缓动）、
     * 月白口沿线 / 海棠表头线 / 乳光 hover / 窑变球激活态。
     */
    juntian: {
      name: '钧天',
      desc: '钧窑窑变，万彩熔融（深度定制款）',
      kind: 'dark',
      swatch: ['#2c2733', '#6e3756', '#9c4a50', '#c9c3cf', '#41626f'],
      vars: {
        page: '#241f2b',
        outer: '#2e2838',
        border: '#171320',
        'border-soft': '#4a3f56',

        /* nav = 紫红渐变带（装饰层加月白口沿） */
        nav: '#472c44',
        'nav-text': '#e3d8e2',
        'nav-hover': '#5d3a56',
        'nav-hover-text': '#f5eef4',

        header: '#3a2f42',
        header2: '#322840',
        'header-text': '#d9cfe0',

        content: '#2c2733',
        panel: '#3a3044',
        'panel-2': '#44384f',
        subpanel: '#3d3347',
        'subpanel-2': '#453a50',

        row: '#302a3a',
        'row-alt': '#362f40',
        'row-alt-2': '#3a3345',
        'row-hover': '#453c52',
        sticky: '#3d3449',
        sticky2: '#443a51',
        sticky3: '#4a3c4a',

        /* text = 月白；link = 海棠粉，hover = 月白亮 */
        text: '#e6e2ea',
        'text-soft': '#a89bb5',
        title: '#f0eaf3',
        'title-hover': '#c9a0b4',
        link: '#d49ab0',
        'link-strong': '#e0b3c5',
        'link-hover': '#c9c3cf',

        accent: '#b06a8a',
        'accent-soft': '#6e4a63',

        btn: '#3f3350',
        'btn-text': '#e6dce8',
        'btn-border': '#5d4a6e',

        input: '#221d2c',
        'input-text': '#e6e2ea',

        tooltip: '#1a1522',
        'tooltip-text': '#e6e2ea',
        suggest: '#3a3044',

        free: '#4f4526',
        twoup: '#5a2e3e',
        twoupfree: '#3d4a35',
        halfdown: '#3a3f55',
        twouphalf: '#2b4a58',

        'logo-filter': 'invert(0.88) hue-rotate(180deg) saturate(0.8)',
        scrollbar: '#5d4a6e',
      },
    },
  };

  /* 跟随系统：深色时套用暗夜，浅色回到原版 */
  const AUTO_DARK = 'slate';

  const KEYS = { theme: 'theme', customCSS: 'customCSS' };
  const DEFAULTS = { theme: 'auto', customCSS: '' };

  function varsToCSS(t) {
    return ':root{' + Object.keys(t.vars)
      .map((k) => '--hdw-' + k + ':' + t.vars[k] + ';')
      .join('') + '}';
  }

  global.HDW_THEMES = THEMES;
  global.HDW_META = { AUTO_DARK, KEYS, DEFAULTS, varsToCSS };
})(typeof self !== 'undefined' ? self : this);
