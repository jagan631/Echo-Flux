import { G } from "../../constants/theme";

export function Card({ children, style = {}, glow = false, glass = false, glossy = false, depth = false, neon = false }) {
  return (
    <div className={`${glow ? "glow-card" : ""} ${glass ? "glass" : ""} ${glossy ? "glossy" : ""} ${depth ? "depth-card" : ""} ${neon ? "neon-card" : ""}`} style={{
      background: glass ? "transparent" : G.bgCard,
      border: glass ? "none" : `1px solid ${G.border}`,
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 10px 30px -5px rgba(0,0,0,0.5), 0 4px 6px -2px rgba(0,0,0,0.05)",
      backdropFilter: glass ? "none" : "blur(10px)",
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      ...style,
    }}>
      {children}
    </div>
  );
}
