from pydantic import BaseModel

from typing import Optional

class SimulationRequest(BaseModel):

    location: str
    compute_load_mw: float
    cooling_method: str
    workload_type: str
    electricity_price_kwh: Optional[float] = 0.07
