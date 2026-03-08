from fastapi import APIRouter, HTTPException
from app.schemas.simulation_schema import SimulationRequest

from app.services.geocoding_service import get_coordinates
from app.services.environmental_service import get_environmental_metrics
from app.services.electricity_service import get_renewable_share
from app.services.climate_service import get_climate_info, get_average_temperature
from app.services.water_scarcity_service import get_water_stress, classify_water_availability
from app.services.energy_service import calculate_energy
from app.services.water_service import calculate_water
from app.services.carbon_service import calculate_carbon
from app.services.sustainability_service import sustainability_score
from app.services.strategy_service import recommend
from app.repositories.simulation_repo import save_user_input, save_simulation_result, save_cooling_comparisons

router = APIRouter()


@router.post("/simulate")
async def simulate(data: SimulationRequest):

    # ── 1. Geocoding & Region Detection ─────────────────────────────────
    try:
        lat, lon, country_code = await get_coordinates(data.location)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Localization error: {str(e)}")

    # ── 2. Environment & Climate Data ───────────────────────────────────
    try:
        avg_temp = await get_average_temperature(lat, lon)
    except Exception as e:
        print(f"NASA API Error: {e}")
        avg_temp = 15.0 

    try:
        water_stress = await get_water_stress(lat, lon, country_code)
        scarcity = classify_water_availability(water_stress)
    except Exception as e:
        print(f"Water Stress API Error: {e}")
        water_stress = 0.5
        scarcity = "medium"

    # Fetch dynamic renewable share and carbon intensity
    metrics = get_environmental_metrics(country_code)
    try:
        renewable_p = await get_renewable_share(lat, lon, country_code)
    except Exception as e:
        print(f"Electricity API Error: {e}")
        renewable_p = metrics["renewable"]
    
    grid_factor = metrics.get("carbon_intensity", 0.72)

    # ── 3. Run simulation models (Auto-detected metrics) ───────────────
    climate_info = get_climate_info(avg_temp)
    
    energy   = calculate_energy(data.compute_load_mw, data.cooling_method, data.workload_type)
    water    = calculate_water(data.compute_load_mw, data.cooling_method, climate_info["multiplier"], data.workload_type)
    
    carbon   = calculate_carbon(energy, renewable_p, grid_factor)
    score    = sustainability_score(energy, water, carbon, data.compute_load_mw, scarcity)
    
    reco_data = recommend(
        data.compute_load_mw, 
        renewable_p, 
        climate_info["multiplier"],
        data.electricity_price_kwh,
        scarcity,
        data.workload_type,
        grid_factor
    )

    # ── 4. Save user input → user_inputs table ────────────────────────────
    try:
        input_id = await save_user_input({
            "location":          data.location,
            "latitude":          lat,
            "longitude":         lon,
            "compute_load_mw":   data.compute_load_mw,
            "cooling_method":    data.cooling_method,
            "renewable_percent": renewable_p,
            "water_availability": scarcity,
            "workload_type":     data.workload_type,
        })
    except Exception as e:
        print(f"DB Error (User Input): {e}")
        input_id = 0

    # ── 5. Save results → simulation_results table ────────────────────────
    try:
        result_id = await save_simulation_result({
            "input_id":              input_id,
            "temperature":           avg_temp,
            "climate_label":         climate_info["label"],
            "climate_multiplier":    climate_info["multiplier"],
            "renewable_share_percent": renewable_p,
            "water_stress_index":    water_stress,
            "energy_usage":          energy,
            "water_usage":           water,
            "carbon_emission":       carbon,
            "sustainability_score":  score,
            "recommended_strategy":  reco_data["strategy_string"],
            "recommended_cooling":   reco_data["best_method"],
        })
    except Exception as e:
        print(f"DB Error (Result): {e}")
        result_id = None

    # ── 6. Save Comparison Details → cooling_comparisons table ───────────
    if result_id:
        try:
            comparisons_to_save = []
            for item in reco_data["comparison_table"]:
                comparisons_to_save.append({
                    "simulation_id":         result_id,
                    "cooling_method":        item["cooling_method"],
                    "energy_usage":          item["energy_usage_mw"],
                    "water_usage":           item["water_usage"],
                    "carbon_emission":       item["carbon_emission"],
                    "sustainability_score":  item["sustainability_score"],
                    "total_cost_usd":        item["total_cost_usd"],
                    "cost_efficiency_score": item["cost_efficiency_score"],
                    "final_decision_score":  item["final_decision_score"]
                })
            await save_cooling_comparisons(comparisons_to_save)
        except Exception as e:
            print(f"DB Error (Comparisons): {e}")

    # ── 7. Return full response in requested format ───────────────────────
    return {
        "location": data.location,
        "environmental_metrics": {
            "renewable_share_percent": renewable_p,
            "water": {
                "water_stress_index": water_stress,
                "water_availability": scarcity
            }
        },
        "coordinates": {
            "latitude": lat,
            "longitude": lon
        },
        "climate": {
            "temperature_c": avg_temp,
            "climate_label": climate_info["label"],
            "climate_multiplier": climate_info["multiplier"]
        },
        "energy_usage_mw": round(energy, 2),
        "water_usage_index": round(water, 2),
        "carbon_emission_index": round(carbon, 2),
        "sustainability_score": score,
        "recommended_strategy": reco_data["strategy_string"],
        "recommended_cooling": reco_data["best_method"],
        "comparison_table": reco_data["comparison_table"]
    }
