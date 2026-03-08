import { useState } from "react";
import { G } from "../../constants/theme";
import { Card } from "../common/Card";
import { Btn } from "../common/Button";
import { Settings, Cpu, Droplets, Sun, ArrowRight, ChevronDown } from "lucide-react";

export function InputsPage({ config, setConfig, onNext, onBack }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const update = (key, val) => setConfig({ ...config, [key]: val });

  const coolingOptions = [
    { value: "Air", label: "Air Cooling" },
    { value: "Water", label: "Water Cooling" },
    { value: "Immersion", label: "Immersion Cooling" },
    { value: "Evaporation", label: "Evaporative Cooling" }
  ];

  const currentCooling = coolingOptions.find(o => o.value === config.coolingType) || coolingOptions[0];

  return (
    <div style={{ minHeight: "80vh", padding: "40px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={{ 
          width: "48px", height: "48px", borderRadius: "12px", background: `${G.cyan}15`, 
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" 
        }}>
          <Settings size={24} color={G.cyan} />
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "12px" }}>Infrastructure Configuration</h2>
        <p style={{ color: G.textMuted }}>Define the operational parameters for your simulation.</p>
      </div>

      <Card glass style={{ padding: "40px", marginBottom: "48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {/* Server Load Section */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "10px", borderRadius: "10px", background: `${G.blue}15`, boxShadow: `0 0 20px ${G.blue}20` }}>
                  <Cpu size={20} color={G.blue} />
                </div>
                <div>
                  <label style={{ fontSize: "15px", fontWeight: 800, color: G.text, display: "block", marginBottom: "2px" }}>Server Workload Capacity</label>
                  <span style={{ fontSize: "11px", color: G.textMuted, textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px" }}>Power Infrastructure Unit</span>
                </div>
              </div>
              <div className="input-glow-focus" style={{ 
                display: "flex", alignItems: "center", background: "rgba(5, 15, 10, 0.4)", 
                border: `1px solid rgba(255,255,255,0.1)`, borderRadius: "12px", padding: "6px 16px",
                transition: "all 0.3s", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
              }}>
                <input 
                  type="number" 
                  min="1" 
                  max="2000" 
                  value={config.computeMW} 
                  onChange={(e) => update("computeMW", parseInt(e.target.value) || 0)}
                  className="mono"
                  style={{ 
                    width: "80px", background: "none", border: "none", 
                    color: G.blue, fontSize: "22px", fontWeight: 900, textAlign: "right", outline: "none"
                  }}
                />
                <span style={{ fontSize: "13px", fontWeight: 800, color: G.textMuted, marginLeft: "10px" }}>MW</span>
              </div>
            </div>

            {/* Professional Current Input Section */}
            <div style={{ marginTop: "24px" }}>
              <div className="input-glow-focus" style={{ 
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "rgba(5, 15, 10, 0.6)", border: `1px solid ${G.blue}30`, 
                borderRadius: "16px", padding: "20px 24px", transition: "all 0.3s",
                boxShadow: `0 4px 20px rgba(0,0,0,0.4)`
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: G.blue, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>Rack Amperage Load</div>
                  <p style={{ color: G.textMuted, fontSize: "12px", margin: 0, fontWeight: 500 }}>Specify peak operational current per server rack</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ 
                    background: "rgba(0,0,0,0.4)", border: `1px solid rgba(255,255,255,0.08)`, 
                    borderRadius: "12px", padding: "6px 16px", display: "flex", alignItems: "center"
                  }}>
                    <input 
                      type="number" 
                      value={config.currentA} 
                      onChange={(e) => update("currentA", parseInt(e.target.value) || 0)}
                      className="mono"
                      style={{ 
                        background: "none", border: "none", color: G.blue, 
                        fontSize: "24px", fontWeight: 900, width: "100px", 
                        textAlign: "right", outline: "none",
                        textShadow: `0 0 10px ${G.blue}40`
                      }}
                    />
                    <span style={{ fontSize: "13px", fontWeight: 900, color: G.blue, marginLeft: "10px", opacity: 0.8 }}>AMP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cooling Section */}
          <div style={{ position: "relative", zIndex: 50 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ p: "8px", borderRadius: "8px", background: `${G.cyan}10` }}>
                <Droplets size={20} color={G.cyan} />
              </div>
              <div>
                <label style={{ fontSize: "14px", fontWeight: 700, color: G.text, display: "block" }}>Thermal Management Method</label>
                <span style={{ fontSize: "11px", color: G.textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>Cooling Architecture</span>
              </div>
            </div>
            
            <div className="dropdown-container">
              <div className="dropdown-header" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <span>{currentCooling.label}</span>
                <ChevronDown size={18} style={{ 
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.3s ease",
                  color: G.cyan
                }} />
              </div>
              
              {isDropdownOpen && (
                <div className="dropdown-list">
                  {coolingOptions.map((opt) => (
                    <div 
                      key={opt.value}
                      className={`dropdown-item ${config.coolingType === opt.value ? "active" : ""}`}
                      onClick={() => {
                        update("coolingType", opt.value);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* Energy Mix Section */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ 
                  padding: "10px", 
                  borderRadius: "10px", 
                  background: `${G.amber}${Math.max(15, (config.renewablePC / 100) * 80).toString(16).split('.')[0]}`, 
                  boxShadow: `0 0 ${10 + (config.renewablePC / 100) * 40}px ${G.amber}${Math.max(20, (config.renewablePC / 100) * 80).toString(16).split('.')[0]}`,
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Sun 
                    size={20} 
                    color={config.renewablePC > 50 ? "#fff" : G.amber} 
                    style={{ 
                      filter: `drop-shadow(0 0 ${config.renewablePC / 10}px ${G.amber})`,
                      transition: "all 0.3s ease"
                    }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: "15px", fontWeight: 800, color: G.text, display: "block", marginBottom: "2px" }}>Renewable Energy Factor</label>
                  <span style={{ fontSize: "11px", color: G.textMuted, textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px" }}>Sustainability Mix</span>
                </div>
              </div>
              <span className="mono" style={{ fontSize: "22px", fontWeight: 900, color: G.amber }}>{config.renewablePC}%</span>
            </div>
            <div style={{ position: "relative", height: "30px", display: "flex", alignItems: "center" }}>
              <div style={{ 
                position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                height: "6px", width: `${config.renewablePC}%`,
                background: `linear-gradient(90deg, ${G.amber}, #fbbf24)`,
                borderRadius: "10px", pointerEvents: "none", zIndex: 1,
                boxShadow: `0 0 20px ${G.amber}60`
              }} />
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5" 
                value={config.renewablePC} 
                onChange={(e) => update("renewablePC", parseInt(e.target.value))}
                className="custom-range"
                style={{ accentColor: G.amber, position: "relative", zIndex: 2 }} 
              />
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Btn onClick={onBack} variant="secondary">← Back</Btn>
        <Btn onClick={onNext} variant="primary" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
          Run Optimization <ArrowRight size={18} />
        </Btn>
      </div>
    </div>
  );
}
