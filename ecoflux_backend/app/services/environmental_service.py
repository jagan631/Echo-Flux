# Lookup data for regional environmental metrics
# Renewable Share: % of grid that is renewable
# Water Scarcity: "low", "medium", "high", "extreme"

ENVIRONMENTAL_DATA = {
    "NO": {"renewable": 98.0, "carbon_intensity": 0.05},  # Norway
    "IN": {"renewable": 40.0, "carbon_intensity": 0.72},  # India
    "US": {"renewable": 25.0, "carbon_intensity": 0.45},  # USA
    "DE": {"renewable": 45.0, "carbon_intensity": 0.38},  # Germany
    "AE": {"renewable": 12.0, "carbon_intensity": 0.55},  # UAE
    "GB": {"renewable": 42.0, "carbon_intensity": 0.23},  # UK
    "CA": {"renewable": 65.0, "carbon_intensity": 0.15},  # Canada
    "FR": {"renewable": 25.0, "carbon_intensity": 0.08},  # France
    "BR": {"renewable": 80.0, "carbon_intensity": 0.12},  # Brazil
    "AU": {"renewable": 30.0, "carbon_intensity": 0.61},  # Australia
    "SA": {"renewable": 5.0,  "carbon_intensity": 0.65},  # Saudi Arabia
}

def get_environmental_metrics(country_code: str):
    """
    Returns auto-detected renewable metrics for a country.
    """
    code = country_code.upper()
    data = ENVIRONMENTAL_DATA.get(code, {"renewable": 35.0})
    return data
