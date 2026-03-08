water_factor = {
    "air": 0,
    "air cooling": 0,
    "evaporative": 1,
    "evaporative cooling": 1,
    "liquid": 0.2,
    "liquid cooling": 0.2,
    "immersion": 0.05,
    "immersion cooling": 0.05
}

workload_intensity = {
    "ai training": 1.25,
    "data processing": 1.0,
    "web hosting": 0.85,
    "storage": 0.5
}

def calculate_water(load, cooling, climate_mult, workload="data processing"):
    c_factor = water_factor.get(cooling.lower(), 0.2)
    w_factor = workload_intensity.get(workload.lower(), 1.0)

    return load * w_factor * c_factor * climate_mult
