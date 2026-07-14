import { useEffect, useState } from "react";

export default function TopBar() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const clock = now.toLocaleTimeString("zh-CN", { hour12: false });
  const date = now.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">
          <span className="brand-glyph">◈</span>
        </div>
        <div className="brand-text">
          <div className="brand-name">
            TOKEN<span className="brand-accent">FLOW</span>
          </div>
          <div className="brand-sub">AI 用量智能分析平台</div>
        </div>
      </div>

      <div className="topbar-right">
        <div className="env-badge">
          <span className="env-dot" /> 生产环境 · prod-us-east
        </div>
        <div className="clock">
          <span className="clock-time">{clock}</span>
          <span className="clock-date">{date}</span>
        </div>
        <div className="avatar" title="管理员">A</div>
      </div>
    </header>
  );
}
