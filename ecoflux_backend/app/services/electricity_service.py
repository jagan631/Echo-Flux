import httpx
from app.core.config import settings
from app.services.environmental_service import get_environmental_metrics

async def get_renewable_share(lat: float, lon: float, country_code: str):
    """
    Fetches real-time renewable energy share from Electricity Maps API.
    Falls back to static regional data if API key is missing or call fails.
    """
    api_key = settings.ELECTRICITY_MAPS_API_KEY
    
    # Fallback if no API key provided
    if not api_key:
        static_data = get_environmental_metrics(country_code)
        return static_data.get("renewable", 35.0)

    url = "https://api.electricitymap.org/v3/power-breakdown/latest"
    params = {
        "lat": lat,
        "lon": lon
    }
    headers = {
        "auth-token": api_key
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=headers, timeout=5.0)
            
        if response.status_code == 200:
            data = response.json()
            # renewablePercentage is a field in the Electricity Maps power-breakdown response
            return data.get("renewablePercentage", 35.0)
        else:
            print(f"Electricity Maps API Error (Status {response.status_code}): {response.text}")
            # Fallback to static data
            static_data = get_environmental_metrics(country_code)
            return static_data.get("renewable", 35.0)

    except Exception as e:
        print(f"Electricity Maps API Exception: {e}")
        # Fallback to static data
        static_data = get_environmental_metrics(country_code)
        return static_data.get("renewable", 35.0)
