import { G } from "../../constants/theme";

export function Btn({ children, onClick, variant = "primary", style = {}, className = "" }) {
  const isNeon = variant === "neon";
  const base = {
    cursor: "pointer", border: "none", borderRadius: isNeon ? "50px" : "10px", 
    fontFamily: "inherit",
    fontWeight: 700, fontSize: isNeon ? "17px" : "15px", 
    padding: isNeon ? "16px 48px" : "13px 32px", 
    transition: "all 0.3s ease", letterSpacing: isNeon ? "1px" : "0.5px",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
  };
  const variants = {
    primary: { background: `linear-gradient(135deg, ${G.blue}, ${G.blueDim})`, color: G.text, boxShadow: `0 0 24px ${G.blueGlow}` },
    secondary: { background: "transparent", color: G.blue, border: `1.5px solid ${G.blue}` },
    blue: { background: `linear-gradient(135deg, ${G.blue}, ${G.blueDim})`, color: G.text, boxShadow: `0 0 24px ${G.blueGlow}` },
    ghost: { background: G.bgPanel, color: G.textMuted, border: `1px solid ${G.border}` },
    neon: {}, // Styled via className
  };

  return (
    <button 
      onClick={onClick} 
      className={`${isNeon ? "neon-pulse" : ""} ${className}`}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}
