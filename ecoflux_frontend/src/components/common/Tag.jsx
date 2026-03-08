import { G } from "../../constants/theme";

export function Tag({ label, color = G.green }) {
  return (
    <span className="mono" style={{
      background: `${color}18`, border: `1px solid ${color}40`, color, borderRadius: "6px",
      padding: "3px 10px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.5px",
    }}>{label}</span>
  );
}
