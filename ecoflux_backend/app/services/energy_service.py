cooling_efficiency = {
    "air": 1.4,
    "air cooling": 1.4,
    "evaporative": 1.2,
    "evaporative cooling": 1.2,
    "liquid": 1.1,
    "liquid cooling": 1.1,
    "immersion": 1.05,
    "immersion cooling": 1.05
}

workload_intensity = {
    "ai training": 1.25,
    "data processing": 1.0,
    "web hosting": 0.85,
    "storage": 0.5
}

def calculate_energy(load, cooling, workload="data processing"):
    c_factor = cooling_efficiency.get(cooling.lower(), 1.2)
    w_factor = workload_intensity.get(workload.lower(), 1.0)

    # Actual energy = Load * WorkloadIntensity * PUE
    return load * w_factor * c_factor
