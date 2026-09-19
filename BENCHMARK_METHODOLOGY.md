# BENCHMARK METHODOLOGY

## Controller Comparison Protocols

To evaluate signal timing performance without bias, the platform evaluates three distinct control strategies under identical baseline traffic scenarios:

1. **Fixed-Time Controller**: Static 30-second round-robin green signal allocation across all intersections.
2. **Adaptive Rule-Based Controller**: Dynamic threshold adjustment based on queue length ($g = 20s$ for $q \le 20m$, $g = 30s$ for $20m < q \le 40m$, $g = 45s$ for $q > 40m$).
3. **Hybrid Quantum-Classical (QUBO / QAOA) Controller**: Global optimization of green durations minimizing total corridor delay and inter-intersection bottleneck penalties.

---

## Environmental & Travel Formulas

- **Fuel Consumption Estimate**:
  $$\text{Fuel (Liters)} = \left( \frac{\text{Total Idle Wait Time (sec)}}{3600} \times 0.60 \text{ L/hr} \right) + \left( \text{Total Distance (km)} \times 0.08 \text{ L/km} \right)$$
- **Carbon Dioxide (CO2) Estimate**:
  $$\text{CO2 (kg)} = \text{Fuel (Liters)} \times 2.31 \text{ kg CO2/L}$$
