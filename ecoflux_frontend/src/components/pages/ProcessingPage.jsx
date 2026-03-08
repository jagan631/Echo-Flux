import { useState, useEffect } from "react";
import { G } from "../../constants/theme";
import { Card } from "../common/Card";
import { Loader2, ShieldCheck, Cpu, Droplets, Zap, BarChart3 } from "lucide-react";

export function ProcessingPage({ onDone }) {
  const [prog, setProg] = useState(0);
  const steps = [
    { text: "Scanning Regional Grid...", icon: <Zap size={16} /> },
    { text: "Modeling Thermal Dynamics...", icon: <Cpu size={16} /> },
    { text: "Assessing Resource Scarcity...", icon: <Droplets size={16} /> },
    { text: "Optimizing Hardware Load...", icon: <ShieldCheck size={16} /> },
    { text: "Compiling ESG Report...", icon: <BarChart3 size={16} /> },
  ];

  useEffect(() => {
    const itv = setInterval(() => {
      setProg(p => {
        if (p >= 100) {
          clearInterval(itv);
          if (onDone) onDone();
          return 100;
        }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(itv);
  }, [onDone]);

  const stepIdx = Math.min(Math.floor(prog / 20), steps.length - 1);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0, 5, 10, 0.8)",
      backdropFilter: "blur(12px)",
      animation: "fadeIn 0.3s ease-out"
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .processing-modal { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>

      <Card glass depth className="processing-modal" style={{
        width: "90%",
        maxWidth: "460px",
        textAlign: "center",
        padding: "50px 40px",
        background: `linear-gradient(135deg, ${G.bgCard}, #06111a)`,
        border: `1px solid ${G.blue}30`,
        boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${G.blue}10`
      }}>
        <div style={{ position: "relative", width: "140px", height: "140px", margin: "0 auto 40px" }}>
          {/* Outer Ring */}
          <svg style={{ transform: "rotate(-90deg)", width: "140px", height: "140px" }}>
            <circle cx="70" cy="70" r="64" fill="none" stroke={`${G.blue}08`} strokeWidth="4" />
            <circle cx="70" cy="70" r="64" fill="none" stroke={G.blue} strokeWidth="4"
              strokeDasharray={402.12} strokeDashoffset={402.12 * (1 - prog / 100)}
              style={{ transition: "stroke-dashoffset 0.1s linear" }} strokeLinecap="round" />
          </svg>

          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <div style={{ fontSize: "32px", fontWeight: 900, color: G.text, letterSpacing: "-1px" }}>{prog}%</div>
            <div style={{ color: G.blue, marginTop: "2px" }}>
              {steps[stepIdx].icon}
            </div>
          </div>

          {/* Glowing Pulse */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "128px",
            height: "128px",
            background: `${G.blue}15`,
            borderRadius: "50%",
            transform: "translate(-50%,-50%)",
            filter: "blur(20px)",
            opacity: 0.5 + (prog % 20 / 40)
          }} />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 className="mono" style={{
            fontSize: "14px",
            fontWeight: 800,
            color: G.blue,
            marginBottom: "12px",
            height: "20px",
            letterSpacing: "1px",
            textTransform: "uppercase"
          }}>
            {steps[stepIdx].text}
          </h3>
          <div style={{
            width: "100%",
            height: "4px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "2px",
            overflow: "hidden",
            marginTop: "16px"
          }}>
            <div style={{
              width: `${prog}%`,
              height: "100%",
              background: `linear-gradient(to right, ${G.blue}, ${G.cyan})`,
              transition: "width 0.1s linear"
            }} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", opacity: 0.6 }}>
          <Loader2 size={14} color={G.blue} className="spin" />
          <p style={{ color: G.textMuted, fontSize: "12px", fontWeight: 700, letterSpacing: "2px", margin: 0 }}>
            ECOFLUX CORE ENGINE
          </p>
        </div>
      </Card>
    </div>
  );
}
