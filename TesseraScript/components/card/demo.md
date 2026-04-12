# Card Demo

`components/card` 现在是一个返回 DOM 节点的轻量卡片组件，适合在 DataviewJS、普通脚本渲染区、仪表盘模块里直接拼装使用。

## 推荐加载方式

```dataviewjs
await dv.view("TesseraScript/tessera.bootstrap");
await dv.view("TesseraScript/core/dom");
await dv.view("TesseraScript/core/file");
await dv.view("TesseraScript/core/css");
await dv.view("TesseraScript/core/config");
await dv.view("TesseraScript/components/card/index");

const card = Tessera.use("card");
```

## 1. 最小示例

```dataviewjs
await dv.view("TesseraScript/tessera.bootstrap");
await dv.view("TesseraScript/core/dom");
await dv.view("TesseraScript/core/file");
await dv.view("TesseraScript/core/css");
await dv.view("TesseraScript/core/config");
await dv.view("TesseraScript/components/card/index");

const card = Tessera.use("card");

dv.container.appendChild(
  card({
    title: "今日任务",
    content: "这里放最基础的卡片内容。",
  })
);
```

## 2. 信息卡片

适合展示说明、摘要、状态文字。

```dataviewjs
await dv.view("TesseraScript/tessera.bootstrap");
await dv.view("TesseraScript/core/dom");
await dv.view("TesseraScript/core/file");
await dv.view("TesseraScript/core/css");
await dv.view("TesseraScript/core/config");
await dv.view("TesseraScript/components/card/index");

const card = Tessera.use("card");

dv.container.appendChild(
  card({
    title: "学习记录",
    meta: "STUDY",
    content: "今天完成了 3 个章节复习，并整理了错题。",
  })
);
```

## 3. 数值卡片

适合 KPI、统计概览、计数信息。

```dataviewjs
await dv.view("TesseraScript/tessera.bootstrap");
await dv.view("TesseraScript/core/dom");
await dv.view("TesseraScript/core/file");
await dv.view("TesseraScript/core/css");
await dv.view("TesseraScript/core/config");
await dv.view("TesseraScript/components/card/index");

const card = Tessera.use("card");

dv.container.appendChild(
  card({
    title: "完成数",
    meta: "TODAY",
    value: 7,
    content: "较昨天多 2 项。",
  })
);
```

## 4. 关闭 Header 分割线

使用 `flags.headerSep` 控制 header 底部分割线。

```dataviewjs
await dv.view("TesseraScript/tessera.bootstrap");
await dv.view("TesseraScript/core/dom");
await dv.view("TesseraScript/core/file");
await dv.view("TesseraScript/core/css");
await dv.view("TesseraScript/core/config");
await dv.view("TesseraScript/components/card/index");

const card = Tessera.use("card");

dv.container.appendChild(
  card({
    title: "无分割线 Header",
    meta: "PLAIN",
    content: "适合内容较短、视觉更轻的卡片。",
    flags: {
      headerSep: false,
    },
  })
);
```

## 5. 自定义 Hover 强调色

使用 `colors.hoverAccent` 控制 hover 时左侧高亮色。

```dataviewjs
await dv.view("TesseraScript/tessera.bootstrap");
await dv.view("TesseraScript/core/dom");
await dv.view("TesseraScript/core/file");
await dv.view("TesseraScript/core/css");
await dv.view("TesseraScript/core/config");
await dv.view("TesseraScript/components/card/index");

const card = Tessera.use("card");

dv.container.appendChild(
  card({
    title: "自定义 Hover",
    meta: "GREEN",
    value: "42",
    content: "将默认紫色 hover 改成绿色。",
    colors: {
      hoverAccent: "#22c55e",
    },
  })
);
```

## 6. 自定义外观

适合局部做仪表盘强调卡、封面卡、专题卡。

```dataviewjs
await dv.view("TesseraScript/tessera.bootstrap");
await dv.view("TesseraScript/core/dom");
await dv.view("TesseraScript/core/file");
await dv.view("TesseraScript/core/css");
await dv.view("TesseraScript/core/config");
await dv.view("TesseraScript/components/card/index");

const card = Tessera.use("card");

dv.container.appendChild(
  card({
    title: "本周聚焦",
    meta: "FOCUS",
    value: "84%",
    content: "这一张覆盖了背景、边框、数值色和 hover 强调色。",
    layout: {
      padding: "20px",
      radius: "12px",
    },
    colors: {
      background: "linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(36, 99, 235, 0.88))",
      border: "rgba(255, 255, 255, 0.18)",
      value: "#ffffff",
      hoverAccent: "#f59e0b",
    },
  })
);
```

## 7. 放入自定义节点

`children` 适合塞入列表、按钮区、Dataview 查询结果等复杂节点。

```dataviewjs
await dv.view("TesseraScript/tessera.bootstrap");
await dv.view("TesseraScript/core/dom");
await dv.view("TesseraScript/core/file");
await dv.view("TesseraScript/core/css");
await dv.view("TesseraScript/core/config");
await dv.view("TesseraScript/components/card/index");

const card = Tessera.use("card");

const list = document.createElement("ul");
list.style.margin = "0";
list.style.paddingLeft = "18px";

["整理项目", "复盘训练", "更新周报"].forEach((text) => {
  const li = document.createElement("li");
  li.textContent = text;
  list.appendChild(li);
});

dv.container.appendChild(
  card({
    title: "待办清单",
    meta: "LIST",
    children: list,
  })
);
```

## 8. 多卡片并排

组件本身只负责单张卡片。多列布局建议交给外层容器处理。

```dataviewjs
await dv.view("TesseraScript/tessera.bootstrap");
await dv.view("TesseraScript/core/file");
await dv.view("TesseraScript/core/css");
await dv.view("TesseraScript/components/card/index");

const card = Tessera.use("card");

const grid = document.createElement("div");
grid.style.display = "grid";
grid.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
grid.style.gap = "16px";

[
  { title: "笔记数", meta: "NOTES", value: 128 },
  { title: "任务数", meta: "DONE", value: 34 },
  { title: "连续天数", meta: "STREAK", value: 12 },
].forEach((item) => {
  grid.appendChild(card(item));
});

dv.container.appendChild(grid);
```

## 9. 配置文件加载

如果你希望多个页面共用默认风格，可以先加载 `config.json`。

```dataviewjs
await dv.view("TesseraScript/tessera.bootstrap");
await dv.view("TesseraScript/core/dom");
await dv.view("TesseraScript/core/file");
await dv.view("TesseraScript/core/css");
await dv.view("TesseraScript/core/config");
await dv.view("TesseraScript/components/card/index");

const card = Tessera.use("card");

await card.loadConfig();

dv.container.appendChild(
  card({
    title: "配置加载示例",
    meta: "CONFIG",
    content: "会优先使用 components/card/config.json 里的默认配置。",
  })
);
```

## 使用建议

1. 卡片内部信息层级尽量保持 2 到 3 层：`title`、`meta`、`value/content` 即可。
2. 统计数字优先放在 `value`，说明文字放在 `content`，不要把长文本塞进 `meta`。
3. `headerSep: false` 适合极简卡片、封面卡、短摘要卡。
4. `hoverAccent` 建议只做少量主题强调，避免同一页面出现太多冲突颜色。
5. 多卡片排版时，让外层容器负责 `grid` 或 `flex`，不要把布局逻辑塞进卡片本身。
6. 大范围统一风格优先写进 `config.json`，单张特殊卡片再局部覆盖。
