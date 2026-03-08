import { G } from "../../constants/theme";
import { Tag } from "../common/Tag";
import { Card } from "../common/Card";
import { Btn } from "../common/Button";
import { Snowflake, Droplets, Thermometer, ArrowRight, ArrowLeft, BarChart2 } from "lucide-react";

export function CoolingPage({ config, results, onNext, onBack }) {
  // Derive PUE from current selection if available in comparison table
  const currentStat = results?.apiRaw?.comparison_table?.find(c => c.cooling_method === config.coolingType) || {};
  const pueValue = (currentStat.energy_usage_mw / config.computeMW).toFixed(2);

  const coolingData = [
    { title: "Power Usage Effect", icon: <Snowflake size={20} />, value: results?.apiRaw ? pueValue : "1.12", unit: "PUE", color: G.blue },
    { title: "Water Intensity", icon: <Droplets size={20} />, value: results?.apiRaw ? (currentStat.water_usage / config.computeMW).toFixed(2) : (results.waterConsumption > 0 ? "0.45" : "0.00"), unit: "L/kWh", color: G.cyan },
    { title: "Sustainability Score", icon: <Thermometer size={20} />, value: results?.apiRaw ? Math.round(currentStat.sustainability_score) : "75", unit: "Pts", color: "#22c55e" },
  ];

  return (
    <div className="page-transition" style={{ padding: "40px 24px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="slide-up" style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: G.blue, marginBottom: "12px" }}>
          <Snowflake size={24} />
          <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "2px" }}>THERMAL ANALYSIS</span>
        </div>
        <h2 style={{ fontSize: "36px", fontWeight: 900 }}>Cooling Strategy <span style={{ color: G.blue }}>Benchmarking</span></h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "48px" }}>
        {coolingData.map((d, i) => (
          <Card key={i} depth glass className={`slide-up stagger-${i + 1} hover-lift`} style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: `${d.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: d.color }}>
              {d.icon}
            </div>
            <div>
              <div style={{ color: G.textMuted, fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>{d.title}</div>
              <div style={{ fontSize: "24px", fontWeight: 900, color: G.text }}>{d.value} <span style={{ fontSize: "14px", color: G.textMuted, fontWeight: 500 }}>{d.unit}</span></div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "48px" }}>
        <Card className="slide-up stagger-2 hover-lift" style={{ padding: "32px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <BarChart2 size={20} color={G.blue} /> Efficiency Benchmarking
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {results?.apiRaw?.comparison_table?.map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", borderBottom: `1px solid ${G.border}40`, paddingBottom: "8px" }}>
                <span style={{ fontWeight: 700, color: item.cooling_method === config.coolingType ? G.cyan : G.text }}>{item.display_name}</span>
                <span className="mono" style={{ color: G.textMuted }}>Score: {Math.round(item.sustainability_score)} | Energy: {item.energy_usage_mw.toFixed(1)}MW</span>
              </div>
            ))}
          </div>
        </Card>
        <Card glass glossy className="slide-up stagger-3 hover-lift" style={{ padding: "32px", border: `1px solid ${G.blue}20`, background: `${G.blue}05` }}>
          <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "16px" }}>Strategy Insight</h3>
          <p style={{ color: G.text, fontSize: "14px", lineHeight: 1.6 }}>
            {results?.apiRaw ? (
              <>The backend calculation recommends <strong>{results.apiRaw.recommended_strategy}</strong> for this deployment. Ambient conditions enable high efficiency with <strong>{results.apiRaw.climate.climate_label}</strong> thermal profile.</>
            ) : (
              "The low ambient temperature in this region allows for significant \"Free Cooling\" hours, reducing mechanical chiller dependency by 35% annually."
            )}
          </p>
        </Card>
      </div>

      <div className="slide-up stagger-4" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Btn onClick={onBack} variant="secondary">← Back</Btn>
        <Btn onClick={onNext} variant="primary" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
          View Projections <ArrowRight size={18} />
        </Btn>
      </div>
    </div>
  );
}
