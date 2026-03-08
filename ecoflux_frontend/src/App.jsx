import { useState, useEffect, useCallback } from "react";
import "./styles/GlobalStyles.css";
import { simulate } from "./utils/simulation";
import { runSimulationBackend } from "./utils/api";
// Common Components
import { NavBar } from "./components/common/NavBar";

// Page Components
import { LandingPage } from "./components/pages/LandingPage";
import { LocationPage } from "./components/pages/LocationPage";
import { ProcessingPage } from "./components/pages/ProcessingPage";
import { ResultsPage } from "./components/pages/ResultsPage";
import { CoolingPage } from "./components/pages/CoolingPage";
import { ProjectionsPage } from "./components/pages/ProjectionsPage";
import { ScenarioPage } from "./components/pages/ScenarioPage";

export default function App() {
  const [navSection, setNavSection] = useState("home"); // "home" | "sim"
  const [simPage, setSimPage] = useState(0); // 0=location&inputs, 1=results, 2=cooling, 3=projections, 4=scenarios
  const [region, setRegion] = useState(null);
  const [config, setConfig] = useState({
    computeMW: 100,
    coolingType: "liquid",
    renewablePC: 30,
    waterStress: "Medium",
    region: "KA",
    currentA: 450,
    workloadType: "AI Training",
  });
  const [results, setResults] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);

  const goNav = (section) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setNavSection(section);
      if (section === "sim") setSimPage(0);
      setIsTransitioning(false);
      window.scrollTo(0, 0);
    }, 500);
  };

  const goSim = (p) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSimPage(p);
      setIsTransitioning(false);
      window.scrollTo(0, 0);
    }, 500);
  };

  const handleRegionSelect = (r) => {
    setRegion(r);
    if (typeof r === 'string') {
      const stressMap = { MH: "High", KA: "Medium", DL: "High", TN: "Medium" };
      setConfig(c => ({ ...c, region: r, waterStress: stressMap[r] || "Medium" }));
    } else if (typeof r === 'object' && r !== null) {
      setConfig(c => ({ ...c, region: r.id, waterStress: r.waterStress || "Medium", customRegionData: r }));
    } else {
      setRegion(null);
    }
  };

  const runOptimization = async () => {
    setShowProcessing(true);
    const startTime = Date.now();

    try {
      const apiResults = await runSimulationBackend(config);

      const mappedResults = {
        annualEnergy: apiResults.energy_usage_mw * 8760,
        waterConsumption: apiResults.water_usage_index * 8760,
        carbon: apiResults.carbon_emission_index * 8760,
        score: Math.round(apiResults.sustainability_score),
        apiRaw: apiResults
      };

      setConfig(c => ({
        ...c,
        renewablePC: apiResults.environmental_metrics.renewable_share_percent,
        waterStress: apiResults.environmental_metrics.water.water_availability,
      }));

      setResults(mappedResults);

      const elapsed = Date.now() - startTime;
      const waitTime = Math.max(0, 2100 - elapsed);
      setTimeout(() => {
        setShowProcessing(false);
        goSim(1);
      }, waitTime);

    } catch (err) {
      console.warn("Backend failed, falling back to local simulation.", err);
      const fallbackResults = simulate(config);
      setResults(fallbackResults);

      const elapsed = Date.now() - startTime;
      const waitTime = Math.max(0, 2100 - elapsed);
      setTimeout(() => {
        setShowProcessing(false);
        goSim(1);
      }, waitTime);
    }
  };

  const onProcessingDone = useCallback(() => {
    // Page transition is now handled by runOptimization
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e) => {
      const ripple = document.createElement("div");
      ripple.className = "click-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    window.addEventListener("mousedown", handleGlobalClick);
    return () => window.removeEventListener("mousedown", handleGlobalClick);
  }, []);

  return (
    <>
      <NavBar
        navSection={navSection}
        onNav={goNav}
        simPage={simPage}
        onSimNav={goSim}
        simStarted={!!results}
      />

      {/* Global Background Video */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        overflow: "hidden"
      }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.35
          }}
        >
          <source src="/hero_bg.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Overlays */}
        <div
          className="grid-bg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(to bottom, rgba(5, 15, 10, 0.8) 0%, rgba(5, 15, 10, 0.5) 50%, rgba(5, 15, 10, 0.9) 100%)`,
            pointerEvents: "none",
            opacity: 0.4
          }}
        />
      </div>

      <div className={`page-fade ${isTransitioning ? "fade-out" : ""}`} style={{ position: "relative", zIndex: 1, paddingTop: "58px", minHeight: "100vh" }}>
        {navSection === "home" && <LandingPage onNext={() => goNav("sim")} />}
        {navSection === "sim" && (
          <>
            {simPage === 0 && <LocationPage selected={region} onSelect={handleRegionSelect} config={config} setConfig={setConfig} onNext={runOptimization} onBack={() => goNav("home")} />}
            {simPage === 1 && results && <ResultsPage results={results} config={config} onNext={() => goSim(2)} onBack={() => goSim(0)} />}
            {simPage === 2 && results && <CoolingPage config={config} results={results} onNext={() => goSim(3)} onBack={() => goSim(1)} />}
            {simPage === 3 && results && <ProjectionsPage results={results} onNext={() => goSim(4)} onBack={() => goSim(2)} />}
            {simPage === 4 && results && <ScenarioPage config={config} results={results} onBack={() => goSim(3)} onRestart={() => { goNav("home"); setRegion(null); }} />}
          </>
        )}
      </div>

      {showProcessing && <ProcessingPage />}
    </>
  );
}
