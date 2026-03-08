import { G } from "../../constants/theme";
import { Tag } from "./Tag";

export function GaugeChart({ score }) {
  const angle = (score / 100) * 180 - 90;
  const color = score >= 70 ? G.cyan : score >= 40 ? G.amber : G.red;
  const r = 80, cx = 110, cy = 110;
  const sweep = (score / 100) * Math.PI;
  const x1 = cx + r * Math.cos(Math.PI);
  const y1 = cy + r * Math.sin(Math.PI);
  const x2 = cx + r * Math.cos(Math.PI - sweep);
  const y2 = cy + r * Math.sin(Math.PI - sweep);

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="220" height="130" style={{ overflow: "visible" }}>
        {/* Track */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={G.bgPanel} strokeWidth="16" strokeLinecap="round" />
        {/* Progress */}
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
          fill="none" stroke={color} strokeWidth="16" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
        {/* Center text */}
        <text x={cx} y={cy - 10} textAnchor="middle" fill={color} fontSize="36" fontWeight="800" fontFamily="Inter">{score}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fill={G.textMuted} fontSize="13" fontFamily="Inter">EFFICIENCY SCORE</text>
        {/* Labels */}
        <text x={cx - r - 8} y={cy + 20} fill={G.textMuted} fontSize="11" fontFamily="JetBrains Mono">0</text>
        <text x={cx + r - 8} y={cy + 20} fill={G.textMuted} fontSize="11" fontFamily="JetBrains Mono">100</text>
      </svg>
      <Tag label={score >= 70 ? "SUSTAINABLE" : score >= 40 ? "MODERATE RISK" : "HIGH RISK"} color={color} />
    </div>
  );
}
