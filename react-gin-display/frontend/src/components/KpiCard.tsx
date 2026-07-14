import { compact, formatCost, signed } from "../utils/format";

interface Props {
  label: string;
  value: string;
  delta: number;
  deltaSuffix?: string;
  spark?: number[];
  accent?: string;
}

function Spark({ data, accent }: { data: number[]; accent: string }) {
  if (!data.length) return null;
  const w = 96;
  const h = 30;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / span) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const id = "sg-" + accent.replace("#", "");
  return (
    <svg width={w} height={h} className="spark">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={accent} strokeWidth={1.8} />
    </svg>
  );
}

export default function KpiCard({ label, value, delta, deltaSuffix = "%", spark, accent = "#22d3ee" }: Props) {
  const up = delta >= 0;
  return (
    <div className="kpi">
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        <span className={"kpi-delta " + (up ? "up" : "down")}>
          {up ? "▲" : "▼"} {signed(delta)}
          {deltaSuffix}
        </span>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-spark">
        {spark ? <Spark data={spark} accent={accent} /> : <span className="kpi-foot">环比上一周期</span>}
      </div>
    </div>
  );
}

export { compact, formatCost };
