INFRA_COST_FACTOR = {
    "air": 1.0,
    "evaporative": 1.3,
    "liquid": 1.8,
    "immersion": 2.5
}

# Base CAPEX price per relative unit
BASE_INFRA_PRICE = 2000.0

def calculate_cooling_cost(energy_mw, cooling_method, electricity_price):
    """
    Calculates total operational (energy) + infrastructure cost.
    """
    # Energy cost: MW -> kW (* 1000) then * price
    energy_cost = energy_mw * 1000 * electricity_price
    
    # Infrastructure cost
    infra_cost = INFRA_COST_FACTOR.get(cooling_method, 1.0) * BASE_INFRA_PRICE
    
    total_cost = energy_cost + infra_cost
    
    return {
        "energy_cost": round(energy_cost, 2),
        "infra_cost": round(infra_cost, 2),
        "total_cost": round(total_cost, 2)
    }
