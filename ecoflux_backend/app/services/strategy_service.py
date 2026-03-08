from app.services.energy_service import calculate_energy
from app.services.water_service import calculate_water
from app.services.carbon_service import calculate_carbon
from app.services.sustainability_service import sustainability_score
from app.services.cost_service import calculate_cooling_cost

methods = ["air", "evaporative", "liquid", "immersion"]

display_names = {
    "air": "Air Cooling",
    "evaporative": "Evaporative Cooling",
    "liquid": "Liquid Cooling",
    "immersion": "Immersion Cooling"
}

strategy_desc = {
    "air": "Air Cooling + Natural Cold Climate Optimization",
    "evaporative": "Evaporative Cooling Strategy",
    "liquid": "Liquid Cooling + Renewable Integration",
    "immersion": "Immersion Cooling + High Density Efficiency"
}

def recommend(load, renewable, climate_multiplier, electricity_price, water_scarcity="medium", workload_type="data processing", grid_intensity=0.72):

    comparison_table = []
    
    # First pass: calculate metrics
    for m in methods:
        e = calculate_energy(load, m, workload_type)
        w = calculate_water(load, m, climate_multiplier, workload_type)
        c = calculate_carbon(e, renewable, grid_intensity)
        sust_score = sustainability_score(e, w, c, load, water_scarcity)
        
        cost_data = calculate_cooling_cost(e, m, electricity_price)

        comparison_table.append({
            "cooling_method": m,
            "display_name": display_names[m],
            "energy_usage_mw": round(e, 2),
            "water_usage": round(w, 2),
            "carbon_emission": round(c, 2),
            "sustainability_score": sust_score,
            "total_cost_usd": cost_data["total_cost"]
        })

    # Second pass: normalize cost to a 0-100 score (higher = cheaper)
    min_cost = min(item["total_cost_usd"] for item in comparison_table)
    
    for item in comparison_table:
        # Cost score = 100 * (min_cost / current_cost)
        # This makes the cheapest option 100, and more expensive ones lower
        cost_score = (min_cost / item["total_cost_usd"]) * 100
        item["cost_efficiency_score"] = round(cost_score, 2)
        
        # Final Score = 50% Sustainability + 50% Cost
        final_score = (0.5 * item["sustainability_score"]) + (0.5 * cost_score)
        item["final_decision_score"] = round(final_score, 2)

    # Find the winner by final_decision_score
    best_item = max(comparison_table, key=lambda x: x["final_decision_score"])
    
    # Generate decision reason
    sust_winner = max(comparison_table, key=lambda x: x["sustainability_score"])
    
    if best_item["cooling_method"] == sust_winner["cooling_method"]:
        reason = f"Excellent balance of sustainability and cost. Both metrics favor {best_item['display_name']}."
    elif best_item["cost_efficiency_score"] > 90:
        reason = f"Lower infrastructure and operational costs in this climate outweigh the efficiency gains of more complex systems."
    else:
        reason = f"Provides a superior sustainability profile for the cost investment compared to other methods."

    return {
        "best_method": best_item["cooling_method"],
        "strategy_string": strategy_desc[best_item["cooling_method"]],
        "decision_reason": reason,
        "comparison_table": comparison_table
    }
