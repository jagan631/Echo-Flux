from app.database.supabase_client import supabase_insert


async def save_user_input(data: dict) -> str:
    """Insert user input into user_inputs table and return the generated uuid."""
    row = await supabase_insert("user_inputs", data)
    return row["id"]


async def save_simulation_result(result: dict) -> str:
    """Insert simulation results and return the generated id."""
    row = await supabase_insert("simulation_results", result)
    return row["id"]


async def save_cooling_comparisons(comparisons: list) -> None:
    """Bulk insert comparison table rows into cooling_comparisons."""
    # Since our lightweight client's supabase_insert handles dicts,
    # we can call it in a loop or update the client for bulk.
    # For reliability with the current client, we'll loop.
    for item in comparisons:
        await supabase_insert("cooling_comparisons", item)
