# 霓虹贪吃蛇 (Neon Snake)

一个使用 Vite + 原生 JavaScript 构建的高完成度贪吃蛇网页游戏，采用经典的 TokyoNight 暗色主题。

## 特性

- 霓虹风格的 TokyoNight 配色
- 粒子特效与合成音效
- 难度选择（普通 / 困难 / 疯狂）
- 等级提升与速度递增
- 限时食物机制
- 最高分本地存储
- 暂停功能（空格键）
- Vim 模式：开启后只能用 `h` `j` `k` `l` 控制
- 移动端触控 + 方向键支持

## 操作

| 模式 | 上 | 下 | 左 | 右 | 暂停 |
|------|----|----|----|----|------|
| 默认 | ↑ / W | ↓ / S | ← / A | → / D | 空格 |
| Vim | k | j | h | l | 空格 |

## 快速开始

```bash
# 进入项目目录
cd snake-vim

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器访问 `http://localhost:5173/` 即可游玩。

## 构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

## 技术栈

- Vite
- HTML5 Canvas
- Web Audio API
- 原生 ES Modules

## 项目结构

```
snake-vim/
├── index.html
├── main.js
├── style.css
├── package.json
├── src/
│   ├── audio.js      # 音效管理
│   ├── config.js     # 游戏配置与常量
│   ├── game.js       # 核心游戏逻辑
│   ├── input.js      # 键盘/触摸输入
│   ├── particles.js  # 粒子系统
│   └── renderer.js   # Canvas 渲染
└── dist/             # 构建产物（git 忽略）
```
