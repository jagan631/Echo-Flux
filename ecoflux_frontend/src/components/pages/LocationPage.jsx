import { useState } from "react";
import { G } from "../../constants/theme";
import { Card } from "../common/Card";
import { Btn } from "../common/Button";
import { WorldMap } from "../common/WorldMap";
import { REGION_LABELS, REGION_CARBON } from "../../utils/simulation";
import { Globe, MousePointer2, ShieldCheck, ArrowRight, Settings, Cpu, ChevronDown } from "lucide-react";

export function LocationPage({ selected, onSelect, config, setConfig, onNext, onBack }) {
  const [isCoolDropdownOpen, setIsCoolDropdownOpen] = useState(false);
  const [isWorkloadDropdownOpen, setIsWorkloadDropdownOpen] = useState(false);

  const update = (key, val) => setConfig({ ...config, [key]: val });

  const coolingOptions = [
    { value: "air", label: "Air Cooling" },
    { value: "liquid", label: "Liquid Cooling" },
    { value: "immersion", label: "Immersion Cooling" },
    { value: "evaporative", label: "Evaporative Cooling" }
  ];

  const workloadOptions = [
    { value: "AI Training", label: "AI Training Workload" },
    { value: "Data Processing", label: "General Data Processing" },
    { value: "Web Hosting", label: "Web Hosting / API" },
    { value: "Storage", label: "Cold Storage" }
  ];

  const currentCooling = coolingOptions.find(o => o.value === config.coolingType) || coolingOptions[0];
  const currentWorkload = workloadOptions.find(o => o.value === config.workloadType) || workloadOptions[0];

  return (
    <div style={{ minHeight: "80vh", padding: "40px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "12px", background: `${G.blue}15`,
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px"
        }}>
          <Globe size={24} color={G.blue} />
        </div>
        <h2 style={{ fontSize: "36px", fontWeight: 900, marginBottom: "12px", letterSpacing: "-1px" }}>Configure Infrastructure Hub</h2>
        <p style={{ color: G.textMuted, fontSize: "15px" }}>Select a region and configure your compute workload for accurate backend simulation.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "32px", marginBottom: "48px" }}>
        {/* Interactive Map */}
        <WorldMap selected={selected} onSelect={onSelect} />

        {/* Real-time Suitability Panel & Configuration */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {selected ? (
            <div className="fade-up" style={{ height: "100%" }}>
              {(() => {
                const selectedObj = typeof selected === 'string' ? null : selected;
                const selName = selectedObj ? selectedObj.name : (selected ? REGION_LABELS[selected].name : "");
                const selClimate = selectedObj ? selectedObj.climate : (selected ? REGION_LABELS[selected].climate : "");
                const selGrid = selectedObj ? selectedObj.grid : (selected ? REGION_LABELS[selected].grid : "");
                const selCarbon = selectedObj ? selectedObj.carbon : (selected ? REGION_CARBON[selected] : 0);

                return (
                  <Card glass depth style={{ padding: "32px", background: `linear-gradient(135deg, ${G.bgCard}, #000c1a)`, borderColor: `${G.blue}30`, height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                      <ShieldCheck size={20} color={G.blue} />
                      <span style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "2px", color: G.blue }}>REGION SUITABILITY</span>
                    </div>

                    <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "6px" }}>{selName}</h3>
                    <p style={{ color: G.textMuted, fontSize: "13px", lineHeight: 1.5, marginBottom: "24px" }}>
                      Grid Carbon: <span style={{ color: G.amber, fontWeight: 700 }}>{selCarbon} kg/kWh</span> • Resource Stress: <span style={{ color: G.cyan, fontWeight: 700 }}>{selGrid}</span>
                      <br />Climate: <span style={{ color: G.textMuted, fontWeight: 500 }}>{selClimate}</span>
                    </p>

                    <hr style={{ border: `0.5px solid rgba(255,255,255,0.05)`, marginBottom: "24px" }} />

                    {/* Infrastructure Configuration Form */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <Settings size={18} color={G.textMuted} />
                      <span style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "2px", color: G.textMuted }}>WORKLOAD CONFIGURATION</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
                      {/* Compute Load Input */}
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: G.text, display: "block", marginBottom: "8px" }}>Compute Load (MW)</label>
                        <div className="input-glow-focus" style={{
                          display: "flex", alignItems: "center", background: "rgba(5, 15, 10, 0.4)",
                          border: `1px solid rgba(255,255,255,0.1)`, borderRadius: "12px", padding: "8px 16px",
                          transition: "all 0.3s"
                        }}>
                          <Cpu size={16} color={G.textMuted} style={{ marginRight: "10px" }} />
                          <input
                            type="number"
                            min="1"
                            value={config.computeMW}
                            onChange={(e) => update("computeMW", parseInt(e.target.value) || 0)}
                            className="mono"
                            style={{
                              width: "100%", background: "none", border: "none",
                              color: G.blue, fontSize: "16px", fontWeight: 800, outline: "none"
                            }}
                          />
                        </div>
                      </div>

                      {/* Cooling Method Dropdown */}
                      <div style={{ position: "relative", zIndex: 10 }}>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: G.text, display: "block", marginBottom: "8px" }}>Preferred Cooling Method</label>
                        <div className="dropdown-container">
                          <div className="dropdown-header" onClick={() => { setIsCoolDropdownOpen(!isCoolDropdownOpen); setIsWorkloadDropdownOpen(false); }} style={{ padding: "12px 16px" }}>
                            <span style={{ fontSize: "14px" }}>{currentCooling.label}</span>
                            <ChevronDown size={16} style={{ transform: isCoolDropdownOpen ? "rotate(180deg)" : "rotate(0)", color: G.cyan }} />
                          </div>
                          {isCoolDropdownOpen && (
                            <div className="dropdown-list">
                              {coolingOptions.map((opt) => (
                                <div
                                  key={opt.value}
                                  className={`dropdown-item ${config.coolingType === opt.value ? "active" : ""}`}
                                  onClick={() => { update("coolingType", opt.value); setIsCoolDropdownOpen(false); }}
                                >
                                  {opt.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Workload Type Dropdown */}
                      <div style={{ position: "relative", zIndex: 9 }}>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: G.text, display: "block", marginBottom: "8px" }}>Workload Type</label>
                        <div className="dropdown-container">
                          <div className="dropdown-header" onClick={() => { setIsWorkloadDropdownOpen(!isWorkloadDropdownOpen); setIsCoolDropdownOpen(false); }} style={{ padding: "12px 16px" }}>
                            <span style={{ fontSize: "14px" }}>{currentWorkload.label}</span>
                            <ChevronDown size={16} style={{ transform: isWorkloadDropdownOpen ? "rotate(180deg)" : "rotate(0)", color: G.cyan }} />
                          </div>
                          {isWorkloadDropdownOpen && (
                            <div className="dropdown-list">
                              {workloadOptions.map((opt) => (
                                <div
                                  key={opt.value}
                                  className={`dropdown-item ${config.workloadType === opt.value ? "active" : ""}`}
                                  onClick={() => { update("workloadType", opt.value); setIsWorkloadDropdownOpen(false); }}
                                >
                                  {opt.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Btn onClick={onNext} variant="neon" style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                      Run Simulation <ArrowRight size={18} />
                    </Btn>
                  </Card>
                );
              })()}
            </div>
          ) : (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", opacity: 0.5 }}>
                <MousePointer2 size={32} color={G.textMuted} style={{ marginBottom: "16px", animation: "bounce 2s infinite" }} />
                <p style={{ color: G.textMuted, fontSize: "14px", fontWeight: 500 }}>Select a region on the map<br />to begin Configuration</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Btn onClick={onBack} variant="secondary">← Back</Btn>
      </div>
    </div>
  );
}
