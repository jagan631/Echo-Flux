import { G } from "../../constants/theme";
import { Tag } from "../common/Tag";
import { Btn } from "../common/Button";
import { Card } from "../common/Card";

export function FeaturesPage({ onStartSim }) {
  const features = [
    {
      icon: "⚡", color: G.blue, title: "Resource Simulation Engine",
      desc: "Model annual energy consumption, water demand, and CO₂ emissions for large-scale infrastructure. Results reflect real-world grid carbon metrics and regional environmental data.",
      bullets: ["Annual electricity: Load × 8,760 hrs", "Water: load × cycle factors × regional stress", "Carbon: energy × grid intensity data"],
    },
    {
      icon: "📊", color: G.cyan, title: "Infrastructure Efficiency Scoring",
      desc: "A professional 0–100 score weighing renewable energy mix (40%), water resource efficiency (30%), and operational intensity (30%) into a verified metric.",
      bullets: ["Score ≥ 70: Sustainable profile", "Score 40–69: Moderate optimization needed", "Score < 40: High resource risk"],
    },
    {
      icon: "📈", color: G.blue, title: "Market Growth Projections",
      desc: "Model how facility footprints scale over 5 years as digital demand increases. Essential for long-term capacity and sustainability planning.",
      bullets: ["5-year energy demand trajectory", "Volume-based resource consumption", "Carbon accumulation forecasting"],
    },
    {
      icon: "🛡️", color: G.cyan, title: "Risk Mitigation Insights",
      desc: "Contextual warnings surface critical resource vulnerabilities for your specific region and load. Move from generic advice to actionable infrastructure policy.",
      bullets: ["Water stress vulnerability detection", "Grid dependency alerts", "Regulatory compliance risk assessment"],
    },
    {
      icon: "🧪", color: G.blue, title: "Cooling Methodology Advisor",
      desc: "Recommends optimal thermal management technology based on regional climate, resource cost, and operational power density with engineering justification.",
      bullets: ["Air vs Liquid cooling analysis", "ROI-based sustainability scoring", "District heating opportunities"],
    },
    {
      icon: "⚖️", color: G.cyan, title: "Multi-Strategy Comparison",
      desc: "Side-by-side analysis of traditional and advanced cooling methodologies. Radar profiles visualize trade-offs between cost and environmental load.",
      bullets: ["Energy, water, and carbon compared", "Infrastructure profiling", "Optimal strategy selection"],
    },
    {
      icon: "🌐", color: G.blue, title: "Interactive Regional Selection",
      desc: "Select regions globally to pull live grid carbon intensity, climate classifications, and resource stress indices from verified environmental databases.",
      bullets: ["Global regional datasets", "Direct grid intensity mapping", "Vulnerability pre-analysis"],
    },
    {
      icon: "🏢", color: G.cyan, title: "Facility Intensity Analytics",
      desc: "EcoFlux uses high-resolution grid data per region, ensuring infrastructure planning reflects actual electricity mix and environmental conditions.",
      bullets: ["Low-carbon grid identification", "Transition risk analysis", "Regional infrastructure benchmarking"],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "60px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <Tag label="SYSTEM CAPABILITIES" color={G.blue} />
        <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 800, margin: "16px 0 12px" }}>
          Infrastructure <span style={{ color: G.blue }}>Intelligence</span>
        </h1>
        <p style={{ color: G.textMuted, fontSize: "16px", maxWidth: "520px", margin: "0 auto 32px", lineHeight: 1.7 }}>
          A professional platform for infrastructure sustainability modelling — from thermal engineering to regional carbon analysis.
        </p>
        <Btn onClick={onStartSim} variant="primary">Launch Optimizer →</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "24px" }}>
        {features.map((f, i) => (
          <Card key={f.title} style={{ borderColor: `${f.color}30`, animation: `fadeUp 0.5s ${i * 0.07}s ease forwards`, opacity: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
              <div style={{ fontSize: "36px", width: "52px", height: "52px", background: `${f.color}15`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{f.icon}</div>
              <h3 style={{ color: f.color, fontWeight: 700, fontSize: "16px", lineHeight: 1.3 }}>{f.title}</h3>
            </div>
            <p style={{ color: G.textMuted, fontSize: "13px", lineHeight: 1.7, marginBottom: "14px" }}>{f.desc}</p>
            <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {f.bullets.map((b, j) => (
                <div key={j} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span className="mono" style={{ color: f.color, fontSize: "11px", marginTop: "2px", flexShrink: 0 }}>→</span>
                  <span style={{ color: G.text, fontSize: "12px", lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: "60px", background: `linear-gradient(135deg, ${G.bgCard}, #000c1a)`, border: `1px solid ${G.border}`, borderRadius: "20px", padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚡</div>
        <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "10px" }}>Ready to Optimize Your Infrastructure?</h2>
        <p style={{ color: G.textMuted, marginBottom: "28px", fontSize: "15px" }}>Generate professional environmental impact reports for your facilities in under 60 seconds.</p>
        <Btn onClick={onStartSim} variant="primary">Launch EcoFlux Optimizer →</Btn>
      </div>
    </div>
  );
}
