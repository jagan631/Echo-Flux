import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const G = {
  bg: "#050f0a",
  bgCard: "#0a1a12",
  bgPanel: "#0d2018",
  green: "#00e87a",
  greenDim: "#00a855",
  greenGlow: "rgba(0,232,122,0.15)",
  blue: "#00c8ff",
  blueDim: "#0088bb",
  blueGlow: "rgba(0,200,255,0.12)",
  amber: "#ffb800",
  red: "#ff4444",
  text: "#d4ffe8",
  textMuted: "#6b9980",
  border: "rgba(0,232,122,0.15)",
  borderBlue: "rgba(0,200,255,0.2)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: ${G.bg}; color: ${G.text}; font-family: 'Syne', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${G.bg}; } ::-webkit-scrollbar-thumb { background: ${G.greenDim}; border-radius: 3px; }
  input[type=range] { -webkit-appearance: none; appearance: none; height: 4px; background: ${G.bgPanel}; border-radius: 2px; outline: none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: ${G.green}; cursor: pointer; box-shadow: 0 0 10px ${G.green}; }
  select, input[type=number] { background: ${G.bgPanel}; color: ${G.text}; border: 1px solid ${G.border}; border-radius: 8px; padding: 10px 14px; font-family: 'JetBrains Mono', monospace; font-size: 14px; outline: none; width: 100%; }
  select:focus, input[type=number]:focus { border-color: ${G.green}; box-shadow: 0 0 0 2px ${G.greenGlow}; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px ${G.greenGlow}} 50%{box-shadow:0 0 40px rgba(0,232,122,0.3)} }
  @keyframes countUp { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
  .fade-up { animation: fadeUp 0.6s ease forwards; }
  .glow-card { animation: glow 3s ease-in-out infinite; }
  .mono { font-family: 'JetBrains Mono', monospace; }
  .grid-bg { background-image: linear-gradient(${G.border} 1px, transparent 1px), linear-gradient(90deg, ${G.border} 1px, transparent 1px); background-size: 40px 40px; }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n, decimals = 1) => {
  if (n >= 1e9) return (n / 1e9).toFixed(decimals) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(decimals) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(decimals) + "K";
  return n.toFixed(decimals);
};

const COOLING_FACTORS = { Air: 3.5, Water: 1.8, Liquid: 0.9 };
const WATER_STRESS_MULT = { Low: 1.0, Medium: 1.6, High: 2.5 };
const REGION_CARBON = { UK: 0.233, US: 0.386, Nordic: 0.071, Desert: 0.45 };
const REGION_LABELS = {
  UK: { name: "United Kingdom", climate: "Temperate", grid: "Low-Medium" },
  US: { name: "United States", climate: "Mixed", grid: "Medium-High" },
  Nordic: { name: "Nordic Region", climate: "Cold", grid: "Very Low" },
  Desert: { name: "Desert Region", climate: "Arid", grid: "High" },
};

function simulate(cfg) {
  const { computeMW, coolingType, renewablePC, waterStress, region } = cfg;
  const carbonFactor = REGION_CARBON[region] || 0.386;
  const coolingFactor = COOLING_FACTORS[coolingType] || 1.8;
  const waterMult = WATER_STRESS_MULT[waterStress] || 1.6;
  const annualEnergy = computeMW * 24 * 365; // MWh
  const waterConsumption = computeMW * coolingFactor * waterMult * 1000; // m³/yr
  const carbon = annualEnergy * carbonFactor * (1 - renewablePC / 100); // tonnes CO₂
  const renewScore = renewablePC;
  const waterScore = waterStress === "Low" ? 90 : waterStress === "Medium" ? 55 : 20;
  const carbonScore = Math.max(0, 100 - (carbon / (annualEnergy * 0.4)) * 100);
  const score = Math.round((renewScore * 0.4 + waterScore * 0.3 + carbonScore * 0.3));
  return { annualEnergy, waterConsumption, carbon, score };
}

function projectFuture(base, years = 5, growthRate = 0.2) {
  return Array.from({ length: years + 1 }, (_, i) => {
    const mult = Math.pow(1 + growthRate, i);
    return {
      year: 2025 + i,
      energy: base.annualEnergy * mult,
      water: base.waterConsumption * mult,
      carbon: base.carbon * mult,
    };
  });
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", style = {} }) {
  const base = {
    cursor: "pointer", border: "none", borderRadius: "10px", fontFamily: "'Syne', sans-serif",
    fontWeight: 700, fontSize: "15px", padding: "13px 32px", transition: "all 0.25s", letterSpacing: "0.5px",
  };
  const variants = {
    primary: { background: `linear-gradient(135deg, ${G.green}, ${G.greenDim})`, color: G.bg, boxShadow: `0 0 24px ${G.greenGlow}` },
    secondary: { background: "transparent", color: G.green, border: `1.5px solid ${G.green}` },
    blue: { background: `linear-gradient(135deg, ${G.blue}, ${G.blueDim})`, color: G.bg, boxShadow: `0 0 24px ${G.blueGlow}` },
    ghost: { background: G.bgPanel, color: G.textMuted, border: `1px solid ${G.border}` },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"}
      onMouseLeave={e => e.currentTarget.style.transform = "none"}>
      {children}
    </button>
  );
}

function Card({ children, style = {}, glow = false }) {
  return (
    <div className={glow ? "glow-card" : ""} style={{
      background: G.bgCard, border: `1px solid ${G.border}`, borderRadius: "16px",
      padding: "24px", backdropFilter: "blur(10px)", ...style,
    }}>
      {children}
    </div>
  );
}

function Tag({ label, color = G.green }) {
  return (
    <span className="mono" style={{
      background: `${color}18`, border: `1px solid ${color}40`, color, borderRadius: "6px",
      padding: "3px 10px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.5px",
    }}>{label}</span>
  );
}

function MetricCard({ icon, label, value, unit, color = G.green, sub }) {
  return (
    <Card style={{ textAlign: "center", animation: "countUp 0.7s ease forwards" }}>
      <div style={{ fontSize: "32px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ color: G.textMuted, fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>{label}</div>
      <div className="mono" style={{ color, fontSize: "32px", fontWeight: 700, lineHeight: 1 }}>{value}</div>
      <div style={{ color: G.textMuted, fontSize: "13px", marginTop: "4px" }}>{unit}</div>
      {sub && <div style={{ color: G.textMuted, fontSize: "11px", marginTop: "8px", borderTop: `1px solid ${G.border}`, paddingTop: "8px" }}>{sub}</div>}
    </Card>
  );
}

function GaugeChart({ score }) {
  const angle = (score / 100) * 180 - 90;
  const color = score >= 70 ? G.green : score >= 40 ? G.amber : G.red;
  const r = 80, cx = 110, cy = 110;
  const startAngle = Math.PI;
  const endAngle = 0;
  const sweep = (score / 100) * Math.PI;
  const x1 = cx + r * Math.cos(Math.PI);
  const y1 = cy + r * Math.sin(Math.PI);
  const x2 = cx + r * Math.cos(Math.PI - sweep);
  const y2 = cy + r * Math.sin(Math.PI - sweep);

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="220" height="130" style={{ overflow: "visible" }}>
        {/* Track */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={G.bgPanel} strokeWidth="16" strokeLinecap="round" />
        {/* Progress */}
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
          fill="none" stroke={color} strokeWidth="16" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
        {/* Center text */}
        <text x={cx} y={cy - 10} textAnchor="middle" fill={color} fontSize="36" fontWeight="800" fontFamily="Syne">{score}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fill={G.textMuted} fontSize="13" fontFamily="Syne">SUSTAINABILITY SCORE</text>
        {/* Labels */}
        <text x={cx - r - 8} y={cy + 20} fill={G.textMuted} fontSize="11" fontFamily="JetBrains Mono">0</text>
        <text x={cx + r - 8} y={cy + 20} fill={G.textMuted} fontSize="11" fontFamily="JetBrains Mono">100</text>
      </svg>
      <Tag label={score >= 70 ? "SUSTAINABLE" : score >= 40 ? "MODERATE RISK" : "HIGH RISK"} color={color} />
    </div>
  );
}

// ─── WORLD MAP ────────────────────────────────────────────────────────────────
const LOCATIONS = [
  { id: "UK", label: "United Kingdom", x: 470, y: 160, cx: "52.37,-1.17" },
  { id: "US", label: "United States", x: 200, y: 200, cx: "39.5,-98.35" },
  { id: "Nordic", label: "Nordic Region", x: 510, y: 120, cx: "64.0,15.0" },
  { id: "Desert", label: "Middle East / Desert", x: 580, y: 230, cx: "25.0,45.0" },
];

function WorldMap({ selected, onSelect }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "780px", margin: "0 auto" }}>
      {/* SVG World outline (simplified) */}
      <svg viewBox="0 0 800 420" style={{ width: "100%", borderRadius: "16px", border: `1px solid ${G.border}`, background: "#071410" }}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <line key={`v${i}`} x1={i * 133} y1={0} x2={i * 133} y2={420} stroke={G.border} strokeWidth="0.5" />
        ))}
        {[0, 1, 2, 3].map(i => (
          <line key={`h${i}`} x1={0} y1={i * 105} x2={800} y2={i * 105} stroke={G.border} strokeWidth="0.5" />
        ))}
        {/* Continents (simplified polygons) */}
        {/* North America */}
        <polygon points="80,100 280,100 300,180 260,280 160,280 100,200" fill="#0d2018" stroke={`${G.green}30`} strokeWidth="1" />
        {/* South America */}
        <polygon points="160,290 260,290 270,400 190,410 150,370" fill="#0d2018" stroke={`${G.green}30`} strokeWidth="1" />
        {/* Europe */}
        <polygon points="430,90 540,90 550,180 490,200 420,180" fill="#0d2018" stroke={`${G.green}30`} strokeWidth="1" />
        {/* Africa */}
        <polygon points="450,200 570,200 570,370 510,400 460,370 440,290" fill="#0d2018" stroke={`${G.green}30`} strokeWidth="1" />
        {/* Asia */}
        <polygon points="560,80 750,80 760,240 680,280 600,260 540,200 550,140" fill="#0d2018" stroke={`${G.green}30`} strokeWidth="1" />
        {/* Australia */}
        <polygon points="670,300 760,300 760,380 690,390 660,360" fill="#0d2018" stroke={`${G.green}30`} strokeWidth="1" />

        {/* Location markers */}
        {LOCATIONS.map(loc => {
          const isSelected = selected === loc.id;
          const isHovered = hovered === loc.id;
          const c = isSelected ? G.green : isHovered ? G.blue : G.textMuted;
          return (
            <g key={loc.id} onClick={() => onSelect(loc.id)} onMouseEnter={() => setHovered(loc.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
              {/* Ping ring */}
              {isSelected && <circle cx={loc.x} cy={loc.y} r="18" fill="none" stroke={G.green} strokeWidth="1.5" opacity="0.5" style={{ animation: "pulse 1.5s infinite" }} />}
              <circle cx={loc.x} cy={loc.y} r="10" fill={isSelected ? `${G.green}30` : "transparent"} stroke={c} strokeWidth="2" />
              <circle cx={loc.x} cy={loc.y} r="4" fill={c} style={{ filter: isSelected ? `drop-shadow(0 0 6px ${G.green})` : "none" }} />
              <text x={loc.x + 14} y={loc.y + 5} fill={c} fontSize="11" fontFamily="JetBrains Mono" fontWeight={isSelected ? "600" : "400"}>{loc.label}</text>
            </g>
          );
        })}
      </svg>
      {/* Selected info */}
      {selected && (
        <div className="fade-up" style={{
          marginTop: "16px", background: G.bgPanel, border: `1px solid ${G.border}`,
          borderRadius: "12px", padding: "16px 20px", display: "flex", gap: "24px", flexWrap: "wrap",
        }}>
          {(() => {
            const info = REGION_LABELS[selected];
            const carbon = REGION_CARBON[selected];
            return (
              <>
                <div><span style={{ color: G.textMuted, fontSize: "11px", display: "block", marginBottom: "2px" }}>REGION</span><span className="mono" style={{ color: G.green }}>{info.name}</span></div>
                <div><span style={{ color: G.textMuted, fontSize: "11px", display: "block", marginBottom: "2px" }}>CLIMATE</span><span className="mono" style={{ color: G.blue }}>{info.climate}</span></div>
                <div><span style={{ color: G.textMuted, fontSize: "11px", display: "block", marginBottom: "2px" }}>GRID CARBON</span><span className="mono" style={{ color: G.amber }}>{carbon} kg CO₂/kWh</span></div>
                <div><span style={{ color: G.textMuted, fontSize: "11px", display: "block", marginBottom: "2px" }}>GRID INTENSITY</span><span className="mono" style={{ color: G.text }}>{info.grid}</span></div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────
function PageLanding({ onNext }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <div className="grid-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "60px 24px", position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: `radial-gradient(ellipse, ${G.greenGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "820px" }}>
          <Tag label="CLIMATE-TECH PLATFORM" />
          <h1 style={{ fontSize: "clamp(36px,6vw,72px)", fontWeight: 800, lineHeight: 1.1, marginTop: "20px", marginBottom: "20px" }}>
            <span style={{ color: G.green }}>EcoFlux</span><br />
            <span style={{ color: G.text }}>Sustainable AI Infrastructure</span><br />
            <span style={{ background: `linear-gradient(90deg, ${G.blue}, ${G.green})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Simulator</span>
          </h1>
          <p style={{ fontSize: "18px", color: G.textMuted, maxWidth: "560px", margin: "0 auto 12px", lineHeight: 1.7 }}>
            Simulate the environmental impact of AI data centers <em style={{ color: G.text }}>before deployment</em>. Make smarter, greener infrastructure decisions.
          </p>
          <p style={{ fontSize: "14px", color: G.textMuted, maxWidth: "520px", margin: "0 auto 36px", lineHeight: 1.6 }}>
            AI training and inference workloads now consume more electricity than many countries. Cooling systems drain billions of litres of water annually. EcoFlux helps you measure and mitigate this impact before a single server is installed.
          </p>
          <Btn onClick={onNext}>Start Simulation →</Btn>
        </div>
      </div>

      {/* Problem Section */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Tag label="THE PROBLEM" color={G.red} />
          <h2 style={{ fontSize: "36px", fontWeight: 800, marginTop: "16px" }}>AI Infrastructure Has a <span style={{ color: G.red }}>Hidden Cost</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "24px" }}>
          {[
            { icon: "⚡", title: "Massive Energy Consumption", desc: "A single large language model training run can consume as much electricity as dozens of homes use in a year. At scale, AI data centers demand gigawatts of continuous power.", color: G.amber },
            { icon: "💧", title: "Water Scarcity Pressure", desc: "Cooling towers evaporate millions of litres of water daily. Many data centres are sited in water-stressed regions, competing with agriculture and local communities.", color: G.blue },
            { icon: "🌍", title: "Carbon-Heavy Grid Dependency", desc: "Infrastructure deployed in regions with fossil-fuel-heavy grids generates enormous CO₂ emissions, undermining corporate net-zero commitments.", color: G.red },
          ].map(item => (
            <Card key={item.title} style={{ borderColor: `${item.color}30` }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>{item.icon}</div>
              <h3 style={{ color: item.color, fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>{item.title}</h3>
              <p style={{ color: G.textMuted, lineHeight: 1.7, fontSize: "14px" }}>{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Solution Section */}
      <section style={{ padding: "80px 24px", background: `linear-gradient(135deg, ${G.bgCard}, ${G.bgPanel})` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <Tag label="THE SOLUTION" color={G.green} />
          <h2 style={{ fontSize: "36px", fontWeight: 800, marginTop: "16px", marginBottom: "48px" }}>How <span style={{ color: G.green }}>EcoFlux</span> Helps</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "20px" }}>
            {[
              { n: "01", title: "Simulate Impact", desc: "Model energy, water, and carbon before any infrastructure is built." },
              { n: "02", title: "Sustainability Score", desc: "Receive a 0–100 composite score reflecting your configuration's footprint." },
              { n: "03", title: "Cooling Recommendations", desc: "Get intelligent cooling strategy advice tailored to your region and load." },
              { n: "04", title: "Future Projections", desc: "See 5-year scaling scenarios as AI compute demand grows." },
            ].map(item => (
              <div key={item.n} style={{ padding: "28px 20px", background: G.bgCard, borderRadius: "14px", border: `1px solid ${G.border}` }}>
                <div className="mono" style={{ color: G.green, fontSize: "28px", fontWeight: 700, marginBottom: "10px" }}>{item.n}</div>
                <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>{item.title}</div>
                <div style={{ color: G.textMuted, fontSize: "13px", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
        <Tag label="FEATURES" color={G.blue} />
        <h2 style={{ fontSize: "36px", fontWeight: 800, marginTop: "16px", marginBottom: "40px" }}>Platform <span style={{ color: G.blue }}>Capabilities</span></h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "20px" }}>
          {[
            { icon: "🔬", label: "Environmental Simulation", color: G.green },
            { icon: "📊", label: "Infrastructure Sustainability Scoring", color: G.blue },
            { icon: "📈", label: "Future Impact Projections", color: G.amber },
            { icon: "🧠", label: "Decision Intelligence", color: G.green },
            { icon: "🌡️", label: "Cooling Strategy Advisor", color: G.blue },
            { icon: "⚖️", label: "Scenario Comparison", color: G.amber },
          ].map(f => (
            <div key={f.label} style={{ padding: "24px 16px", background: G.bgCard, borderRadius: "14px", border: `1px solid ${f.color}30`, transition: "all 0.25s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = f.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${f.color}30`}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>{f.icon}</div>
              <div style={{ color: f.color, fontSize: "14px", fontWeight: 600 }}>{f.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "48px" }}>
          <Btn onClick={onNext}>Launch Simulator →</Btn>
        </div>
      </section>
    </div>
  );
}

function PageLocation({ selected, onSelect, onNext, onBack }) {
  return (
    <div style={{ minHeight: "100vh", padding: "60px 24px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "8px" }}><Tag label="STEP 1 OF 3" /></div>
      <h2 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "8px" }}>Select <span style={{ color: G.green }}>Data Center Location</span></h2>
      <p style={{ color: G.textMuted, marginBottom: "40px", fontSize: "15px" }}>Choose a region to automatically load its grid carbon intensity, climate, and water stress characteristics.</p>
      <WorldMap selected={selected} onSelect={onSelect} />
      <div style={{ marginTop: "32px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <Btn onClick={onBack} variant="ghost">← Back</Btn>
        <Btn onClick={onNext} variant="primary" style={{ opacity: selected ? 1 : 0.4, pointerEvents: selected ? "auto" : "none" }}>Next →</Btn>
      </div>
    </div>
  );
}

function PageInputs({ config, setConfig, onNext, onBack }) {
  const update = (k, v) => setConfig(c => ({ ...c, [k]: v }));
  return (
    <div style={{ minHeight: "100vh", padding: "60px 24px", maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ marginBottom: "8px" }}><Tag label="STEP 2 OF 3" /></div>
      <h2 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "8px" }}>Infrastructure <span style={{ color: G.blue }}>Configuration</span></h2>
      <p style={{ color: G.textMuted, marginBottom: "40px", fontSize: "15px" }}>Configure your planned AI data center infrastructure to generate an environmental simulation.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {/* Compute Load */}
        <Card>
          <label style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", color: G.textMuted, display: "block", marginBottom: "10px" }}>COMPUTE LOAD (MW)</label>
          <input type="number" min="1" max="1000" value={config.computeMW} onChange={e => update("computeMW", Number(e.target.value))} />
          <div style={{ color: G.textMuted, fontSize: "12px", marginTop: "8px" }}>Planned peak compute capacity in megawatts</div>
        </Card>

        {/* Cooling Type */}
        <Card>
          <label style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", color: G.textMuted, display: "block", marginBottom: "10px" }}>COOLING TYPE</label>
          <select value={config.coolingType} onChange={e => update("coolingType", e.target.value)}>
            <option value="Air">Air Cooling</option>
            <option value="Water">Water Cooling</option>
            <option value="Liquid">Liquid Cooling (Direct-to-Chip)</option>
          </select>
        </Card>

        {/* Renewable % */}
        <Card>
          <label style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", color: G.textMuted, display: "block", marginBottom: "10px" }}>
            RENEWABLE ENERGY AVAILABILITY — <span className="mono" style={{ color: G.green }}>{config.renewablePC}%</span>
          </label>
          <input type="range" min="0" max="100" value={config.renewablePC} onChange={e => update("renewablePC", Number(e.target.value))} style={{ width: "100%" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            <span style={{ color: G.textMuted, fontSize: "11px" }}>0% Grid</span>
            <span style={{ color: G.textMuted, fontSize: "11px" }}>100% Renewable</span>
          </div>
        </Card>

        {/* Water Stress */}
        <Card>
          <label style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", color: G.textMuted, display: "block", marginBottom: "10px" }}>WATER STRESS INDEX</label>
          <select value={config.waterStress} onChange={e => update("waterStress", e.target.value)}>
            <option value="Low">Low — Abundant water availability</option>
            <option value="Medium">Medium — Seasonal scarcity possible</option>
            <option value="High">High — Severe water stress region</option>
          </select>
        </Card>
      </div>

      <div style={{ marginTop: "36px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <Btn onClick={onBack} variant="ghost">← Back</Btn>
        <Btn onClick={onNext} variant="blue">Run EcoFlux Simulation ⚡</Btn>
      </div>
    </div>
  );
}

function PageProcessing({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const steps = [
    "Loading regional grid data…",
    "Modelling energy consumption…",
    "Calculating water demand…",
    "Computing carbon emissions…",
    "Generating sustainability score…",
    "Preparing insights & recommendations…",
    "Simulation complete ✓",
  ];

  useEffect(() => {
    const iv = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + 2.5, 100);
        setStep(Math.floor(next / (100 / steps.length)));
        if (next >= 100) { clearInterval(iv); setTimeout(onDone, 600); }
        return next;
      });
    }, 60);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 24px" }}>
      {/* Spinner */}
      <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: `3px solid ${G.border}`, borderTop: `3px solid ${G.green}`, animation: "spin 1s linear infinite", marginBottom: "40px" }} />
      <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Running <span style={{ color: G.green }}>EcoFlux Simulation</span></h2>
      <p className="mono" style={{ color: G.textMuted, marginBottom: "32px" }}>{steps[Math.min(step, steps.length - 1)]}</p>

      {/* Progress bar */}
      <div style={{ width: "100%", maxWidth: "500px", background: G.bgPanel, borderRadius: "8px", height: "8px", overflow: "hidden", marginBottom: "24px" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${G.green}, ${G.blue})`, borderRadius: "8px", transition: "width 0.1s", boxShadow: `0 0 12px ${G.green}` }} />
      </div>
      <div className="mono" style={{ color: G.green, fontSize: "24px", fontWeight: 700 }}>{Math.round(progress)}%</div>
    </div>
  );
}

function PageResults({ results, config, onNext, onBack }) {
  const { annualEnergy, waterConsumption, carbon, score } = results;
  return (
    <div style={{ padding: "60px 24px", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ marginBottom: "8px" }}><Tag label="SIMULATION RESULTS" /></div>
      <h2 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "32px" }}>Environmental Impact <span style={{ color: G.green }}>Dashboard</span></h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "20px", marginBottom: "32px" }}>
        <MetricCard icon="⚡" label="Annual Energy Usage" value={fmt(annualEnergy)} unit="MWh / year" color={G.amber} sub={`${fmt(annualEnergy * 1000)} kWh`} />
        <MetricCard icon="💧" label="Water Consumption" value={fmt(waterConsumption)} unit="m³ / year" color={G.blue} sub={`≈ ${fmt(waterConsumption / 2500)} Olympic pools`} />
        <MetricCard icon="🌫️" label="Carbon Emissions" value={fmt(carbon)} unit="tonnes CO₂ / year" color={G.red} sub={`≈ ${fmt(carbon / 4.6)} car-years`} />
      </div>

      {/* Score gauge */}
      <Card style={{ textAlign: "center", padding: "40px", marginBottom: "32px" }}>
        <GaugeChart score={score} />
        <p style={{ color: G.textMuted, marginTop: "20px", maxWidth: "480px", margin: "20px auto 0", fontSize: "14px", lineHeight: 1.7 }}>
          Score based on renewable energy share ({config.renewablePC}%), water stress ({config.waterStress}), and regional carbon intensity. Higher is more sustainable.
        </p>
      </Card>

      {/* Bar chart */}
      <Card style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "20px", fontWeight: 700 }}>Configuration Summary</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={[
            { name: "Energy (MWh/yr)", value: annualEnergy, fill: G.amber },
            { name: "Water (m³/yr)", value: waterConsumption, fill: G.blue },
            { name: "Carbon (t/yr)", value: carbon, fill: G.red },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke={G.border} />
            <XAxis dataKey="name" tick={{ fill: G.textMuted, fontSize: 11 }} />
            <YAxis tick={{ fill: G.textMuted, fontSize: 11 }} tickFormatter={v => fmt(v)} />
            <Tooltip contentStyle={{ background: G.bgPanel, border: `1px solid ${G.border}`, borderRadius: "8px", color: G.text }} formatter={v => fmt(v)} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {[G.amber, G.blue, G.red].map((c, i) => (
                <rect key={i} fill={c} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <Btn onClick={onBack} variant="ghost">← Back</Btn>
        <Btn onClick={onNext}>View Full Analysis →</Btn>
      </div>
    </div>
  );
}

function PageInsights({ results, config, onNext, onBack }) {
  const { annualEnergy, waterConsumption, carbon, score } = results;
  const warnings = [];
  if (config.waterStress === "High") warnings.push({ icon: "💧", color: G.blue, title: "Water Risk Warning", desc: `High water stress region detected. Your configuration requires ~${fmt(waterConsumption)} m³/year. Water cooling in this region may accelerate local depletion and draw regulatory attention.` });
  if (REGION_CARBON[config.region] > 0.3 && config.renewablePC < 40) warnings.push({ icon: "🌫️", color: G.red, title: "Carbon Emissions Risk", desc: `Grid carbon intensity is ${REGION_CARBON[config.region]} kg CO₂/kWh with only ${config.renewablePC}% renewables. This configuration could emit ${fmt(carbon)} tonnes of CO₂ annually — equivalent to ${fmt(carbon / 4.6)} cars driven for a year.` });
  if (config.renewablePC < 30) warnings.push({ icon: "⚡", color: G.amber, title: "Grid Dependency Alert", desc: `Only ${config.renewablePC}% renewable energy. High reliance on fossil-fuel grid power increases both cost exposure and emissions. Consider on-site solar or long-term renewable PPAs.` });
  if (score >= 70) warnings.push({ icon: "✅", color: G.green, title: "Configuration Looks Sustainable", desc: `Your sustainability score of ${score}/100 indicates a relatively green configuration. Continue optimising renewable share and cooling efficiency to push further.` });

  return (
    <div style={{ padding: "60px 24px", maxWidth: "900px", margin: "0 auto" }}>
      <Tag label="ENVIRONMENTAL INSIGHTS" color={G.amber} />
      <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "12px 0 32px" }}>Impact <span style={{ color: G.amber }}>Analysis</span></h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {warnings.map((w, i) => (
          <Card key={i} style={{ borderColor: `${w.color}40`, animation: `fadeUp 0.5s ${i * 0.1}s ease forwards`, opacity: 0 }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "32px" }}>{w.icon}</span>
              <div>
                <div style={{ color: w.color, fontWeight: 700, fontSize: "17px", marginBottom: "8px" }}>{w.title}</div>
                <p style={{ color: G.textMuted, lineHeight: 1.7, fontSize: "14px" }}>{w.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "32px" }}>
        <Btn onClick={onBack} variant="ghost">← Back</Btn>
        <Btn onClick={onNext}>Cooling Recommendations →</Btn>
      </div>
    </div>
  );
}

function PageCooling({ config, results, onNext, onBack }) {
  const cooling = config.coolingType;
  const rec = cooling === "Air" ? {
    strategy: "Direct-to-Chip Liquid Cooling",
    reason: "Your current air cooling configuration has the highest water-equivalent energy overhead. Switching to direct-to-chip liquid cooling would significantly reduce PUE (Power Usage Effectiveness) and eliminate the need for large cooling towers.",
    benefits: ["30–50% reduction in cooling energy overhead", "Eliminates evaporative water loss", "Enables higher rack density and compute efficiency", "Reduces long-term carbon footprint"],
    icon: "🧊",
  } : cooling === "Water" ? {
    strategy: "Closed-Loop Chilled Water + Free Cooling",
    reason: "Water cooling is efficient but in water-stressed regions it can strain local supplies. A closed-loop system with adiabatic free cooling reduces evaporative loss by up to 70% while maintaining thermal performance.",
    benefits: ["Up to 70% reduction in water evaporation", "Free cooling utilises ambient temperature in suitable climates", "Lower operational costs than open-tower systems", "Better suited for high water-stress regions"],
    icon: "♻️",
  } : {
    strategy: "Optimised Liquid Cooling — Keep & Enhance",
    reason: "Your liquid cooling choice is already the most efficient strategy. To further improve sustainability, consider integrating waste heat recovery to serve adjacent buildings or district heating systems.",
    benefits: ["Waste heat recovery for external use", "Integrate immersion cooling for the densest racks", "Pair with on-site renewable generation (solar canopies)", "Negotiate green PPAs for remaining grid draw"],
    icon: "✅",
  };

  return (
    <div style={{ padding: "60px 24px", maxWidth: "900px", margin: "0 auto" }}>
      <Tag label="COOLING STRATEGY" color={G.blue} />
      <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "12px 0 32px" }}>Intelligent <span style={{ color: G.blue }}>Recommendation</span></h2>
      <Card glow style={{ marginBottom: "24px", borderColor: `${G.blue}40` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <span style={{ fontSize: "48px" }}>{rec.icon}</span>
          <div>
            <div style={{ color: G.textMuted, fontSize: "12px", letterSpacing: "1px", fontWeight: 700 }}>RECOMMENDED COOLING STRATEGY</div>
            <div style={{ color: G.blue, fontSize: "24px", fontWeight: 800, marginTop: "4px" }}>{rec.strategy}</div>
          </div>
        </div>
        <p style={{ color: G.textMuted, lineHeight: 1.7, fontSize: "15px", marginBottom: "24px", borderLeft: `3px solid ${G.blue}`, paddingLeft: "16px" }}>{rec.reason}</p>
        <h4 style={{ color: G.text, marginBottom: "12px", fontWeight: 700 }}>Key Benefits:</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {rec.benefits.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: G.green, fontSize: "16px" }}>✓</span>
              <span style={{ color: G.text, fontSize: "14px" }}>{b}</span>
            </div>
          ))}
        </div>
      </Card>
      {/* Comparison table */}
      <Card>
        <h4 style={{ marginBottom: "16px", fontWeight: 700 }}>Cooling Comparison</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", fontSize: "13px" }}>
          {["Method", "Water Use", "Energy Efficiency", "Best For"].map(h => (
            <div key={h} className="mono" style={{ color: G.textMuted, fontSize: "11px", fontWeight: 700, borderBottom: `1px solid ${G.border}`, paddingBottom: "8px" }}>{h}</div>
          ))}
          {[
            ["Air Cooling", "None", "★★☆", "Low-density"],
            ["Water Cooling", "High", "★★★", "Mid-density"],
            ["Liquid Cooling", "Very Low", "★★★★", "High-density AI"],
          ].map(row => row.map((cell, i) => (
            <div key={i} style={{ color: i === 0 ? G.text : G.textMuted, padding: "6px 0", fontSize: "13px" }}>{cell}</div>
          )))}
        </div>
      </Card>
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "28px" }}>
        <Btn onClick={onBack} variant="ghost">← Back</Btn>
        <Btn onClick={onNext}>Future Projections →</Btn>
      </div>
    </div>
  );
}

function PageProjections({ results, onNext, onBack }) {
  const projData = projectFuture(results);
  const mult = projData[projData.length - 1].energy / projData[0].energy;
  return (
    <div style={{ padding: "60px 24px", maxWidth: "1100px", margin: "0 auto" }}>
      <Tag label="FUTURE PROJECTIONS" color={G.amber} />
      <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "12px 0 12px" }}>5-Year Environmental <span style={{ color: G.amber }}>Impact Forecast</span></h2>
      <p style={{ color: G.textMuted, marginBottom: "32px", fontSize: "15px" }}>Assumes 20% annual AI compute demand growth (industry consensus estimate).</p>

      <Card style={{ background: `linear-gradient(135deg, ${G.bgCard}, #1a1500)`, borderColor: `${G.amber}30`, marginBottom: "24px", padding: "24px 28px" }}>
        <div style={{ fontSize: "15px", lineHeight: 1.7, color: G.text }}>
          🔮 <strong style={{ color: G.amber }}>Projection Alert:</strong> By {projData[projData.length - 1].year}, if AI compute demand grows at 20% annually, this facility could consume <strong style={{ color: G.amber }}>{mult.toFixed(1)}× more energy</strong>, with proportional increases in water demand and carbon emissions — unless renewable capacity is expanded in parallel.
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        <Card>
          <h4 style={{ marginBottom: "16px", fontWeight: 700, color: G.amber }}>Energy Demand Projection</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={projData}>
              <CartesianGrid strokeDasharray="3 3" stroke={G.border} />
              <XAxis dataKey="year" tick={{ fill: G.textMuted, fontSize: 11 }} />
              <YAxis tick={{ fill: G.textMuted, fontSize: 11 }} tickFormatter={v => fmt(v)} />
              <Tooltip contentStyle={{ background: G.bgPanel, border: `1px solid ${G.border}`, borderRadius: "8px", color: G.text }} formatter={v => [fmt(v) + " MWh", "Energy"]} />
              <Line type="monotone" dataKey="energy" stroke={G.amber} strokeWidth={2.5} dot={{ fill: G.amber, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h4 style={{ marginBottom: "16px", fontWeight: 700, color: G.blue }}>Water Consumption Projection</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={projData}>
              <CartesianGrid strokeDasharray="3 3" stroke={G.border} />
              <XAxis dataKey="year" tick={{ fill: G.textMuted, fontSize: 11 }} />
              <YAxis tick={{ fill: G.textMuted, fontSize: 11 }} tickFormatter={v => fmt(v)} />
              <Tooltip contentStyle={{ background: G.bgPanel, border: `1px solid ${G.border}`, borderRadius: "8px", color: G.text }} formatter={v => [fmt(v) + " m³", "Water"]} />
              <Line type="monotone" dataKey="water" stroke={G.blue} strokeWidth={2.5} dot={{ fill: G.blue, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h4 style={{ marginBottom: "16px", fontWeight: 700, color: G.red }}>Carbon Emissions Trajectory</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={projData}>
            <CartesianGrid strokeDasharray="3 3" stroke={G.border} />
            <XAxis dataKey="year" tick={{ fill: G.textMuted, fontSize: 11 }} />
            <YAxis tick={{ fill: G.textMuted, fontSize: 11 }} tickFormatter={v => fmt(v)} />
            <Tooltip contentStyle={{ background: G.bgPanel, border: `1px solid ${G.border}`, borderRadius: "8px", color: G.text }} formatter={v => [fmt(v) + " t CO₂", "Carbon"]} />
            <Bar dataKey="carbon" fill={G.red} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "28px" }}>
        <Btn onClick={onBack} variant="ghost">← Back</Btn>
        <Btn onClick={onNext}>Scenario Comparison →</Btn>
      </div>
    </div>
  );
}

function PageScenario({ config, onBack, onRestart }) {
  const scenarios = [
    { label: "Scenario A — Air Cooling", key: "Air" },
    { label: "Scenario B — Water Cooling", key: "Water" },
    { label: "Scenario C — Liquid Cooling", key: "Liquid" },
  ];

  const data = scenarios.map(s => {
    const r = simulate({ ...config, coolingType: s.key });
    return { name: s.key, energy: r.annualEnergy, water: r.waterConsumption, carbon: r.carbon, score: r.score };
  });

  const colors = [G.amber, G.blue, G.green];
  const metrics = [
    { key: "energy", label: "Energy (MWh/yr)", color: G.amber },
    { key: "water", label: "Water (m³/yr)", color: G.blue },
    { key: "carbon", label: "Carbon (t/yr)", color: G.red },
    { key: "score", label: "Sustainability Score", color: G.green },
  ];

  return (
    <div style={{ padding: "60px 24px", maxWidth: "1100px", margin: "0 auto" }}>
      <Tag label="SCENARIO COMPARISON" color={G.green} />
      <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "12px 0 8px" }}>Cooling Strategy <span style={{ color: G.green }}>Comparison</span></h2>
      <p style={{ color: G.textMuted, marginBottom: "36px", fontSize: "15px" }}>Compare all three cooling strategies with your current location and compute load.</p>

      {/* Score cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", marginBottom: "32px" }}>
        {data.map((d, i) => (
          <Card key={d.name} style={{ textAlign: "center", borderColor: `${colors[i]}40` }}>
            <div style={{ color: colors[i], fontWeight: 800, fontSize: "17px", marginBottom: "12px" }}>{scenarios[i].label}</div>
            <GaugeChart score={d.score} />
          </Card>
        ))}
      </div>

      {/* Comparison charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {metrics.slice(0, 3).map(m => (
          <Card key={m.key}>
            <h4 style={{ marginBottom: "16px", fontWeight: 700, color: m.color }}>{m.label}</h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={G.border} />
                <XAxis dataKey="name" tick={{ fill: G.textMuted, fontSize: 11 }} />
                <YAxis tick={{ fill: G.textMuted, fontSize: 11 }} tickFormatter={v => fmt(v)} />
                <Tooltip contentStyle={{ background: G.bgPanel, border: `1px solid ${G.border}`, borderRadius: "8px", color: G.text }} formatter={v => fmt(v)} />
                <Bar dataKey={m.key} fill={m.color} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        ))}

        {/* Radar */}
        <Card>
          <h4 style={{ marginBottom: "16px", fontWeight: 700, color: G.green }}>Sustainability Profile Radar</h4>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={[
              { subject: "Renewables", A: config.renewablePC, B: config.renewablePC, C: config.renewablePC },
              { subject: "Water Eff.", A: 30, B: 55, C: 90 },
              { subject: "Carbon", A: 40, B: 60, C: 80 },
              { subject: "Score", A: data[0].score, B: data[1].score, C: data[2].score },
            ]}>
              <PolarGrid stroke={G.border} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: G.textMuted, fontSize: 11 }} />
              <Radar name="Air" dataKey="A" stroke={G.amber} fill={G.amber} fillOpacity={0.15} />
              <Radar name="Water" dataKey="B" stroke={G.blue} fill={G.blue} fillOpacity={0.15} />
              <Radar name="Liquid" dataKey="C" stroke={G.green} fill={G.green} fillOpacity={0.2} />
              <Legend wrapperStyle={{ color: G.textMuted, fontSize: "12px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recommendation */}
      <Card style={{ marginTop: "24px", background: `linear-gradient(135deg, ${G.bgCard}, #001a0e)`, borderColor: `${G.green}40` }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span style={{ fontSize: "36px" }}>🏆</span>
          <div>
            <div style={{ color: G.green, fontWeight: 800, fontSize: "18px", marginBottom: "4px" }}>Recommended: Liquid Cooling</div>
            <p style={{ color: G.textMuted, fontSize: "14px", lineHeight: 1.6 }}>Across all sustainability metrics, direct-to-chip liquid cooling consistently delivers the lowest water consumption, best energy efficiency, and highest sustainability score. For AI workloads, it is the most future-proof cooling investment.</p>
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "40px" }}>
        <Btn onClick={onBack} variant="ghost">← Back</Btn>
        <Btn onClick={onRestart} variant="primary">🔄 Run New Simulation</Btn>
      </div>
    </div>
  );
}

// ─── PAGE: FEATURES ──────────────────────────────────────────────────────────
function PageFeatures({ onStartSim }) {
  const features = [
    {
      icon: "🔬", color: G.green, title: "Environmental Simulation Engine",
      desc: "Physics-based formulas model annual energy consumption, water demand, and CO₂ emissions from your infrastructure inputs. Results reflect real-world grid carbon data and regional climate conditions.",
      bullets: ["Annual energy: Compute × 8,760 hrs", "Water: load × cooling factor × stress multiplier", "Carbon: energy × grid intensity × (1 − renewable %)"],
    },
    {
      icon: "📊", color: G.blue, title: "Infrastructure Sustainability Scoring",
      desc: "A composite 0–100 score weighs your renewable energy share (40%), water stress efficiency (30%), and carbon intensity (30%) into a single actionable metric.",
      bullets: ["Score ≥ 70: Sustainable configuration", "Score 40–69: Moderate risk — optimise renewables", "Score < 40: High risk — urgent redesign needed"],
    },
    {
      icon: "📈", color: G.amber, title: "Future Impact Projections",
      desc: "Model how your data center's footprint scales over 5 years as AI compute demand grows at 20% annually — the current industry consensus rate.",
      bullets: ["5-year energy demand trajectory", "Water consumption growth curve", "Carbon emission accumulation forecast"],
    },
    {
      icon: "🧠", color: G.green, title: "Decision Intelligence",
      desc: "Contextual warnings and risk alerts are generated from your specific configuration — not generic advice. EcoFlux surfaces the most critical issues for your region and workload.",
      bullets: ["Water risk warnings for stressed regions", "Grid dependency alerts for low-renewable configs", "Carbon overshoot detection"],
    },
    {
      icon: "🌡️", color: G.blue, title: "Cooling Strategy Advisor",
      desc: "Based on your compute load, region, and water stress index, EcoFlux recommends the optimal cooling technology with engineering justification and ROI context.",
      bullets: ["Air vs Water vs Liquid cooling analysis", "Region-specific suitability scoring", "Waste heat recovery opportunities"],
    },
    {
      icon: "⚖️", color: G.amber, title: "Scenario Comparison",
      desc: "Run side-by-side comparisons across all three cooling strategies with your fixed location and compute load. Radar charts and bar charts surface the sustainability trade-offs instantly.",
      bullets: ["Energy, water, carbon, and score compared", "Radar profile visualisation", "Clear winner recommendation"],
    },
    {
      icon: "🗺️", color: G.green, title: "Interactive Location Selection",
      desc: "Click a region on the world map to auto-populate grid carbon intensity, climate type, and water stress index — pulling from real regional environmental data.",
      bullets: ["UK, US, Nordic, Desert regions", "Live grid carbon intensity (kg CO₂/kWh)", "Automatic water stress pre-fill"],
    },
    {
      icon: "🌍", color: G.blue, title: "Regional Carbon Intelligence",
      desc: "EcoFlux uses real-world grid carbon intensity values per region, so your emissions estimates reflect actual electricity mix rather than generic averages.",
      bullets: ["Nordic: 0.071 kg CO₂/kWh (near-zero)", "UK: 0.233 kg CO₂/kWh (mixed grid)", "Desert regions: 0.45 kg CO₂/kWh (fossil-heavy)"],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "60px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <Tag label="PLATFORM CAPABILITIES" color={G.green} />
        <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 800, margin: "16px 0 12px" }}>
          Everything <span style={{ color: G.green }}>EcoFlux</span> Can Do
        </h1>
        <p style={{ color: G.textMuted, fontSize: "16px", maxWidth: "520px", margin: "0 auto 32px", lineHeight: 1.7 }}>
          A full-stack environmental intelligence platform for AI infrastructure planning — from simulation to recommendation.
        </p>
        <Btn onClick={onStartSim} variant="primary">Start Simulation →</Btn>
      </div>

      {/* Feature grid */}
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

      {/* CTA Banner */}
      <div style={{ marginTop: "60px", background: `linear-gradient(135deg, ${G.bgPanel}, #001a0e)`, border: `1px solid ${G.border}`, borderRadius: "20px", padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌿</div>
        <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "10px" }}>Ready to Model Your Infrastructure?</h2>
        <p style={{ color: G.textMuted, marginBottom: "28px", fontSize: "15px" }}>Select a region, configure your load, and receive a full environmental impact report in under 60 seconds.</p>
        <Btn onClick={onStartSim} variant="primary">Launch EcoFlux Simulator →</Btn>
      </div>
    </div>
  );
}

// ─── PAGE: ABOUT ─────────────────────────────────────────────────────────────
function PageAbout({ onStartSim }) {
  const team = [
    { name: "Dr. Amara Osei", role: "Chief Climate Scientist", icon: "👩‍🔬", note: "15 years modelling data center emissions at the intersection of AI and climate policy." },
    { name: "Lena Bergström", role: "Infrastructure Architect", icon: "👩‍💻", note: "Former hyperscale data center engineer. Designed cooling systems for 200MW+ facilities." },
    { name: "Kai Nakamura", role: "Sustainability Engineer", icon: "🧑‍🔧", note: "Water systems specialist with expertise in arid-region infrastructure and closed-loop cooling." },
    { name: "Priya Mehta", role: "Policy & Standards Lead", icon: "👩‍⚖️", note: "Worked with ISO TC 301 on energy efficiency standards for data centres globally." },
  ];

  const stats = [
    { value: "4", label: "Regions Modelled", color: G.green },
    { value: "3", label: "Cooling Strategies", color: G.blue },
    { value: "5yr", label: "Projection Window", color: G.amber },
    { value: "0–100", label: "Sustainability Scale", color: G.green },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <div className="grid-bg" style={{ padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "500px", height: "200px", background: `radial-gradient(ellipse, ${G.blueGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <Tag label="ABOUT ECOFLUX" color={G.blue} />
          <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 800, margin: "16px 0 16px" }}>
            Built for <span style={{ color: G.blue }}>Responsible</span> AI Infrastructure
          </h1>
          <p style={{ color: G.textMuted, fontSize: "16px", lineHeight: 1.8, marginBottom: "16px" }}>
            EcoFlux was created in response to a critical gap: AI infrastructure is expanding at extraordinary speed, yet environmental impact assessments remain an afterthought — or are skipped entirely.
          </p>
          <p style={{ color: G.textMuted, fontSize: "15px", lineHeight: 1.8 }}>
            We built a platform that makes environmental modelling as routine as capacity planning — accessible to engineers, researchers, and policymakers alike, before a single server rack is ordered.
          </p>
        </div>
      </div>

      {/* Stats */}
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

      {/* Mission */}
      <section style={{ padding: "40px 24px 60px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <Card style={{ borderColor: `${G.green}30` }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎯</div>
            <h3 style={{ color: G.green, fontWeight: 700, fontSize: "18px", marginBottom: "10px" }}>Our Mission</h3>
            <p style={{ color: G.textMuted, lineHeight: 1.7, fontSize: "14px" }}>
              To make environmental impact assessment a mandatory first step in AI infrastructure planning — not a compliance checkbox after deployment. We believe every megawatt of AI compute should have a verified environmental footprint before it goes live.
            </p>
          </Card>
          <Card style={{ borderColor: `${G.blue}30` }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔭</div>
            <h3 style={{ color: G.blue, fontWeight: 700, fontSize: "18px", marginBottom: "10px" }}>Our Vision</h3>
            <p style={{ color: G.textMuted, lineHeight: 1.7, fontSize: "14px" }}>
              A world where every hyperscale AI data center has been optimised for sustainability before construction begins — where liquid cooling, renewable energy, and water-conscious siting are the default, not the exception.
            </p>
          </Card>
          <Card style={{ borderColor: `${G.amber}30` }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>📐</div>
            <h3 style={{ color: G.amber, fontWeight: 700, fontSize: "18px", marginBottom: "10px" }}>Our Methodology</h3>
            <p style={{ color: G.textMuted, lineHeight: 1.7, fontSize: "14px" }}>
              EcoFlux uses engineering-grade formulas grounded in IEA grid carbon intensity data, published PUE benchmarks, and peer-reviewed water consumption coefficients for data center cooling technologies.
            </p>
          </Card>
          <Card style={{ borderColor: `${G.green}30` }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🤝</div>
            <h3 style={{ color: G.green, fontWeight: 700, fontSize: "18px", marginBottom: "10px" }}>Who It's For</h3>
            <p style={{ color: G.textMuted, lineHeight: 1.7, fontSize: "14px" }}>
              Infrastructure engineers evaluating data center designs. Sustainability officers needing credible impact estimates. Policymakers assessing AI infrastructure proposals. Researchers studying AI's environmental footprint.
            </p>
          </Card>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "20px 24px 80px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <Tag label="THE TEAM" color={G.green} />
          <h2 style={{ fontSize: "30px", fontWeight: 800, marginTop: "12px" }}>People Behind <span style={{ color: G.green }}>EcoFlux</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "20px" }}>
          {team.map((m, i) => (
            <Card key={m.name} style={{ textAlign: "center", animation: `fadeUp 0.5s ${i * 0.1}s ease forwards`, opacity: 0 }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: G.text, marginBottom: "4px" }}>{m.name}</div>
              <div style={{ color: G.green, fontSize: "12px", fontWeight: 600, marginBottom: "10px" }}>{m.role}</div>
              <p style={{ color: G.textMuted, fontSize: "12px", lineHeight: 1.6 }}>{m.note}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ padding: "0 24px 80px", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <Card style={{ background: `linear-gradient(135deg, ${G.bgCard}, #001a0e)`, borderColor: `${G.green}40`, padding: "40px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "12px" }}>Start Your Environmental Assessment</h2>
          <p style={{ color: G.textMuted, marginBottom: "24px", fontSize: "14px" }}>Model your AI data center's footprint in minutes. No account required.</p>
          <Btn onClick={onStartSim} variant="primary">Launch Simulator →</Btn>
        </Card>
      </div>
    </div>
  );
}

// ─── NAV BAR ─────────────────────────────────────────────────────────────────
// navSection: "home" | "features" | "about" | "sim"
function NavBar({ navSection, onNav, simPage, onSimNav, simStarted }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainLinks = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "features", label: "Features", icon: "⚡" },
    { id: "about", label: "About", icon: "🌿" },
  ];
  const simSteps = ["Location", "Config", "Processing", "Results", "Insights", "Cooling", "Projections", "Scenarios"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: `${G.bg}f0`, backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${G.border}`,
    }}>
      <div style={{ height: "58px", display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => onNav("home")}>
          <span style={{ fontSize: "22px" }}>🌿</span>
          <span style={{ fontWeight: 800, color: G.green, fontSize: "19px", letterSpacing: "-0.5px" }}>EcoFlux</span>
          <Tag label="BETA" color={G.textMuted} />
        </div>

        {/* Main Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {mainLinks.map(link => {
            const active = navSection === link.id;
            return (
              <button key={link.id} onClick={() => onNav(link.id)}
                style={{
                  background: active ? `${G.green}18` : "transparent",
                  color: active ? G.green : G.textMuted,
                  border: active ? `1px solid ${G.border}` : "1px solid transparent",
                  borderRadius: "8px", padding: "7px 16px", fontSize: "14px", fontWeight: active ? 700 : 500,
                  cursor: "pointer", fontFamily: "'Syne', sans-serif", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = G.text; e.currentTarget.style.background = `${G.green}08`; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = G.textMuted; e.currentTarget.style.background = "transparent"; } }}>
                <span style={{ fontSize: "13px" }}>{link.icon}</span>
                {link.label}
              </button>
            );
          })}

          {/* Divider */}
          <div style={{ width: "1px", height: "24px", background: G.border, margin: "0 8px" }} />

          {/* Sim step pills — only shown during simulation */}
          {navSection === "sim" && simSteps.map((s, i) => {
            const idx = i; // simPage 0 = location (step 0)
            const active = simPage === idx;
            const done = simPage > idx;
            return (
              <button key={s}
                onClick={() => idx !== 2 && done && onSimNav(idx)}
                className="mono"
                title={s}
                style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: active ? G.green : done ? `${G.green}20` : G.bgPanel,
                  color: active ? G.bg : done ? G.green : G.textMuted,
                  border: active ? "none" : done ? `1px solid ${G.border}` : `1px solid ${G.bgPanel}`,
                  fontSize: "11px", fontWeight: 700, cursor: done && idx !== 2 ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'JetBrains Mono', monospace", transition: "all 0.2s",
                }}>
                {done && !active ? "✓" : i + 1}
              </button>
            );
          })}

          {/* Start Sim button */}
          {navSection !== "sim" && (
            <Btn onClick={() => onNav("sim")} variant="primary" style={{ padding: "8px 20px", fontSize: "13px", marginLeft: "8px" }}>
              Start Simulation ⚡
            </Btn>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [navSection, setNavSection] = useState("home"); // "home" | "features" | "about" | "sim"
  const [simPage, setSimPage] = useState(0); // 0=location,1=config,2=processing,3=results,4=insights,5=cooling,6=projections,7=scenarios
  const [region, setRegion] = useState(null);
  const [config, setConfig] = useState({ computeMW: 50, coolingType: "Water", renewablePC: 30, waterStress: "Medium", region: "US" });
  const [results, setResults] = useState(null);

  const goNav = (section) => { setNavSection(section); if (section === "sim") setSimPage(0); window.scrollTo(0, 0); };
  const goSim = (p) => { setSimPage(p); window.scrollTo(0, 0); };

  const handleRegionSelect = (r) => {
    setRegion(r);
    const stressMap = { UK: "Low", US: "Medium", Nordic: "Low", Desert: "High" };
    setConfig(c => ({ ...c, region: r, waterStress: stressMap[r] }));
  };

  const runSimulation = () => {
    setResults(simulate(config));
    goSim(2);
  };

  return (
    <>
      <style>{css}</style>
      <NavBar
        navSection={navSection}
        onNav={goNav}
        simPage={simPage}
        onSimNav={goSim}
        simStarted={!!results}
      />
      <div style={{ paddingTop: "58px" }}>
        {navSection === "home" && <PageLanding onNext={() => goNav("sim")} />}
        {navSection === "features" && <PageFeatures onStartSim={() => goNav("sim")} />}
        {navSection === "about" && <PageAbout onStartSim={() => goNav("sim")} />}
        {navSection === "sim" && (
          <>
            {simPage === 0 && <PageLocation selected={region} onSelect={handleRegionSelect} onNext={() => goSim(1)} onBack={() => goNav("home")} />}
            {simPage === 1 && <PageInputs config={config} setConfig={setConfig} onNext={runSimulation} onBack={() => goSim(0)} />}
            {simPage === 2 && <PageProcessing onDone={() => goSim(3)} />}
            {simPage === 3 && results && <PageResults results={results} config={config} onNext={() => goSim(4)} onBack={() => goSim(1)} />}
            {simPage === 4 && results && <PageInsights results={results} config={config} onNext={() => goSim(5)} onBack={() => goSim(3)} />}
            {simPage === 5 && results && <PageCooling config={config} results={results} onNext={() => goSim(6)} onBack={() => goSim(4)} />}
            {simPage === 6 && results && <PageProjections results={results} onNext={() => goSim(7)} onBack={() => goSim(5)} />}
            {simPage === 7 && results && <PageScenario config={config} onBack={() => goSim(6)} onRestart={() => { goNav("home"); setRegion(null); }} />}
          </>
        )}
      </div>
    </>
  );
}