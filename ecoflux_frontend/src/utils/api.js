export const runSimulationBackend = async (config) => {
    const locationStr = config.customRegionData
        ? config.customRegionData.name
        : (config.region || "Bengaluru");

    const payload = {
        location: locationStr,
        compute_load_mw: config.computeMW || 100,
        cooling_method: config.coolingType || "Water",
        workload_type: config.workloadType || "AI Training",
        electricity_price_kwh: 0.07
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/simulate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            throw new Error(`API error: ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Backend integration error:", error);
        throw error;
    }
};
