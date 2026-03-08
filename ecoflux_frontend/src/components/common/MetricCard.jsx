import { G } from "../../constants/theme";
import { Card } from "./Card";

export function MetricCard({ icon, label, value, unit, color = G.blue, sub }) {
  return (
    <Card depth style={{ textAlign: "center", animation: "countUp 0.7s ease forwards" }}>
      <div style={{ 
        width: "48px", height: "48px", borderRadius: "12px", background: `${color}15`, 
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
        color: color
      }}>
        {icon}
      </div>
      <div style={{ color: G.textMuted, fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>{label}</div>
      <div className="mono" style={{ color: G.text, fontSize: "28px", fontWeight: 900, lineHeight: 1 }}>{value}</div>
      <div style={{ color: G.textMuted, fontSize: "12px", marginTop: "4px", fontWeight: 500 }}>{unit}</div>
      {sub && <div style={{ color: G.textMuted, fontSize: "10px", marginTop: "12px", borderTop: `1px solid ${G.border}`, paddingTop: "12px", fontWeight: 700, letterSpacing: "1px" }}>{sub}</div>}
    </Card>
  );
}
