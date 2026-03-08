import { G } from "../../constants/theme";
import { Card } from "../common/Card";
import { Btn } from "../common/Button";
import { MetricCard } from "../common/MetricCard";
import { fmt } from "../../utils/simulation";
import { WorldMap } from "../common/WorldMap";
import { CheckCircle2, AlertTriangle, Info, ArrowRight, Zap, Droplets, Leaf } from "lucide-react";

export function ResultsPage({ results, config, onNext, onBack }) {
  const getScoreColor = (s) => (s >= 70 ? "#22c55e" : s >= 40 ? G.amber : G.red);

  return (
    <div className="page-transition" style={{ padding: "40px 24px", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div className="slide-up">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: G.blue, marginBottom: "8px" }}>
            <CheckCircle2 size={20} />
            <span style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "2px" }}>OPTIMIZATION COMPLETE</span>
          </div>
          <h2 style={{ fontSize: "36px", fontWeight: 900 }}>Infrastructure <span style={{ color: G.blue }}>Baseline</span></h2>
        </div>
        <div className="slide-up stagger-1" style={{ textAlign: "right" }}>
          <div style={{ color: G.textMuted, fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>EFFICIENCY SCORE</div>
          <div style={{ fontSize: "48px", fontWeight: 900, color: getScoreColor(results.score), lineHeight: 1 }}>{results.score}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        <div className="slide-up stagger-1"><MetricCard label="Annual Energy" value={`${fmt(results.annualEnergy)} MWh`} sub="Total Grid Load" icon={<Zap size={18} />} color={G.blue} /></div>
        <div className="slide-up stagger-2"><MetricCard label="Water Usage" value={`${fmt(results.waterConsumption)} m³`} sub="Annual Consumption" icon={<Droplets size={18} />} color={G.cyan} /></div>
        <div className="slide-up stagger-3"><MetricCard label="Carbon Footprint" value={`${fmt(results.carbon)} t`} sub="CO₂ Equivalent" icon={<Leaf size={18} />} color="#ef4444" /></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "40px" }}>
        <Card className="slide-up stagger-2 hover-lift" style={{ padding: 0, overflow: "hidden", position: "relative" }} depth>
          <div style={{ padding: "24px", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800 }}>Regional Grid Exposure</h3>
            <div style={{ fontSize: "12px", color: G.textMuted, fontWeight: 700 }}>{results.apiRaw ? results.apiRaw.location : config.region} DATA</div>
          </div>
          <div style={{ height: "320px", padding: "24px" }}>
            <WorldMap selected={config.region} recommendations={['KA', 'KL', 'HP']} />
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Card glass className="slide-up stagger-3 hover-lift" style={{ flex: 1 }}>
            <h3 style={{ fontSize: "14px", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Info size={16} color={G.blue} /> System Analysis
            </h3>
            <div style={{ display: "flex", gap: "12px", background: `${G.blue}10`, padding: "16px", borderRadius: "12px", border: `1px solid ${G.blue}20`, marginBottom: "16px" }}>
              <AlertTriangle size={20} color={G.blue} style={{ flexShrink: 0 }} />
              <p style={{ fontSize: "13px", color: G.text, lineHeight: 1.5 }}>
                {results.apiRaw ? (
                  <>Climate is <strong>{results.apiRaw.climate.climate_label}</strong> ({results.apiRaw.climate.temperature_c}°C). Water stress index is <strong>{results.apiRaw.environmental_metrics.water.water_stress_index}</strong> ({results.apiRaw.environmental_metrics.water.water_availability}).</>
                ) : (
                  <>Regional water stress is <strong>{config.waterStress}</strong>.</>
                )}
              </p>
            </div>

            {results.apiRaw && (
              <div style={{ display: "flex", gap: "12px", background: `rgba(34, 197, 94, 0.1)`, padding: "16px", borderRadius: "12px", border: `1px solid rgba(34, 197, 94, 0.2)` }}>
                <CheckCircle2 size={20} color="#22c55e" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: "13px", color: G.text, lineHeight: 1.5 }}>
                  <strong>Suggested:</strong> {results.apiRaw.recommended_strategy}
                </p>
              </div>
            )}
          </Card>
          <Card className="slide-up stagger-4 hover-lift" style={{ flex: 1, background: `linear-gradient(135deg, ${G.bgCard}, #000c1a)` }}>
            <h3 style={{ fontSize: "14px", fontWeight: 800, marginBottom: "12px" }}>Sustainability Mix</h3>
            <div style={{ fontSize: "24px", fontWeight: 900, color: G.cyan, marginBottom: "4px" }}>{results.apiRaw ? results.apiRaw.environmental_metrics.renewable_share_percent : config.renewablePC}%</div>
            <p style={{ fontSize: "12px", color: G.textMuted }}>Direct Renewable Energy Contribution</p>
            <div style={{ width: "100%", height: "6px", background: `${G.text}10`, borderRadius: "3px", marginTop: "16px", overflow: "hidden" }}>
              <div style={{ width: `${results.apiRaw ? results.apiRaw.environmental_metrics.renewable_share_percent : config.renewablePC}%`, height: "100%", background: G.cyan }} />
            </div>
          </Card>
        </div>
      </div>

      <div className="slide-up stagger-4" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Btn onClick={onBack} variant="secondary">← Back</Btn>
        <Btn onClick={onNext} variant="primary" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
          Analyze Insights <ArrowRight size={18} />
        </Btn>
      </div>
    </div>
  );
}
