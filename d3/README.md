# D3 - Tsar 监控数据分析面板

基于 tsar 采集的磁盘（disk）与性能（pref）监控数据，提供数据导入、API 服务与可视化看板的完整方案。

## 目录结构

```
d3/
├── backend/                # FastAPI 后端
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py         # 路由与 API 入口
│       ├── db.py           # PostgreSQL 查询封装
│       └── importer.py     # .dat 数据导入
├── dashboard/              # Vue 3 + ECharts 前端
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── App.vue
│       ├── parser.js       # .dat 解析
│       └── components/     # 各可视化组件
├── docker-compose.yml      # 一键编排（db + backend + frontend）
├── er_diagram.md           # 数据库 ER 图与表结构说明
├── aggregate_hourly.py     # 按小时聚合脚本
└── *.dat                   # tsar 原始数据（disk_tsar / pref_tsar / host_detail / mod_detail）
```

## 架构

- **数据层**：PostgreSQL 16，存储 `host_detail`、`mod_detail`、`disk_tsar`、`pref_tsar` 四张表。
- **后端**：FastAPI 提供 REST API，启动时自动将 `.dat` 数据导入数据库。
- **前端**：Vue 3 + ECharts 通过 Nginx 托管静态页面，调用后端 `/api/*` 接口渲染看板。

## 快速开始

### 使用 Docker（推荐）

```bash
cd d3
docker compose up --build
```

启动后访问 http://localhost:8080 。

- `db`：PostgreSQL，数据库 `monitor`，账号 `monitor/monitor123`
- `backend`：API 服务（容器内挂载 `dashboard/public/data` 为只读数据目录）
- `frontend`：Nginx 暴露 8080 端口

### 本地开发

**后端**

```bash
cd d3/backend
pip install -r requirements.txt
export DATABASE_URL=postgresql://monitor:monitor123@localhost:5432/monitor
export DATA_DIR=../dashboard/public/data
uvicorn app.main:app --reload --port 8000
```

**前端**

```bash
cd d3/dashboard
npm install
npm run dev      # 开发服务器
npm run build    # 构建静态产物到 dist/
```

## API 概览

所有接口支持 `?hours=N` 按最近 N 小时过滤。

| 接口 | 说明 |
|------|------|
| `GET /api/stats` | 总体统计卡片数据 |
| `GET /api/disk/trend` | 磁盘指标趋势 |
| `GET /api/pref/trend` | 性能指标趋势 |
| `GET /api/disk/host-ranking` | 主机磁盘使用排名 |
| `GET /api/disk/heatmap` | 磁盘热力图数据 |
| `GET /api/disk/scatter` | 利用率/await 散点图 |
| `GET /api/completeness` | 数据完整度 |
| `GET /api/hosts` | 全部主机列表 |
| `GET /api/modules` | 全部指标模块列表 |

详细表结构与字段含义见 [er_diagram.md](./er_diagram.md)。

## 数据格式

`.dat` 文件为 tsar 导出的监控数据，由 `dashboard/src/parser.js` 解析，后端 `importer.py` 负责导入数据库。原始数据结构说明见 ER 图文档。
