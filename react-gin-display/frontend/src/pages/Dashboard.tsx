import { useEffect, useMemo, useState } from "react";
import { fetchReport, type RangeKey, type Report } from "../api/mock";
import { compact, formatCost, formatNumber } from "../utils/format";
import KpiCard from "../components/KpiCard";
import AreaChart from "../components/AreaChart";
import DonutChart from "../components/DonutChart";
import RankList from "../components/RankList";
import HourlyChart from "../components/HourlyChart";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "7d", label: "近 7 天" },
  { key: "30d", label: "近 30 天" },
  { key: "90d", label: "近 90 天" },
];

export default function Dashboard() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchReport(range).then((r) => {
      if (alive) {
        setReport(r);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [range]);

  const sparks = useMemo(() => {
    if (!report) return null;
    const t = report.trend;
    return {
      total: t.map((d) => d.input + d.output),
      input: t.map((d) => d.input),
      output: t.map((d) => d.output),
    };
  }, [report]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">TOKEN 用量报告</h1>
          <p className="page-sub">
            实时追踪模型调用、成本与缓存命中 · 数据生成于 {report?.generatedAt ?? "—"}
          </p>
        </div>
        <div className="range-tabs">
          {RANGES.map((r) => (
            <button
              key={r.key}
              className={"range-tab " + (range === r.key ? "on" : "")}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading || !report || !sparks ? (
        <div className="loading">
          <div className="spinner" />
          正在拉取 {range} 用量数据…
        </div>
      ) : (
        <>
          <section className="kpi-grid">
            <KpiCard
              label="总 Token 消耗"
              value={compact(report.kpi.totalTokens)}
              delta={report.kpi.delta.totalTokens}
              spark={sparks.total}
              accent="#ff7a59"
            />
            <KpiCard
              label="预估成本"
              value={formatCost(report.kpi.cost)}
              delta={report.kpi.delta.cost}
              spark={sparks.output}
              accent="#f7c14b"
            />
            <KpiCard
              label="活跃会话"
              value={formatNumber(report.kpi.sessions)}
              delta={report.kpi.delta.sessions}
              spark={sparks.input}
              accent="#5eead4"
            />
            <KpiCard
              label="缓存命中率"
              value={report.kpi.cacheHitRate.toFixed(1) + "%"}
              delta={report.kpi.delta.cacheHitRate}
              accent="#a5a8f0"
            />
          </section>

          <section className="grid-2">
            <div className="card chart-card">
              <div className="card-head">
                <div>
                  <h3>Token 消耗趋势</h3>
                  <span className="card-sub">输入 / 输出 堆叠 · 按日聚合</span>
                </div>
                <div className="legend-inline">
                  <span><i className="dot dot-in" /> 输入 {compact(report.kpi.inputTokens)}</span>
                  <span><i className="dot dot-out" /> 输出 {compact(report.kpi.outputTokens)}</span>
                </div>
              </div>
              <AreaChart data={report.trend} />
            </div>

            <div className="card">
              <div className="card-head">
                <div>
                  <h3>模型分布</h3>
                  <span className="card-sub">各模型 Token 占比</span>
                </div>
              </div>
              <DonutChart data={report.models} />
            </div>
          </section>

          <section className="grid-2">
            <div className="card">
              <div className="card-head">
                <div>
                  <h3>Top 应用消耗</h3>
                  <span className="card-sub">按 Token 量排序</span>
                </div>
              </div>
              <RankList data={report.topConsumers} />
            </div>

            <div className="card">
              <div className="card-head">
                <div>
                  <h3>24 小时负载</h3>
                  <span className="card-sub">按调用时段聚合</span>
                </div>
              </div>
              <HourlyChart data={report.hourly} />
              <div className="hour-summary">
                峰值时段 10:00–11:00 与 15:00–16:00，夜间负载低于日均 30%。
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
