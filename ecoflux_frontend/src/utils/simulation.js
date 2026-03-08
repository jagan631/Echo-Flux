export const COOLING_FACTORS = { Air: 3.5, Water: 1.8, Liquid: 0.9, Immersion: 0.2, Evaporation: 1.2 };
export const WATER_STRESS_MULT = { Low: 1.0, Medium: 1.6, High: 2.5 };
export const REGION_CARBON = { MH: 0.650, KA: 0.350, DL: 0.680, TN: 0.450 };
export const REGION_LABELS = {
  MH: { name: "Mumbai (MH)", climate: "Tropical", grid: "Medium-High" },
  KA: { name: "Bengaluru (KA)", climate: "Tropical", grid: "Low" },
  DL: { name: "New Delhi (DL)", climate: "Subtropical", grid: "Medium-High" },
  TN: { name: "Chennai (TN)", climate: "Tropical", grid: "Low-Medium" },
};

export const LOCATIONS = [
  { id: "MH", label: "Mumbai", cx: "19.0760,72.8777" },
  { id: "KA", label: "Bengaluru", cx: "12.9716,77.5946" },
  { id: "DL", label: "New Delhi", cx: "28.6139,77.2090" },
  { id: "TN", label: "Chennai", cx: "13.0827,80.2707" },
  { id: "KL", label: "Kochi", cx: "9.9312,76.2673" },
  { id: "HP", label: "Shimla", cx: "31.1048,77.1734" },
];

export const fmt = (n, decimals = 1) => {
  if (n >= 1e9) return (n / 1e9).toFixed(decimals) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(decimals) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(decimals) + "K";
  return n.toFixed(decimals);
};

const WORKLOAD_INTENSITY = {
  "AI Training": 1.25,
  "Data Processing": 1.0,
  "Web Hosting": 0.85,
  "Storage": 0.5
};

export function simulate(cfg) {
  const { computeMW, coolingType, renewablePC, waterStress, region, customRegionData, workloadType } = cfg;
  let carbonFactor = REGION_CARBON[region] || 0.386;
  if (customRegionData && region === customRegionData.id) {
    carbonFactor = customRegionData.carbon;
  }

  // Normalize cooling type for lookup (frontend constants are CamelCase)
  const normCooling = coolingType.charAt(0).toUpperCase() + coolingType.slice(1);
  const coolingFactor = COOLING_FACTORS[normCooling] || 1.8;
  const workloadMult = WORKLOAD_INTENSITY[workloadType] || 1.0;

  const waterMult = WATER_STRESS_MULT[waterStress] || 1.6;

  // Realized Load
  const activeLoad = computeMW * workloadMult;
  const annualEnergy = activeLoad * coolingFactor * 8760; // MWh/yr
  const waterConsumption = activeLoad * (coolingFactor / 4) * waterMult * 8760; // m³/yr scaled
  const carbon = annualEnergy * carbonFactor * (1 - renewablePC / 100); // tonnes CO₂

  // Logical Sustainability Score (Advanced Normalization)
  const pue = coolingFactor; // In this simple model coolingFactor maps to PUE-like impact
  const energyScore = Math.max(0, Math.min(100, 100 * (2.0 - (1 + coolingFactor / 10))));
  const waterScore = waterStress === "Low" ? 90 : waterStress === "Medium" ? 55 : 20;
  const carbonScore = Math.max(0, Math.min(100, 100 * (1.0 - (carbon / (annualEnergy * 1.2)))));

  const score = Math.round((energyScore * 0.3 + waterScore * 0.35 + carbonScore * 0.35));

  return { annualEnergy, waterConsumption, carbon, score };
}

export function projectFuture(base, years = 5, growthRate = 0.2) {
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

// Precise lookup table for Indian States
const INDIA_STATE_DATA = {
  "Maharashtra": { climate: "Tropical", grid: "Medium-High", carbon: 0.650, water: "High" },
  "Gujarat": { climate: "Arid", grid: "Medium", carbon: 0.550, water: "High" },
  "Rajasthan": { climate: "Arid", grid: "Medium", carbon: 0.520, water: "High" },
  "Tamil Nadu": { climate: "Tropical", grid: "Low-Medium", carbon: 0.450, water: "Medium" },
  "Karnataka": { climate: "Tropical", grid: "Low", carbon: 0.350, water: "Medium" },
  "Kerala": { climate: "Tropical", grid: "Very Low", carbon: 0.250, water: "Low" },
  "Andhra Pradesh": { climate: "Tropical", grid: "Medium", carbon: 0.580, water: "Medium" },
  "Telangana": { climate: "Tropical", grid: "Medium-High", carbon: 0.620, water: "High" },
  "Uttar Pradesh": { climate: "Subtropical", grid: "High", carbon: 0.750, water: "High" },
  "Madhya Pradesh": { climate: "Tropical", grid: "High", carbon: 0.720, water: "High" },
  "West Bengal": { climate: "Tropical", grid: "High", carbon: 0.780, water: "Medium" },
  "Odisha": { climate: "Tropical", grid: "High", carbon: 0.820, water: "Medium" },
  "Punjab": { climate: "Subtropical", grid: "Medium-High", carbon: 0.610, water: "High" },
  "Haryana": { climate: "Subtropical", grid: "Medium-High", carbon: 0.630, water: "High" },
  "Himachal Pradesh": { climate: "Cold", grid: "Very Low", carbon: 0.150, water: "Low" },
  "Uttarakhand": { climate: "Cold", grid: "Very Low", carbon: 0.180, water: "Low" },
  "Delhi": { climate: "Subtropical", grid: "Medium-High", carbon: 0.680, water: "High" },
  "Assam": { climate: "Tropical", grid: "Medium", carbon: 0.450, water: "Low" },
  "Jharkhand": { climate: "Tropical", grid: "High", carbon: 0.850, water: "Medium" },
  "Chhattisgarh": { climate: "Tropical", grid: "High", carbon: 0.840, water: "Medium" },
  "Bihar": { climate: "Subtropical", grid: "High", carbon: 0.700, water: "Medium" },
  "Jammu and Kashmir": { climate: "Cold", grid: "Low", carbon: 0.200, water: "Low" }
};

export const fetchLocationData = async (lat, lng) => {
  return new Promise(async (resolve, reject) => {
    let locName = `Point (${lat.toFixed(1)}°, ${lng.toFixed(1)}°)`;
    let stateName = null;

    try {
      // Use higher zoom level (10) to reliably get city & state
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2&zoom=10`, {
        headers: { 'Accept-Language': 'en' }
      });
      if (resp.ok) {
        const data = await resp.json();

        // Ocean or unspecified area handler
        if (data.error) {
          return reject(new Error("Oceanic or invalid location. Please select a valid land region in India."));
        }

        if (data && data.address) {
          const addr = data.address;
          if (!addr.country_code || addr.country_code.toLowerCase() !== 'in') {
            return reject(new Error("Analysis restricts strictly to India regions. Please select a location in India."));
          }

          stateName = addr.state;
          const localName = addr.city || addr.town || addr.village || addr.county || data.name;

          if (localName && stateName) {
            locName = `${localName}, ${stateName}`;
          } else {
            locName = stateName || localName || locName;
          }

          if (data.lat && data.lon) {
            lat = parseFloat(data.lat);
            lng = parseFloat(data.lon);
          }
        } else {
          return reject(new Error("Failed to map the selected terrain accurately within India."));
        }
      } else {
        return reject(new Error("Mapping API network issue."));
      }
    } catch (err) {
      console.warn("Geocoding failed", err);
      return reject(new Error("Failed to connect to location services."));
    }

    const stats = (stateName && INDIA_STATE_DATA[stateName]) ? INDIA_STATE_DATA[stateName] : {
      climate: "Tropical",
      grid: "Medium",
      carbon: 0.550,
      water: "Medium"
    };

    setTimeout(() => {
      resolve({
        id: `custom-${lat.toFixed(4)}-${lng.toFixed(4)}`,
        name: locName,
        climate: stats.climate,
        grid: stats.grid,
        carbon: parseFloat(stats.carbon.toFixed(3)),
        waterStress: stats.water,
        lat,
        lng
      });
    }, 200);
  });
};
