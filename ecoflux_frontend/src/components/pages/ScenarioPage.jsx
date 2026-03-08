import { useState } from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from "recharts";
import { G } from "../../constants/theme";
import { fmt, simulate } from "../../utils/simulation";
import { Card } from "../common/Card";
import { Btn } from "../common/Button";
import { Tag } from "../common/Tag";
import { Shield, Layout, RefreshCw, ArrowLeft, Home, Zap, Droplets, Leaf, FileText, ClipboardList, TrendingUp } from "lucide-react";

export function ScenarioPage({ config, results, onBack, onRestart }) {
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState(null);

  // Current configuration (User's choice) - Use backend results if available
  const current = results ? results : simulate(config);

  // High-performance benchmark for comparison - use backend comparison or simulate
  const benchmarkStat = results?.apiRaw?.comparison_table?.find(c => c.cooling_method === "immersion") || {};
  const benchmark = results?.apiRaw ? {
    annualEnergy: benchmarkStat.energy_usage_mw * 8760,
    carbon: benchmarkStat.carbon_emission * 8760,
    score: benchmarkStat.sustainability_score,
    waterConsumption: benchmarkStat.water_usage * 8760
  } : simulate({
    ...config,
    coolingType: "immersion",
    renewablePC: 100,
    waterStress: "Low"
  });

  const compareData = [
    { name: "Grid Intensity", current: current.carbon / 8760, benchmark: (benchmark.carbon || 0) / 8760 },
    { name: "Sustainability", current: current.score, benchmark: Math.round(benchmark.score || 100) },
    { name: "Resource Efficiency", current: 100 - (current.waterConsumption / 1000000), benchmark: 98 },
    { name: "Grid Independence", current: config.renewablePC, benchmark: 100 },
    { name: "Operational PUE", current: results?.apiRaw ? (results.apiRaw.energy_usage_mw / config.computeMW) * 100 : 80, benchmark: benchmarkStat.energy_usage_mw ? (benchmarkStat.energy_usage_mw / config.computeMW) * 100 : 98 },
  ];

  const generateESGReport = () => {
    const HOURS_YEAR = 8760;
    const carbonIntensity = { MH: 0.65, KA: 0.35, DL: 0.68, TN: 0.45, US: 0.4, UK: 0.23, Nordic: 0.05, Desert: 0.55 };
    const waterFactor = { Air: 0.2, Water: 1.0, Liquid: 0.5, Immersion: 0.1, Evaporation: 0.8 };

    const energy = config.computeMW * HOURS_YEAR;
    const regionKey = config.region || "KA";
    const carbon = energy * (carbonIntensity[regionKey] || 0.4) * (1 - config.renewablePC / 100);
    const water = energy * (waterFactor[config.coolingType] || 0.5);

    const renewableScore = config.renewablePC * 0.4;
    const waterScore = config.waterStress === "High" ? 10 : config.waterStress === "Medium" ? 20 : 30;
    const currentCarbonIntensity = carbonIntensity[regionKey] || 0.4;
    const carbonScore = (1 - currentCarbonIntensity) * 30;
    const sustainabilityScore = Math.round(renewableScore + waterScore + carbonScore);

    const growth = 1.2;
    const projections = {
      year1: energy,
      year3: energy * Math.pow(growth, 2),
      year5: energy * Math.pow(growth, 4)
    };

    setReport({
      energy: Math.round(current.annualEnergy || (config.computeMW * HOURS_YEAR)),
      carbon: Math.round(current.carbon),
      water: Math.round(current.waterConsumption),
      sustainabilityScore: Math.round(current.score),
      projections
    });
    setShowReport(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="page-transition" style={{ padding: "40px 24px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="slide-up" style={{ marginBottom: "48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: G.blue, marginBottom: "12px" }}>
            <Shield size={24} />
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "2px" }}>STRATEGIC MODELLING</span>
          </div>
          <h2 style={{ fontSize: "36px", fontWeight: 900 }}>Standard vs. <span style={{ color: G.blue }}>Optimized</span></h2>
        </div>
        <Btn onClick={onRestart} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <Home size={18} /> Complete Session
        </Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "32px", marginBottom: "48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Card className="slide-up stagger-1 hover-lift" glass depth>
            <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "20px" }}>Strategic Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: G.textMuted, fontSize: "13px" }}><Zap size={14} /> Energy Savings</div>
                <div style={{ color: "#22c55e", fontWeight: 800 }}>
                  -{Math.round(Math.max(0, (1 - (benchmark.annualEnergy || 0) / current.annualEnergy) * 100))}%
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: G.textMuted, fontSize: "13px" }}><Droplets size={14} /> Water Reduction</div>
                <div style={{ color: "#22c55e", fontWeight: 800 }}>
                  -{Math.round(Math.max(0, (1 - (benchmark.waterConsumption || 0) / current.waterConsumption) * 100))}%
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: G.textMuted, fontSize: "13px" }}><Leaf size={14} /> Carbon Offset</div>
                <div style={{ color: "#22c55e", fontWeight: 800 }}>
                  -{Math.round(Math.max(0, (1 - (benchmark.carbon || 0) / current.carbon) * 100))}%
                </div>
              </div>
            </div>
          </Card>

          <Card className="slide-up stagger-2 hover-lift" style={{ background: `linear-gradient(135deg, ${G.bgCard}, #000c1a)`, borderColor: `${G.blue}40` }}>
            <Tag label="RECOMMENDATION" color={G.blue} />
            <p style={{ marginTop: "16px", fontSize: "14px", lineHeight: 1.6, color: G.text }}>
              Deployment of Water-based cooling combined with our recommended 80% renewable purchase agreement yields the highest ROI on sustainability metrics.
            </p>
          </Card>
        </div>

        <Card className="slide-up stagger-2 hover-lift" style={{ height: "400px", display: "flex", flexDirection: "column" }} depth>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, display: "flex", alignItems: "center", gap: "10px" }}>
              <Layout size={18} color={G.blue} /> Strategy Comparison Profile
            </h3>
          </div>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={compareData}>
                <PolarGrid stroke={G.border} />
                <PolarAngleAxis dataKey="name" stroke={G.textMuted} fontSize={10} />
                <Radar name="Recommended Benchmark" dataKey="benchmark" stroke={G.blue} fill={G.blue} fillOpacity={0.3} />
                <Radar name="Your Current Scenario" dataKey="current" stroke={G.green || "#22c55e"} fill={G.green || "#22c55e"} fillOpacity={0.5} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div id="esg-report-content">
        {showReport && report && (
          <div className="page-transition" style={{ marginTop: "60px", borderTop: `1px solid ${G.border}`, paddingTop: "60px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", color: G.green, marginBottom: "16px" }}>
                <FileText size={32} />
                <h2 style={{ fontSize: "32px", fontWeight: 900, margin: 0 }}>Official ESG Sustainability Report</h2>
              </div>
              <p style={{ color: G.textMuted, fontSize: "14px", maxWidth: "600px", margin: "0 auto" }}>
                Comprehensive environmental impact audit based on Tier-III data center specifications and regional power grid metrics.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "40px" }}>
              <Card depth glass style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: G.blue, display: "flex", alignItems: "center", gap: "8px" }}>
                  <ClipboardList size={20} /> Deployment Metadata
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { label: "Region", val: config.region },
                    { label: "Infrastructure Load", val: `${config.computeMW} MW` },
                    { label: "Cooling Architecture", val: config.coolingType },
                    { label: "Renewable Component", val: `${config.renewablePC}%` },
                    { label: "Hydraulic Stress", val: config.waterStress }
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid rgba(255,255,255,0.05)`, paddingBottom: "8px" }}>
                      <span style={{ fontSize: "13px", color: G.textMuted, fontWeight: 700 }}>{item.label}</span>
                      <span className="mono" style={{ fontSize: "13px", color: G.text, fontWeight: 800 }}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card depth glossy style={{ background: "rgba(0, 232, 122, 0.05)", border: `1px solid ${G.green}30` }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: G.green, fontSize: "12px", fontWeight: 800, letterSpacing: "2px", marginBottom: "12px" }}>OVERALL SUSTAINABILITY RATING</div>
                  <div style={{ fontSize: "72px", fontWeight: 900, color: G.green, lineHeight: 1 }}>{report.sustainabilityScore}<span style={{ fontSize: "24px", opacity: 0.5 }}>/100</span></div>
                  <div style={{ marginTop: "20px" }}>
                    <Tag label={report.sustainabilityScore > 70 ? "HIGH EFFICIENCY" : "OPTIMIZATION REQUIRED"} color={G.green} />
                  </div>
                </div>
              </Card>
            </div>

            <Card depth style={{ marginBottom: "40px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "24px", textAlign: "center" }}>Environmental Lifecycle Impact</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {[
                  { label: "Energy Consumption", val: fmt(report.energy), unit: "MWh/Yr", color: G.amber, icon: <Zap size={24} /> },
                  { label: "Carbon Emissions", val: fmt(report.carbon), unit: "Tonnes/Yr", color: "#ef4444", icon: <Leaf size={24} /> },
                  { label: "Water Retention", val: fmt(report.water), unit: "m³/Yr", color: G.cyan, icon: <Droplets size={24} /> }
                ].map(item => (
                  <div key={item.label} style={{ textAlign: "center", padding: "24px", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: `1px solid rgba(255,255,255,0.05)` }}>
                    <div style={{ marginBottom: "16px", color: item.color, display: "flex", justifyContent: "center" }}>{item.icon}</div>
                    <div className="mono" style={{ fontSize: "24px", fontWeight: 900, marginBottom: "4px" }}>{item.val}</div>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: G.textMuted, textTransform: "uppercase" }}>{item.unit}</div>
                    <div style={{ fontSize: "12px", color: item.color, marginTop: "8px", fontWeight: 700 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card depth glass style={{ marginBottom: "60px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                <TrendingUp size={20} color={G.blue} /> 5-Year Scale Projections (20% CAGR)
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", color: G.text }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: `2px solid ${G.border}` }}>
                      <th style={{ padding: "16px", fontSize: "14px", color: G.textMuted }}>FISCAL YEAR</th>
                      <th style={{ padding: "16px", fontSize: "14px", color: G.textMuted }}>GRID DEMAND (MWh)</th>
                      <th style={{ padding: "16px", fontSize: "14px", color: G.textMuted }}>INFRASTRUCTURE STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { year: "Year 1 (Base)", val: report.projections.year1, status: "Normal" },
                      { year: "Year 3", val: report.projections.year3, status: "Scaling" },
                      { year: "Year 5", val: report.projections.year5, status: "Critical" }
                    ].map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                        <td style={{ padding: "20px", fontWeight: 800 }}>{row.year}</td>
                        <td className="mono" style={{ padding: "20px", color: G.blue, fontSize: "16px", fontWeight: 800 }}>{fmt(row.val)} MWh</td>
                        <td style={{ padding: "20px" }}>
                          <Tag label={row.status} color={row.status === "Critical" ? "#ef4444" : row.status === "Scaling" ? G.amber : G.green} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="slide-up stagger-3 no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px" }}>
        <Btn onClick={onBack} variant="secondary">← Back</Btn>
        <div style={{ display: "flex", gap: "16px" }}>
          <Btn
            onClick={() => showReport ? window.print() : generateESGReport()}
            variant="primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
          >
            {showReport ? "Download ESG Report (PDF)" : "Generate ESG Report"} <FileText size={18} />
          </Btn>
          <Btn onClick={onRestart} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <RefreshCw size={18} /> New Simulation
          </Btn>
        </div>
      </div>
    </div>
  );
}
