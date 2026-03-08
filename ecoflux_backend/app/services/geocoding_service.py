import httpx

async def get_coordinates(location: str):

    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": location,
        "format": "json",
        "limit": 1,
        "addressdetails": 1
    }

    headers = {
        "User-Agent": "EcoFlux/1.0 (contact@ecoflux.example)"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, headers=headers)

    data = response.json()

    if not data:
        raise ValueError("Location not found")

    lat = float(data[0]["lat"])
    lon = float(data[0]["lon"])
    country_code = data[0].get("address", {}).get("country_code", "unknown").upper()

    return lat, lon, country_code
