import { G } from "../../constants/theme";
import { Tag } from "../common/Tag";
import { Btn } from "../common/Button";
import { Card } from "../common/Card";

export function AboutPage({ onStartSim }) {
  const team = [
    { name: "Dr. Amara Osei", role: "Infrastructure Systems Lead", icon: "👨‍🔬", note: "15 years modelling facility emissions and energy optimization strategies." },
    { name: "Lena Bergström", role: "Thermal Architect", icon: "👩‍💼", note: "Former hyperscale data center engineer. Expert in high-density cooling systems." },
    { name: "Kai Nakamura", role: "Efficiency Specialist", icon: "👨‍💻", note: "Specialist in resource stress indexing and sustainable power distribution." },
    { name: "Priya Mehta", role: "Operational Standards", icon: "👩‍⚖️", note: "Consultant for international infrastructure efficiency and carbon standards." },
  ];

  const stats = [
    { value: "4", label: "Global Datasets", color: G.blue },
    { value: "3", label: "Efficiency Scales", color: G.cyan },
    { value: "5yr", label: "Modelling Window", color: G.amber },
    { value: "0–100", label: "Efficiency Scale", color: G.cyan },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="grid-bg" style={{ padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "500px", height: "200px", background: `radial-gradient(ellipse, ${G.blueGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <Tag label="ABOUT ECOFLUX" color={G.blue} />
          <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 800, margin: "16px 0 16px" }}>
            Operational <span style={{ color: G.blue }}>Efficiency</span> Solutions
          </h1>
          <p style={{ color: G.textMuted, fontSize: "16px", lineHeight: 1.8, marginBottom: "16px" }}>
            EcoFlux was developed to address the growing energy demand of global digital infrastructure. As facilities expand, environmental impact modelling must become a core part of the planning process.
          </p>
          <p style={{ color: G.textMuted, fontSize: "15px", lineHeight: 1.8 }}>
            We provide engineering-grade tools that make resource modelling as routine as capacity planning — enabling efficient, sustainable infrastructure decisions before a single server is installed.
          </p>
        </div>
      </div>

      <div style={{ padding: "48px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px" }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center", background: G.bgCard, border: `1px solid ${G.border}`, borderRadius: "14px", padding: "24px 12px" }}>
              <div className="mono" style={{ color: s.color, fontSize: "32px", fontWeight: 800 }}>{s.value}</div>
              <div style={{ color: G.textMuted, fontSize: "12px", marginTop: "6px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section style={{ padding: "40px 24px 60px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <Card style={{ borderColor: `${G.blue}30` }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎯</div>
            <h3 style={{ color: G.blue, fontWeight: 700, fontSize: "18px", marginBottom: "10px" }}>Our Mission</h3>
            <p style={{ color: G.textMuted, lineHeight: 1.7, fontSize: "14px" }}>
              To integrate resource efficiency into the DNA of infrastructure planning. We believe every megawatt of power should be accounted for and optimized through intelligent thermal management and renewable integration.
            </p>
          </Card>
          <Card style={{ borderColor: `${G.cyan}30` }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔭</div>
            <h3 style={{ color: G.cyan, fontWeight: 700, fontSize: "18px", marginBottom: "10px" }}>Our Vision</h3>
            <p style={{ color: G.textMuted, lineHeight: 1.7, fontSize: "14px" }}>
              A world where industrial data centers operate at peak efficiency — where advanced cooling and renewable energy are the standard, minimizing the environmental footprint of our global digital network.
            </p>
          </Card>
        </div>
      </section>

      <section style={{ padding: "20px 24px 80px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <Tag label="THE TEAM" color={G.blue} />
          <h2 style={{ fontSize: "30px", fontWeight: 800, marginTop: "12px" }}>Experts Behind <span style={{ color: G.blue }}>EcoFlux</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "20px" }}>
          {team.map((m, i) => (
            <Card key={m.name} style={{ textAlign: "center", animation: `fadeUp 0.5s ${i * 0.1}s ease forwards`, opacity: 0 }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: G.text, marginBottom: "4px" }}>{m.name}</div>
              <div style={{ color: G.blue, fontSize: "12px", fontWeight: 600, marginBottom: "10px" }}>{m.role}</div>
              <p style={{ color: G.textMuted, fontSize: "12px", lineHeight: 1.6 }}>{m.note}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
