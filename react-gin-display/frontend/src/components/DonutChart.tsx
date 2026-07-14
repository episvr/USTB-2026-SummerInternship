import { useState } from "react";
import type { ModelShare } from "../api/mock";
import { compact } from "../utils/format";

const PALETTE = [
  "#ff7a59",
  "#ffa45c",
  "#f7c14b",
  "#5eead4",
  "#7dd3fc",
  "#a5a8f0",
];

interface Props {
  data: ModelShare[];
}

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
  const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${p0[0]} ${p0[1]} A ${r} ${r} 0 ${large} 1 ${p1[0]} ${p1[1]}`;
}

export default function DonutChart({ data }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.tokens, 0) || 1;
  const cx = 110;
  const cy = 110;
  const r = 86;
  const inner = 56;

  let angle = -Math.PI / 2;
  const segs = data.map((d, i) => {
    const frac = d.tokens / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    return { ...d, a0, a1, i, frac };
  });

  const focused = active !== null ? segs[active] : null;

  return (
    <div className="donut">
      <svg width={220} height={220} viewBox="0 0 220 220">
        {segs.map((s) => {
          const gap = 0.012;
          const a0 = s.a0 + gap;
          const a1 = s.a1 - gap;
          const mid = (a0 + a1) / 2;
          const rr = s.i === active ? r + 6 : r;
          const textR = (r + inner) / 2;
          const tx = cx + textR * Math.cos(mid);
          const ty = cy + textR * Math.sin(mid);
          return (
            <g key={s.i}>
              <path
                d={arc(cx, cy, rr, a0, a1)}
                fill="none"
                stroke={PALETTE[s.i % PALETTE.length]}
                strokeWidth={r - inner}
                strokeLinecap="butt"
                onMouseEnter={() => setActive(s.i)}
                onMouseLeave={() => setActive(null)}
                style={{ cursor: "pointer", transition: "stroke-width .15s" }}
              />
              {s.frac > 0.06 && (
                <text x={tx} y={ty + 4} className="donut-pct" textAnchor="middle">
                  {Math.round(s.frac * 100)}%
                </text>
              )}
            </g>
          );
        })}
        <text x={cx} y={cy - 6} className="donut-center" textAnchor="middle">
          {focused ? compact(focused.tokens) : compact(total)}
        </text>
        <text x={cx} y={cy + 14} className="donut-sub" textAnchor="middle">
          {focused ? focused.model : "总 Token"}
        </text>
      </svg>
      <ul className="donut-legend">
        {segs.map((s) => (
          <li
            key={s.i}
            className={active === s.i ? "on" : ""}
            onMouseEnter={() => setActive(s.i)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="sw" style={{ background: PALETTE[s.i % PALETTE.length] }} />
            <span className="lg-name">{s.model}</span>
            <span className="lg-val">{Math.round(s.frac * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
