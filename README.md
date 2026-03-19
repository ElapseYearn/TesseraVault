# TesseraScript

TesseraScript 是一个基于 **Obsidian + DataviewJS** 的模块化脚本库，用于构建可复用的卡片、热力图等可视化内容组件。

它的目标不是做一个传统前端工程，而是做一套能够在 **Obsidian Markdown 笔记环境中直接使用** 的轻量模块系统：

- 以 `dataviewjs` 作为主要入口
- 不依赖额外插件体系
- 支持组件化拆分
- 支持 CSS / JS / JSON 配置分离
- 支持组合式视图，例如“卡片 + 热力图”

---

## 项目目标

本项目主要解决以下问题：

1. 在 Obsidian 中通过 `dataviewjs` 渲染自定义模块
2. 将脚本逻辑、样式、配置分开管理
3. 让组件具备可复用性
4. 让复杂视图可以由基础组件组合而成
5. 让使用者尽量通过简单入口调用，而不必每次手写大量 DOM 逻辑

---

## 当前结构

```text
.
|
└─TesseraScript
    ├─components
    │  ├─card
    │  │      config.json
    │  │      demo.md
    │  │      index.js
    │  │      README.md
    │  │      style.css
    │  │
    │  └─heatmap
    |         ...
    │
    ├─core
    │      config.js
    │      css.js
    │      dom.js
    │      file.js
    │      style.js
    │
    ├─shared
    │      base.css
    │      theme.css
    │
    └─views
        └─heatmap-card
                后续内容暂时忽略
```

## 目录说明
### TesseraScript/core
基础能力层，提供全项目通用工具函数。

包括但不限于：

file.js：文件读取
css.js：CSS 注入与去重
dom.js：DOM 创建与辅助操作
config.js：配置读取与合并
style.js：页面级样式控制、宽度调整等
这一层不负责具体组件渲染，只负责提供基础能力。

### TesseraScript/shared
共享样式层，存放全局基础样式和主题变量。

base.css：基础通用样式，例如变量、spacing、radius、基础容器类等
theme.css：主题相关样式，例如深浅色方案、颜色 token 等
原则上这里不放具体组件的业务样式。

### TesseraScript/components
组件层，存放可复用的基础组件。

当前规划包括：

components/card
卡片外壳组件。

负责：

卡片容器结构
标题区 / 元信息区 / 内容区
卡片基础布局与视觉样式
不负责限制卡片内部必须放什么内容。

卡片 body 应支持插入任意 DOM 内容，例如：

文本
列表
热力图
指标模块
自定义内容块
components/heatmap
热力图组件。

负责：

热力图数据结构处理
热力图网格渲染
图例、颜色分级等表现逻辑
它应当可以被渲染到任意容器中，例如单独显示，或嵌入 card 组件内部。

### TesseraScript/views
视图层，存放面向最终使用者的组合模板。

例如：

heatmap-card：一个由 card + heatmap 组合形成的完整视图
视图层通常负责：

接收 DataviewJS 入口参数
调用 core 工具
组合一个或多个 components
输出最终可见结果

## 开发原则
### 分层设计原则
本项目采用三层设计：

1. Core：基础能力
只做工具，不做 UI 业务。

2. Components：基础组件
只做可复用的结构与渲染单元。

3. Views：组合视图
将多个组件拼装成用户可直接调用的结果。

### 组件设计原则
1. 一个组件应当自包含
每个组件目录下尽量包含：

index.js：组件入口
style.css：组件样式
config.json：默认配置
README.md：组件说明
demo.md：示例笔记或演示用法
2. 样式和逻辑分离
组件逻辑与样式分开维护：

JS 负责结构、数据、行为
CSS 负责视觉表现
JSON 负责默认配置
3. 卡片组件只做“容器”
card 组件是一个自由容器，不应绑定固定内容。

这意味着：

卡片可以放文本
卡片可以放热力图
卡片可以放任务列表
卡片可以放任意其他组件
换句话说，card 更像一个可复用的“外壳”。

4. 热力图组件应独立可渲染
heatmap 组件不依赖某个固定页面结构。

它应当能够被渲染到任意父容器中，这样才能方便组合到卡片、面板或 dashboard 中。

### 文件命名规范
推荐统一命名方式：

组件入口：index.js
组件样式：style.css
默认配置：config.json
使用说明：README.md
演示文件：demo.md
这样每个组件目录结构保持一致，降低维护成本。

### CSS 规范
1. 所有组件类名必须带前缀
避免和 Obsidian 主题或其他样式冲突。

推荐前缀：

ts-：TesseraScript 通用前缀
ts-card-*
ts-heatmap-*
例如：

<CSS>
.ts-card {}
.ts-card__header {}
.ts-card__body {}
.ts-heatmap {}
.ts-heatmap__grid {}
.ts-heatmap__cell {}
2. 尽量不要污染全局样式
除 shared/base.css 和 shared/theme.css 外，组件 CSS 应尽量只影响自己的命名空间。

3. 样式注入由 JS 控制
在 DataviewJS 环境中，组件通常需要通过脚本主动读取并注入对应 CSS。

因此组件 JS 应具备“确保样式已加载”的能力，而不是依赖用户手动处理。

### 配置规范
每个组件可配一个 config.json 作为默认配置来源。

例如：

<JSON>
{
  "radius": 16,
  "padding": 16,
  "shadow": true
}
配置建议遵循：

能通过 JSON 定义的默认值尽量放到 JSON 中
运行时再由 JS 合并用户输入参数
