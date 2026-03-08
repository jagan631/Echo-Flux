import httpx

async def get_average_temperature(lat: float, lon: float):
    """
    Fetches historical average temperature (2000-2023) from NASA POWER API.
    """
    url = "https://power.larc.nasa.gov/api/temporal/monthly/point"

    params = {
        "parameters": "T2M",
        "latitude": lat,
        "longitude": lon,
        "start": 2000,
        "end": 2023,
        "format": "JSON"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)

    data = response.json()
    
    try:
        # Extract and average all monthly historical values
        temps = data["properties"]["parameter"]["T2M"].values()
        # Filter out invalid/null values if any (NASA uses -999 for missing)
        valid_temps = [t for t in temps if t > -100]
        
        if not valid_temps:
            return 15.0 # Fallback
            
        avg_temp = sum(valid_temps) / len(valid_temps)
        return round(avg_temp, 2)
    except (KeyError, ZeroDivisionError, TypeError):
        return 15.0 # Fallback default

def get_climate_info(temp):

    if temp < 10:
        return {"multiplier": 0.5, "label": "Cold"}

    if 10 <= temp < 25:
        return {"multiplier": 1.0, "label": "Moderate"}

    if 25 <= temp < 35:
        return {"multiplier": 1.5, "label": "Warm"}

    return {"multiplier": 2.0, "label": "Hot"}
