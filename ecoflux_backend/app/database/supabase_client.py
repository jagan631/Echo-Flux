"""
Lightweight Supabase REST client using httpx directly.
Avoids the supabase-py SDK which has Python 3.14 typing compatibility issues.
"""
import httpx
from app.core.config import settings

HEADERS = {
    "apikey": settings.SUPABASE_KEY,
    "Authorization": f"Bearer {settings.SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

BASE_URL = f"{settings.SUPABASE_URL}/rest/v1"


async def supabase_insert(table: str, data: dict) -> dict:
    """Insert a row into a Supabase table and return the inserted row."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/{table}",
            json=data,
            headers=HEADERS,
        )
    response.raise_for_status()
    return response.json()[0]
