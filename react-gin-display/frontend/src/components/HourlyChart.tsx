import { useLayoutEffect, useRef, useState } from "react";
import { compact } from "../utils/format";

interface Props {
  data: number[];
}

function useWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((e) => {
      const cw = e[0].contentRect.width;
      if (cw > 0) setW(cw);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export default function HourlyChart({ data }: Props) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data, 1);
  const barW = width / data.length;
  const height = 160;

  return (
    <div ref={ref} className="hourly">
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff7a59" />
            <stop offset="100%" stopColor="#f7c14b" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {data.map((v, i) => {
          const h = (v / max) * (height - 24);
          const x = i * barW;
          const on = hover === i;
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect
                x={x + 1.5}
                y={height - 20 - h}
                width={Math.max(2, barW - 3)}
                height={h}
                rx={2}
                fill={on ? "#ffd9a0" : "url(#hourGrad)"}
                opacity={on ? 1 : 0.85}
              />
              {(i % 3 === 0 || on) && (
                <text x={x + barW / 2} y={height - 6} className="hour-x" textAnchor="middle">
                  {i}
                </text>
              )}
              {on && (
                <text x={x + barW / 2} y={height - 24 - h} className="hour-val" textAnchor="middle">
                  {compact(v)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
