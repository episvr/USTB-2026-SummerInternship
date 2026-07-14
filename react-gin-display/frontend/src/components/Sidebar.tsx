import { useState } from "react";

const NAV = [
  { key: "report", label: "用量报告", icon: "M3 3v18h18 M7 14l3-4 3 3 4-6" },
  { key: "models", label: "模型分析", icon: "M4 6h16 M4 12h10 M4 18h7" },
  { key: "apps", label: "应用排行", icon: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z" },
  { key: "cost", label: "成本中心", icon: "M12 2v20 M5 6l7 5 7-5" },
  { key: "realtime", label: "实时监控", icon: "M12 8v4l3 2 M12 2a10 10 0 100 20 10 10 0 000-20z" },
  { key: "audit", label: "审计日志", icon: "M5 3h11l3 3v15H5z M9 8h6 M9 12h6 M9 16h4" },
  { key: "settings", label: "系统设置", icon: "M12 9a3 3 0 100 6 3 3 0 000-6z M19 12a7 7 0 00-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 00-1.7-1L14.5 3h-4l-.3 2.5a7 7 0 00-1.7 1l-2.4-1-2 3.5L3.1 11A7 7 0 003 12c0 .3 0 .7.1 1l-2 1.5 2 3.5 2.4-1a7 7 0 001.7 1l.3 2.5h4l.3-2.5a7 7 0 001.7-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1z" },
];

export default function Sidebar() {
  const [active, setActive] = useState("report");
  return (
    <aside className="sidebar">
      <nav className="nav">
        {NAV.map((n) => (
          <button
            key={n.key}
            className={"nav-item " + (active === n.key ? "active" : "")}
            onClick={() => setActive(n.key)}
          >
            <span className="nav-rail" />
            <svg viewBox="0 0 24 24" className="nav-icon" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d={n.icon} />
            </svg>
            <span className="nav-label">{n.label}</span>
          </button>
        ))}
      </nav>
      <div className="nav-foot">
        <div className="nav-foot-dot" />
        服务状态 · 正常
      </div>
    </aside>
  );
}
