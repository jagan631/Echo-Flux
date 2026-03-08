import httpx

async def get_water_stress(lat: float, lon: float, country_code: str = "XX"):
    """
    Fetches water stress index (0.0 - 1.0) with a robust country-level fallback.
    """
    country_defaults = {
        "NO": 0.10,  # Norway (Low stress)
        "IN": 0.75,  # India (High stress)
        "AE": 0.95,  # UAE (Extreme stress)
        "US": 0.45,  # USA (Medium)
        "AU": 0.85,  # Australia (High)
        "SA": 0.98,  # Saudi Arabia (Extreme)
        "GB": 0.25,  # UK (Low/Medium)
    }

    # API Logic
    dataset_id = "eb936279-8800-4b3f-87f5-21d378036ce7"
    url = f"https://api.resourcewatch.org/v1/query/{dataset_id}"
    sql = f"SELECT bws_score FROM baseline WHERE ST_Intersects(the_geom, ST_SetSRID(ST_MakePoint({lon}, {lat}), 4326))"
    params = {"sql": sql}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=5.0)
            
        if response.status_code == 200:
            data = response.json()
            records = data.get("data", [])
            if records and "bws_score" in records[0]:
                return min(1.0, records[0]["bws_score"] / 5.0)
    except Exception:
        pass # Fallthrough to country defaults

    return country_defaults.get(country_code.upper(), 0.5)

def classify_water_availability(stress_index):
    """
    Converts 0-1 stress index to availability levels.
    """
    if stress_index < 0.2:
        return "high"        # Very Low Stress -> High Availability
    elif stress_index < 0.4:
        return "moderate"    # Low Stress -> Moderate Availability
    elif stress_index < 0.6:
        return "medium"      # Medium Stress -> Medium Availability
    elif stress_index < 0.8:
        return "low"         # High Stress -> Low Availability
    else:
        return "critical"    # Extremely High Stress -> Critical availability
