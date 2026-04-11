# Card 组件设计规范检查报告

## 检查范围

- 项目根目录所有md文档：规范.md、开发详情.md、config原理与功能详解.md、README.md、TesseraScript 使用示例.md
- TesseraScript/components/card 目录下的所有文件

---

## 总体评价

Card组件**基本框架符合规范**，但存在几个**关键不符合项**需要修复。

---

## 符合规范的方面

### 1. 目录结构

| 要求文件 | 实际存在 |
|---------|---------|
| index.js | ✅ |
| style.css | ✅ |
| config.json | ✅ |
| README.md | ✅ |
| demo.md | ✅ |

### 2. 命名规范

- ✅ 目录名 `card` 使用小写英文
- ✅ 模块ID使用 `components/card` 格式
- ✅ CSS类名全部使用 `ts-` 前缀（如 `.ts-card`, `.ts-card__header` 等）
- ✅ 使用BEM命名规范

### 3. 样式文件规范

- ✅ 样式只作用于 `.ts-card` 前缀范围内
- ✅ 不污染全局样式
- ✅ 使用CSS变量兼容Obsidian主题

### 4. index.js 基本结构

- ✅ 使用 `Tessera.define("components/card", ...)` 注册模块
- ✅ 正确引入 `../core/css` 依赖
- ✅ 实现自动样式注入（ensureStyles / getStylePromise）

### 5. 样式文件内容

- ✅ 包含完整的组件样式和变体
- ✅ 包含响应式布局（`@media`）
- ✅ 包含多卡片布局容器（`.ts-card-row` 及预设）

---

## 不符合规范的问题

### 1. 导出语句不完整（高优先级）

**规范要求**（规范.md 第4.3节）：
```javascript
module.exports = card;
module.exports.card = card;
```

**实际代码**（index.js 第236行）：
```javascript
module.exports = card;
```

**问题**：缺少 `module.exports.card = card;`，这会影响聚合入口使用 `card.card || card` 模式。

---

### 2. 配置系统未接入（高优先级）

**规范要求**（规范.md 第6节）：
组件应通过 `core/config.js` 读取 `config.json`，实现三层配置合并：
```
fallback默认值 + config.json + options = 最终配置
```

**实际代码**：
- `index.js` 第28-37行直接在函数内部硬编码配置
- 存在 `config.json` 文件，但**完全未被读取**
- 没有使用 `config.createScope()` 和 `config.merge()`

**config.json 文件内容**（已存在但未使用）：
```json
{
  "title": "Default Card",
  "meta": "Configured by JSON",
  "value": null,
  "emptyText": "No content",
  "flags": {
    "showHeader": true,
    "showTitle": true,
    "showMeta": true,
    "showValue": true
  },
  "layout": {
    "maxWidth": "100%",
    "padding": "16px",
    "radius": "16px",
    "gap": "14px",
    "bodyGap": "12px"
  },
  "colors": {
    "background": "linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(245, 248, 252, 0.9))",
    "border": "rgba(120, 140, 160, 0.18)",
    "shadow": "0 12px 28px rgba(15, 23, 42, 0.08)",
    "value": "var(--text-accent, var(--text-normal))"
  }
}
```

---

### 3. README示例代码无法运行（高优先级）

README.md 第22行示例：
```javascript
await card.loadConfig();
```

**问题**：实际代码中**不存在** `loadConfig` 方法，这会导致用户按照示例使用时报错。

---

### 4. 样式注入ID建议调整（中优先级）

**规范建议**（规范.md 第13节）：
```javascript
id: "components-card"
```

**实际代码**：
```javascript
id: "ts-card"
```

---

## 修复建议

建议按照 规范.md 第12节提供的模板进行以下修改：

### 1. 补全导出语句
```javascript
module.exports = card;
module.exports.card = card;
```

### 2. 接入配置系统

参考规范.md第12节模板，在index.js中添加：

```javascript
const createConfigController = require("../core/config");
const config = createConfigController();

const defaultCardConfig = {
  flags: {
    showHeader: true,
    showTitle: true,
    showMeta: true,
    showValue: false,
  },
  layout: {
    padding: "16px",
    radius: "10px",
  },
};

const cardConfig = config.createScope({
  path: "TesseraScript/components/card/config.json",
  fallback: defaultCardConfig,
});

function loadCardConfig(options = {}) {
  return cardConfig.load(options).catch(() => cardConfig.get());
}
```

然后在组件函数中：
```javascript
function card(options = {}) {
  ensureStyles();
  const resolved = cardConfig.merge(options);
  // ... 使用 resolved 而非硬编码配置
}
```

并导出：
```javascript
module.exports.loadConfig = loadCardConfig;
```

### 3. 更新README

移除或修正 README.md 中关于 `loadConfig()` 的引用，确保示例代码可运行。

---

## 总结

| 检查项 | 状态 |
|-------|------|
| 目录结构完整 | ✅ |
| 命名规范 | ✅ |
| CSS类名前缀 | ✅ |
| 模块注册方式 | ✅ |
| 样式注入机制 | ✅ |
| 导出语句完整 | ❌ |
| 配置系统接入 | ❌ |
| README可运行 | ❌ |

**建议优先级**：导出语句和配置系统接入为高优先级，应尽快修复；README可运行性也需要同步修正。