# AI Agent 任务书：青花瓷 → 宣德 站点主题升级

> 本文档面向自动化执行者（AI agent / 运维脚本）。目标是把站点当前接入的
> 青花瓷独立主题 CSS 替换为宣德。全程只动 **1 个引用或 1 个文件**，
> 不改站点任何 PHP / main.css / DOM / 数据库结构。

## 0. 输入与假设

- 交付文件（与本文件同目录）：`xuande.css`、`README.md`、`升级交接清单.md`
- 站点现状假设：已通过下列三种方式之一接入 `qinghua.css`（若三种都未发现，**停止并向人工报告**，勿自行创造接入方式）
- 技术事实（可信，勿重复推导）：xuande.css 与 qinghua.css 的 `:root` 47 个 `--hdw-*` 变量、基础覆盖层、等级色还原层**完全相同**，仅装饰层不同——替换无配色回归风险。

## 1. 前置检查（先探测接入方式）

按顺序探测，命中即停：

```bash
# 方式 A：页头直连
grep -rn "qinghua\.css" /path/to/site --include="*.php" --include="*.html"
# 命中 stdhead.php 或模板 → 接入方式 A

# 方式 B：NexusPHP 主题目录注册
ls /path/to/site/themes/qinghua/ 2>/dev/null
# 存在目录且后台注册 → 接入方式 B

# 方式 C：用户级自定义 CSS（数据库字段）
# NexusPHP 用户表 customcss 字段含 "--hdw-page: #a7b8c6" → 接入方式 C
```

同时记录当前加载顺序证据（qinghua.css 的引用必须位于 main.css 引用**之后**——替换后保持同位置即可）。

## 2. 执行（按探测结果三分支）

### 分支 A：页头 link 替换

```bash
# 1. 部署新文件
mkdir -p /path/to/site/themes/xuande && cp xuande.css /path/to/site/themes/xuande/

# 2. 替换引用（保持原位置，勿移动行）
# 旧：<link rel="stylesheet" href="/themes/qinghua/qinghua.css">
# 新：<link rel="stylesheet" href="/themes/xuande/xuande.css">
sed -i 's#themes/qinghua/qinghua\.css#themes/xuande/xuande.css#g' /path/to/site/stdhead.php
```

原 qinghua 目录**保留不删**（并存皮肤，供回滚）。

### 分支 B：主题目录注册

```bash
mkdir -p /path/to/site/themes/xuande && cp xuande.css /path/to/site/themes/xuande/
# 后台（数据库 themes 表 / 管理面板）注册「宣德」为可选样式 → 需人工或后台 API，agent 停在此步报告
```

### 分支 C：用户自定义样式

属于用户个人数据——**agent 不代改**，输出指引让用户自行粘贴替换。

## 3. 验证（分支 A/B 执行后必做）

```bash
# 3.1 引用生效
curl -s https://<site>/ | grep -o 'themes/xuande/xuande\.css'
# 期望：命中

# 3.2 CSS 关键规则抽查（下载后检查）
curl -s https://<site>/themes/xuande/xuande.css > /tmp/x.css
grep -c 'data:image/svg+xml' /tmp/x.css        # 期望 ≥ 12（纹样在）
grep -c '#back_to_top::before' /tmp/x.css      # 期望 ≥ 1（莲瓣钮去箭头）
grep -c 'hdw-xd-still' /tmp/x.css              # 期望 0（独立版无开关类；有则文件错误）
```

浏览器级人工抽验项（输出给人工，agent 不做渲染断言）：
- nav 莲头有分水淡彩 + 银白锡光斑；每 8s 一道亮光左→右传递
- 表格行 hover 出现白瓷提亮 + 左右描青竖线
- 返回顶部为青地白莲圆钮、无三角
- 等级色（Uploader / VIP）与原版一致

## 4. 回滚

```bash
sed -i 's#themes/xuande/xuande\.css#themes/qinghua/qinghua.css#g' /path/to/site/stdhead.php
```
（或后台把默认皮肤切回「青花瓷」。）两版变量与基础层相同，即换即回，无中间态。

## 5. 禁止事项

1. **不得**修改站点 `main.css`、任何 PHP 逻辑、DOM 结构
2. **不得**把 xuande.css 合并进 main.css（必须保持后加载的独立文件——同级特异性靠顺序取胜）
3. **不得**删除或改写 CSS 内的等级色还原层（`原色还原` 注释段）
4. **不得**引入任何 JS（流光是纯 CSS mask 动画）
5. **不得**删除原 qinghua 目录（回滚依赖）
6. 用户级自定义样式（分支 C）**不得**代用户修改

## 6. 故障排查

| 症状 | 原因 | 处置 |
|---|---|---|
| 整页无主题效果 | xuande.css 在 main.css 之前加载 | 把 link 移到 main.css 之后 |
| 纹样全无、纯色 | data-URI 被传输层转义/截断 | 校验文件完整性（3.2 的 grep 计数），重新上传二进制安全模式 |
| 等级色变化 | 还原层被误删/顺序错乱 | 重新部署完整 xuande.css |
| 流光不动、其余正常 | 用户系统开了减少动态效果；或浏览器过旧不支持 mask 动画 | 均为预期降级（微亮底仍在），无需处理 |
| 表头无色带 | 站点模板表结构有自定义改动 | 对照 `升级交接清单.md` 差异表，向人工报告具体页面 |
