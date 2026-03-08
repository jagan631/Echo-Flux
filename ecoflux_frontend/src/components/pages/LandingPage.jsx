import { G } from "../../constants/theme";
import { Btn } from "../common/Button";
import { Card } from "../common/Card";
import { Tag } from "../common/Tag";
import { Zap, Droplets, Globe, Shield, Activity, Lightbulb, Calendar, ArrowRight, TrendingUp, BarChart3, Database } from "lucide-react";

export function LandingPage({ onNext }) {
  return (
    <div style={{ minHeight: "100vh", background: "transparent", position: "relative" }}>
      {/* Radial Glow for Hero Focal Point */}
      <div style={{ 
        position: "absolute", 
        top: "15%", 
        left: "50%", 
        transform: "translateX(-50%)", 
        width: "1000px", 
        height: "600px", 
        background: `radial-gradient(ellipse at center, ${G.blueGlow} 0%, transparent 70%)`, 
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Hero Section */}
      <div style={{ 
        position: "relative", 
        paddingTop: "160px", 
        paddingBottom: "100px", 
        textAlign: "center", 
        zIndex: 1
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }} className="fade-up">
          <div className="slide-up stagger-1" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: G.blue, marginBottom: "20px" }}>
            <Globe size={24} />
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "3px" }}>SUSTAINABLE AI INFRASTRUCTURE</span>
          </div>

          <h1 className="slide-up stagger-2" style={{ 
            fontSize: "84px", 
            fontWeight: 900, 
            lineHeight: 1.1, 
            marginBottom: "24px",
            letterSpacing: "-2px"
          }}>
            EcoFlux Intelligence <br /> 
            <span style={{ color: G.blue }}>Sustainability</span> Audit
          </h1>

          <p className="slide-up stagger-3" style={{ 
            fontSize: "20px", 
            color: G.text, 
            maxWidth: "600px", 
            margin: "0 auto 40px",
            lineHeight: 1.6,
            opacity: 0.9
          }}>
            Simulate, audit, and optimize the environmental footprint of your AI Workloads with Tier-III precision.
          </p>

          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            <Btn onClick={onNext} variant="neon">
              Launch Simulator <ArrowRight size={20} style={{ marginLeft: "10px" }} />
            </Btn>
          </div>
        </div>

        {/* Floating Stats Area */}
        <Card glass glossy depth neon style={{ 
          margin: "100px auto 0", 
          padding: "40px", 
          borderRadius: "32px", 
          width: "100%", 
          maxWidth: "850px", 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "24px",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
              <Activity size={16} color={G.blue} />
              <div style={{ color: G.textMuted, fontSize: "10px", fontWeight: 800, letterSpacing: "2px" }}>GRID INTENSITY</div>
            </div>
            <div style={{ color: G.blue, fontSize: "32px", fontWeight: 900 }}>0.07</div>
            <div style={{ height: "4px", width: "100%", background: `${G.blue}20`, borderRadius: "2px", marginTop: "12px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "70%", background: G.blue }} />
            </div>
          </div>
          <div style={{ borderLeft: `1px solid rgba(255,255,255,0.06)` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
              <TrendingUp size={16} color={G.cyan} />
              <div style={{ color: G.textMuted, fontSize: "10px", fontWeight: 800, letterSpacing: "2px" }}>PEAK EFFICIENCY</div>
            </div>
            <div style={{ color: G.cyan, fontSize: "32px", fontWeight: 900 }}>92%</div>
            <div style={{ height: "4px", width: "80%", background: `${G.cyan}20`, borderRadius: "2px", marginTop: "12px", marginInline: "auto", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "92%", background: G.cyan }} />
            </div>
          </div>
          <div style={{ borderLeft: `1px solid rgba(255,255,255,0.06)` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
              <Zap size={16} color={G.text} />
              <div style={{ color: G.textMuted, fontSize: "10px", fontWeight: 800, letterSpacing: "2px" }}>RESOURCE WASTE</div>
            </div>
            <div style={{ color: G.text, fontSize: "32px", fontWeight: 900 }}>-40%</div>
            <div style={{ height: "4px", width: "80%", background: `rgba(255,255,255,0.1)`, borderRadius: "2px", marginTop: "12px", marginInline: "auto", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "40%", background: G.text }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Restored Sections with Professional Icons */}
      <section style={{ padding: "120px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <Tag label="THE PROBLEM" color="#ef4444" />
          <h2 style={{ fontSize: "48px", fontWeight: 900, marginTop: "20px", letterSpacing: "-1.5px" }}>Infrastructure <span style={{ color: G.blue }}>Efficiency Gap</span></h2>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
          <Card glass glossy depth neon style={{ padding: "48px" }}>
            <div style={{ width: "56px", height: "56px", background: `${G.blue}15`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
              <Database size={28} color={G.blue} />
            </div>
            <h3 style={{ color: G.text, fontSize: "22px", fontWeight: 800, marginBottom: "16px" }}>Critical Power Usage</h3>
            <p style={{ color: G.textMuted, lineHeight: 1.8, fontSize: "15px" }}>Modern data centers consume vast amounts of electricity. Every unoptimized watt increases operational costs and burdens local grids. Precision tracking is essential.</p>
          </Card>
          <Card glass glossy depth neon style={{ padding: "48px" }}>
            <div style={{ width: "56px", height: "56px", background: `${G.cyan}15`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
              <Droplets size={28} color={G.cyan} />
            </div>
            <h3 style={{ color: G.text, fontSize: "22px", fontWeight: 800, marginBottom: "16px" }}>Thermal Management</h3>
            <p style={{ color: G.textMuted, lineHeight: 1.8, fontSize: "15px" }}>Cooling infrastructure account for significant water usage. Our platform calculates optimal cooling strategies to minimize environmental stress while maintaining uptime.</p>
          </Card>
          <Card glass glossy depth neon style={{ padding: "48px" }}>
            <div style={{ width: "56px", height: "56px", background: `rgba(255,255,255,0.05)`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
              <Globe size={28} color={G.text} />
            </div>
            <h3 style={{ color: G.text, fontSize: "22px", fontWeight: 800, marginBottom: "16px" }}>Carbon Compliance</h3>
            <p style={{ color: G.textMuted, lineHeight: 1.8, fontSize: "15px" }}>Regulatory requirements for sustainability are increasing. We provide granular data on grid intensity and renewable mix to ensure your facility remains compliant.</p>
          </Card>
        </div>
      </section>

      <section style={{ padding: "120px 24px", position: "relative" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <Tag label="CORE SOLUTIONS" color={G.cyan} />
            <h2 style={{ fontSize: "48px", fontWeight: 900, marginTop: "20px", letterSpacing: "-1.5px" }}>Enterprise <span style={{ color: G.blue }}>Features</span></h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            {[
              { title: "Load Calculator", desc: "Predict precise energy requirements based on hardware load and regional climate.", icon: <BarChart3 size={24} /> },
              { title: "Efficiency Index", desc: "Standardized 0-100 score weighing PUE, WUE, and Renewable Energy Factor.", icon: <Shield size={24} /> },
              { title: "Strategic Advisory", desc: "Automated analysis of cooling methods tailored to specific geographic coordinates.", icon: <Lightbulb size={24} /> },
              { title: "5-Year Projection", desc: "Long-term forecasting of resource demand as facility throughput increases over time.", icon: <Calendar size={24} /> },
            ].map((f, i) => (
              <Card key={i} glass depth neon style={{ padding: "32px", borderRadius: "20px" }}>
                <div style={{ color: G.blue, marginBottom: "16px" }}>{f.icon}</div>
                <h4 style={{ color: G.text, fontWeight: 800, fontSize: "18px", marginBottom: "10px" }}>{f.title}</h4>
                <p style={{ color: G.textMuted, fontSize: "14px", lineHeight: 1.6 }}>{f.desc}</p>
              </Card>
            ))}
          </div>

          <div style={{ marginTop: "100px", textAlign: "center" }}>
            <Btn onClick={onNext} variant="primary" style={{ padding: "18px 60px", display: "inline-flex", alignItems: "center", gap: "10px" }}>
              Get Started <ArrowRight size={20} />
            </Btn>
          </div>
        </div>
      </section>
    </div>
  );
}
