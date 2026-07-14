import type { Consumer } from "../api/mock";
import { compact, formatCost, signed } from "../utils/format";

interface Props {
  data: Consumer[];
}

export default function RankList({ data }: Props) {
  const max = Math.max(...data.map((d) => d.tokens), 1);
  return (
    <ul className="rank">
      {data.map((c, i) => (
        <li key={c.name} className="rank-item">
          <span className="rank-no">{String(i + 1).padStart(2, "0")}</span>
          <div className="rank-body">
            <div className="rank-head">
              <span className="rank-name">{c.name}</span>
              <span className="rank-tok">{compact(c.tokens)} tok</span>
            </div>
            <div className="rank-track">
              <div
                className="rank-fill"
                style={{ ["--w" as string]: `${(c.tokens / max) * 100}%`, animationDelay: `${i * 60}ms` } as React.CSSProperties}
              />
            </div>
            <div className="rank-foot">
              <span>{formatCost(c.cost)}</span>
              <span className={c.trend >= 0 ? "up" : "down"}>
                {c.trend >= 0 ? "↑" : "↓"} {signed(c.trend)}%
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
