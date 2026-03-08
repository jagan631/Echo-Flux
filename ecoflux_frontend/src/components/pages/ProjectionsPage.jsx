import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, BarChart, Bar } from "recharts";
import { G } from "../../constants/theme";
import { fmt, projectFuture } from "../../utils/simulation";
import { Tag } from "../common/Tag";
import { Card } from "../common/Card";
import { Btn } from "../common/Button";
import { TrendingUp, Calendar, Zap, ArrowRight, ArrowLeft } from "lucide-react";

export function ProjectionsPage({ results, onNext, onBack }) {
  const data = projectFuture(results);

  return (
    <div className="page-transition" style={{ padding: "40px 24px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="slide-up" style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: G.cyan, marginBottom: "12px" }}>
          <TrendingUp size={24} />
          <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "2px" }}>GROWTH FORECASTING</span>
        </div>
        <h2 style={{ fontSize: "36px", fontWeight: 900 }}>Long-term <span style={{ color: G.cyan }}>Resource Demand</span></h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        <Card className="slide-up stagger-1 hover-lift" style={{ height: "400px", display: "flex", flexDirection: "column" }} depth>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Zap size={18} color={G.blue} />
              <h3 style={{ fontSize: "16px", fontWeight: 800 }}>Energy Scaling (MWh)</h3>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={G.border} vertical={false} />
                <XAxis dataKey="year" stroke={G.textMuted} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={G.textMuted} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: G.bgCard, border: `1px solid ${G.border}`, borderRadius: "12px" }} />
                <Line type="monotone" dataKey="energy" stroke={G.blue} strokeWidth={3} dot={{ fill: G.blue, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="slide-up stagger-2 hover-lift" style={{ height: "400px", display: "flex", flexDirection: "column" }} depth>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Calendar size={18} color={G.cyan} />
              <h3 style={{ fontSize: "16px", fontWeight: 800 }}>Carbon Accumulation (t)</h3>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={G.border} vertical={false} />
                <XAxis dataKey="year" stroke={G.textMuted} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={G.textMuted} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: G.bgCard, border: `1px solid ${G.border}`, borderRadius: "12px" }} />
                <Bar dataKey="carbon" fill={G.cyan} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="slide-up stagger-3" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Btn onClick={onBack} variant="secondary">← Back</Btn>
        <Btn onClick={onNext} variant="primary" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
          Scenario Modelling <ArrowRight size={18} />
        </Btn>
      </div>
    </div>
  );
}
