def sustainability_score(energy, water, carbon, load, water_scarcity="medium"):
    """
    Advanced Sustainability Scoring (v2.2)
    Highlights:
    - Balanced 0-100 index
    - Dynamic weights based on resource scarcity
    - Accurate PUE and Water Intensity normalization
    """
    if not load or load <= 0:
        return 0

    # 1. Energy Score (PUE-based)
    # Perfect PUE 1.0 -> 100. Excessive PUE 2.0 -> 0.
    pue = energy / load
    energy_score = max(0, min(100, 100 * (2.0 - pue)))

    # 2. Water Score (Intensity-based)
    # Perfect 0 L/kWh -> 100. Bad 1.2 L/kWh -> 0.
    water_intensity = water / load
    water_score = max(0, min(100, 100 * (1.2 - water_intensity) / 1.2 * 100))

    # 3. Carbon Score (Relative to "Dirty Grid" Baseline)
    # Baseline: 0.72 kg/kWh (standard grid) at PUE 1.5
    # Actual emissions compared to this "worst-reasonable-case" infrastructure.
    grid_baseline = load * 1.5 * 0.72 
    carbon_score = max(0, min(100, 100 * (1.0 - (carbon / grid_baseline))))

    # Dynamic Weighting Logic
    # ws = scarcity level
    SCARCITY_WEIGHTS = {
        "critical": {"w": 0.60, "c": 0.25, "e": 0.15},
        "low":      {"w": 0.45, "c": 0.35, "e": 0.20},
        "medium":   {"w": 0.30, "c": 0.40, "e": 0.30},
        "moderate": {"w": 0.15, "c": 0.50, "e": 0.35},
        "high":     {"w": 0.05, "c": 0.55, "e": 0.40}
    }
    
    ws = water_scarcity.lower() if isinstance(water_scarcity, str) else "medium"
    w = SCARCITY_WEIGHTS.get(ws, SCARCITY_WEIGHTS["medium"])
    
    score = (
        w["w"] * water_score +
        w["c"] * carbon_score +
        w["e"] * energy_score
    )

    return round(max(0, min(100, score)), 2)
