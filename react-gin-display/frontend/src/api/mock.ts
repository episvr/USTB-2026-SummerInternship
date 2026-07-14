// 纯前端 Mock 接口层：模拟后端返回 TOKEN 用量报告数据。
// 后续接入 Gin 后端时，只需把这里的实现替换为真实 fetch 即可，调用方无需改动。

export type RangeKey = "7d" | "30d" | "90d";

export interface TrendPoint {
  date: string; // YYYY-MM-DD
  input: number;
  output: number;
  cached: number;
}

export interface ModelShare {
  model: string;
  tokens: number;
}

export interface Consumer {
  name: string;
  tokens: number;
  cost: number;
  trend: number; // 环比，正为增长
}

export interface Kpi {
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  sessions: number;
  cacheHitRate: number;
  delta: {
    totalTokens: number;
    cost: number;
    sessions: number;
    cacheHitRate: number;
  };
}

export interface Report {
  range: RangeKey;
  generatedAt: string;
  kpi: Kpi;
  trend: TrendPoint[];
  models: ModelShare[];
  topConsumers: Consumer[];
  hourly: number[]; // 长度 24，按小时聚合的 token 量
}

// 简单可重复的伪随机，保证同一 range 刷新结果稳定
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MODELS = [
  "gpt-4o",
  "gpt-4o-mini",
  "claude-3.5-sonnet",
  "claude-3-haiku",
  "gemini-1.5-pro",
  "deepseek-v3",
];

const APPS = [
  "客服助手",
  "代码补全",
  "知识库检索",
  "数据分析代理",
  "内容生成",
  "翻译服务",
  "质检审阅",
  "面试陪练",
];

const RANGE_DAYS: Record<RangeKey, number> = { "7d": 7, "30d": 30, "90d": 90 };

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function buildTrend(days: number, rand: () => number): TrendPoint[] {
  const out: TrendPoint[] = [];
  const base = 1_200_000 + rand() * 400_000;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const weekday = d.getDay();
    // 周末用量略低
    const weekendFactor = weekday === 0 || weekday === 6 ? 0.62 : 1;
    const wave = 1 + 0.35 * Math.sin((days - i) / 3.2);
    const noise = 0.82 + rand() * 0.36;
    const total = Math.round(base * weekendFactor * wave * noise);
    const input = Math.round(total * (0.42 + rand() * 0.12));
    const cached = Math.round(input * (0.28 + rand() * 0.22));
    const output = total - input;
    out.push({ date: fmtDate(d), input, output, cached });
  }
  return out;
}

function buildReport(range: RangeKey): Report {
  const days = RANGE_DAYS[range];
  const seed = range.split("").reduce((a, c) => a + c.charCodeAt(0), 7);
  const rand = mulberry32(seed * 9973);

  const trend = buildTrend(days, rand);
  const totalInput = trend.reduce((s, p) => s + p.input, 0);
  const totalOutput = trend.reduce((s, p) => s + p.output, 0);
  const totalTokens = totalInput + totalOutput;
  const totalCached = trend.reduce((s, p) => s + p.cached, 0);

  // 模型分布：按权重分配
  const weights = MODELS.map(() => 0.4 + rand());
  const wsum = weights.reduce((a, b) => a + b, 0);
  const models: ModelShare[] = MODELS.map((m, i) => ({
    model: m,
    tokens: Math.round((totalTokens * weights[i]) / wsum),
  })).sort((a, b) => b.tokens - a.tokens);

  // Top 消费者
  const consumers: Consumer[] = APPS.map((name) => {
    const t = Math.round(totalTokens * (0.05 + rand() * 0.16));
    return {
      name,
      tokens: t,
      cost: Math.round(t * (1.8 + rand() * 2.4)) / 1000, // 千 token 单价
      trend: Math.round((rand() * 60 - 22) * 10) / 10,
    };
  })
    .sort((a, b) => b.tokens - a.tokens)
    .slice(0, 6);

  // 按小时聚合（带明显双峰：上午 + 下午）
  const hourly = Array.from({ length: 24 }, (_, h) => {
    const peak =
      Math.exp(-((h - 10.5) ** 2) / 12) + 0.85 * Math.exp(-((h - 15.5) ** 2) / 10);
    return Math.round((totalTokens / days) * (0.18 + peak) * (0.7 + rand() * 0.6));
  });

  const cost = Math.round(totalTokens * (2.1 + rand() * 1.2)) / 1000;
  const kpi: Kpi = {
    totalTokens,
    inputTokens: totalInput,
    outputTokens: totalOutput,
    cost,
    sessions: Math.round((totalTokens / 1_000_000) * (8 + rand() * 6)),
    cacheHitRate: Math.round((totalCached / Math.max(totalInput, 1)) * 1000) / 10,
    delta: {
      totalTokens: Math.round((rand() * 50 - 14) * 10) / 10,
      cost: Math.round((rand() * 44 - 12) * 10) / 10,
      sessions: Math.round((rand() * 40 - 10) * 10) / 10,
      cacheHitRate: Math.round((rand() * 18 - 4) * 10) / 10,
    },
  };

  return {
    range,
    generatedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    kpi,
    trend,
    models,
    topConsumers: consumers,
    hourly,
  };
}

// 模拟网络延迟
function delay<T>(value: T, ms = 420): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetchReport(range: RangeKey): Promise<Report> {
  return delay(buildReport(range));
}
