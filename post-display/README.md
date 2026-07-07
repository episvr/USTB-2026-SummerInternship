# Post Display Dashboard

一个基于 Vue 3 + Vite + ECharts 的纯前端数据大屏项目，用于展示帖子数量、热门标签分布以及敏感舆论管控情况。数据均为本地模拟数据。

## 功能

- 帖子核心指标展示（总帖数、今日发帖、敏感帖数、待处理）
- 发帖趋势折线图（普通帖 + 敏感帖）
- 舆情情感分布饼图（正面 / 中性 / 负面）
- 热门标签云
- 敏感舆论监控列表（级别、状态、触达人数等）
- 实时右上角时钟

## 技术栈

- Vue 3（Composition API）
- Vite
- ECharts 5
- 原生 CSS 变量主题

## 快速开始

```bash
cd post-display
npm install
npm run dev
```

浏览器打开 `http://localhost:5173/`。

## 构建

```bash
npm run build
```

构建产物位于 `dist/` 目录。

## 项目结构

```
post-display/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── style.css
│   ├── mock/
│   │   └── data.js       # 模拟数据
│   └── components/
│       ├── StatCard.vue
│       ├── TrendChart.vue
│       ├── SentimentChart.vue
│       ├── TagCloud.vue
│       └── SensitiveMonitor.vue
```

## 数据说明

所有展示数据均为 `src/mock/data.js` 中的静态模拟数据，可按需替换为真实 API 调用。
