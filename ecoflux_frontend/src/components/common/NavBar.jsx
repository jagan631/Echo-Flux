import { useState } from "react";
import { G } from "../../constants/theme";
import { Tag } from "./Tag";
import { Layout, Zap, Info, Menu, X, Cpu } from "lucide-react";

export function NavBar({ navSection, onNav, simPage, onSimNav, simStarted }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainLinks = [
    { id: "home", label: "Home", icon: <Layout size={18} /> },
  ];
  const simSteps = ["Location", "Results", "Cooling", "Projections", "Scenarios"];

  return (
    <>
      <nav className="main-navbar" style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "58px",
        background: "rgba(5, 15, 20, 0.8)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${G.border}`, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => onNav("home")}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: G.blue,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 15px ${G.blue}40`
            }}>
              <Zap size={18} color="white" fill="white" />
            </div>
            <span style={{ fontWeight: 800, color: G.text, fontSize: "19px", letterSpacing: "-0.5px" }}>EcoFlux</span>
          </div>

          {/* Main Nav Links */}
          <div style={{ display: "flex", gap: "4px" }} className="desktop-only">
            {mainLinks.map(link => (
              <button
                key={link.id}
                onClick={() => onNav(link.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 16px", borderRadius: "8px", border: "none",
                  background: navSection === link.id ? "rgba(255,255,255,0.05)" : "transparent",
                  color: navSection === link.id ? G.blue : G.textMuted,
                  fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                }}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Simulation Progress (Linear) */}
        <div style={{ flex: 1, height: "32px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 40px" }} className="desktop-only">
          {navSection === "sim" && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", maxWidth: "800px" }}>
              {simSteps.map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div
                    onClick={() => i <= simPage || simStarted ? onSimNav(i) : null}
                    style={{
                      padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
                      background: i === simPage ? `${G.blue}15` : "transparent",
                      color: i === simPage ? G.blue : (i < simPage || simStarted ? G.text : G.textMuted),
                      border: `1px solid ${i === simPage ? G.blue : "transparent"}`,
                      cursor: (i <= simPage || simStarted) ? "pointer" : "default",
                      transition: "all 0.2s", whiteSpace: "nowrap"
                    }}
                  >
                    {step}
                  </div>
                  {i < simSteps.length - 1 && <div style={{ flex: 1, height: "1px", background: i < simPage ? G.blue : G.border, margin: "0 8px" }} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => onNav("sim")}
            style={{
              padding: "8px 20px", borderRadius: "8px",
              background: G.blue, color: "white", border: "none",
              fontSize: "14px", fontWeight: 700, cursor: "pointer",
              boxShadow: `0 4px 12px ${G.blue}40`, transition: "all 0.2s"
            }}
            className="shimmer"
          >
            {navSection === "sim" ? "Reset View" : "Start Simulator"}
          </button>

          <button
            className="mobile-only"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none", color: G.text, cursor: "pointer" }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="mobile-only" style={{
          position: "fixed", top: "58px", left: 0, right: 0, bottom: 0,
          background: "rgba(5, 15, 20, 0.95)", backdropFilter: "blur(20px)",
          zIndex: 999, padding: "24px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {mainLinks.map(link => (
              <button
                key={link.id}
                onClick={() => { onNav(link.id); setMobileOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "16px", borderRadius: "12px", border: "none",
                  background: navSection === link.id ? "rgba(255,255,255,0.05)" : "transparent",
                  color: navSection === link.id ? G.blue : G.textMuted,
                  fontSize: "18px", fontWeight: 700, cursor: "pointer", textAlign: "left"
                }}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </div>

          {navSection === "sim" && (
            <div style={{ marginTop: "24px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: G.textMuted, marginBottom: "16px", letterSpacing: "1px" }}>
                SIMULATION STEPS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {simSteps.map((step, i) => (
                  <button
                    key={step}
                    onClick={() => {
                      if (i <= simPage || simStarted) {
                        onSimNav(i);
                        setMobileOpen(false);
                      }
                    }}
                    style={{
                      padding: "16px", borderRadius: "12px", border: `1px solid ${i === simPage ? G.blue : "transparent"}`,
                      background: i === simPage ? `${G.blue}15` : "rgba(255,255,255,0.02)",
                      color: i === simPage ? G.blue : (i < simPage || simStarted ? G.text : G.textMuted),
                      fontSize: "16px", fontWeight: 600, textAlign: "left",
                      opacity: (i <= simPage || simStarted) ? 1 : 0.5,
                      cursor: (i <= simPage || simStarted) ? "pointer" : "default"
                    }}
                  >
                    {i + 1}. {step}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
