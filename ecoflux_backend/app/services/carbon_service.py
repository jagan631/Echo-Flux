# Regional Grid Carbon Factors (kg CO2 / kWh)
# Baseline lookup if dynamic data is unavailable
REGION_CARBON_FACTORS = {
    "IN": 0.72,  # India Average
    "US": 0.45,  # USA
    "NO": 0.05,  # Norway (Hydropower heavy)
    "DE": 0.38,  # Germany
    "AE": 0.55,  # UAE
}

def calculate_carbon(energy, renewable, grid_intensity=0.72):
    """
    Calculates carbon emissions in Tonnes/hr.
    energy: MW
    renewable: %
    grid_intensity: kg/kWh
    """
    # Grid energy used (MW)
    grid_energy = energy * (1 - renewable / 100)
    
    # 1 MW * 1 hr = 1000 kWh
    # 1000 kWh * intensity (kg/kWh) = kg emissions
    # kg / 1000 = Tonnes
    # Result: MW * intensity = Tonnes/hr
    return grid_energy * grid_intensity
