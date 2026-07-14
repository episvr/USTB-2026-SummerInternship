import { useLayoutEffect, useRef, useState } from "react";
import type { TrendPoint } from "../api/mock";
import { compact } from "../utils/format";

interface Props {
  data: TrendPoint[];
  height?: number;
}

function useWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(800);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const cw = entries[0].contentRect.width;
      if (cw > 0) setW(cw);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export default function AreaChart({ data, height = 300 }: Props) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState<number | null>(null);

  const padL = 52;
  const padR = 16;
  const padT = 16;
  const padB = 28;
  const innerW = Math.max(10, width - padL - padR);
  const innerH = Math.max(10, height - padT - padB);

  const maxTotal = Math.max(...data.map((d) => d.input + d.output), 1);
  const niceMax = Math.ceil(maxTotal / 1e6) * 1e6;

  const x = (i: number) =>
    padL + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => padT + innerH - (v / niceMax) * innerH;

  const inputArea =
    `M ${x(0)} ${y(data[0].input)} ` +
    data
      .map((d, i) => `L ${x(i)} ${y(d.input)}`)
      .join(" ") +
    ` L ${x(data.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  const outputArea =
    `M ${x(0)} ${y(data[0].input + data[0].output)} ` +
    data
      .map((d, i) => `L ${x(i)} ${y(d.input + d.output)}`)
      .join(" ") +
    ` L ${x(data.length - 1)} ${y(data[0].input)} ` +
    data
      .map((_, i) => `L ${x(data.length - 1 - i)} ${y(data[data.length - 1 - i].input)}`)
      .join(" ") +
    " Z";

  const lineInput = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.input)}`).join(" ");
  const lineTotal = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.input + d.output)}`)
    .join(" ");

  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => (niceMax / yTicks) * i);

  // x 轴标签取 ~7 个
  const labelStep = Math.max(1, Math.ceil(data.length / 7));
  const xLabels = data
    .map((d, i) => ({ d, i }))
    .filter(({ i }) => i % labelStep === 0 || i === data.length - 1);

  function onMove(e: React.MouseEvent<SVGRectElement>) {
    const rect = (e.currentTarget as SVGRectElement).getBoundingClientRect();
    const px = e.clientX - rect.left;
    const ratio = (px - padL) / innerW;
    const idx = Math.round(ratio * (data.length - 1));
    setHover(Math.min(data.length - 1, Math.max(0, idx)));
  }

  const hp = hover !== null ? data[hover] : null;

  return (
    <div ref={ref} className="chart-wrap">
      <svg width={width} height={height} role="img">
        <defs>
          <linearGradient id="gradInput" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff7a59" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ff7a59" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="gradOutput" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a5a8f0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#a5a8f0" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={y(t)} x2={width - padR} y2={y(t)} className="grid" />
            <text x={padL - 8} y={y(t) + 4} className="axis-y">
              {compact(t)}
            </text>
          </g>
        ))}

        <path d={inputArea} fill="url(#gradInput)" />
        <path d={outputArea} fill="url(#gradOutput)" />
        <path d={lineInput} fill="none" stroke="#ff7a59" strokeWidth={2} />
        <path d={lineTotal} fill="none" stroke="#a5a8f0" strokeWidth={2} />

        {xLabels.map(({ d, i }) => (
          <text key={i} x={x(i)} y={height - 8} className="axis-x">
            {d.date.slice(5)}
          </text>
        ))}

        {hp && (
          <g>
            <line x1={x(hover!)} y1={padT} x2={x(hover!)} y2={padT + innerH} className="hover-line" />
            <circle cx={x(hover!)} cy={y(hp.input)} r={4} fill="#ff7a59" />
            <circle cx={x(hover!)} cy={y(hp.input + hp.output)} r={4} fill="#a5a8f0" />
          </g>
        )}

        <rect
          x={padL}
          y={padT}
          width={innerW}
          height={innerH}
          fill="transparent"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        />
      </svg>

      {hp && hover !== null && (
        <div
          className="chart-tip"
          style={{
            left: Math.min(Math.max(x(hover) - 70, 4), width - 150),
            top: padT + 4,
          }}
        >
          <div className="tip-date">{hp.date}</div>
          <div className="tip-row">
            <span className="dot dot-in" /> 输入 {compact(hp.input)}
          </div>
          <div className="tip-row">
            <span className="dot dot-out" /> 输出 {compact(hp.output)}
          </div>
          <div className="tip-row tip-total">合计 {compact(hp.input + hp.output)}</div>
        </div>
      )}
    </div>
  );
}
