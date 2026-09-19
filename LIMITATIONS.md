# SYSTEM LIMITATIONS & SCOPE DISCLOSURES

1. **Hardware Control Disclaimer**: This platform is a research, digital twin, and prototype traffic control system. It does NOT directly send physical electrical control signals to real-world municipal traffic hardware in Chennai.
2. **Data Availability Limitations**: Public traffic datasets for Chennai provide vehicle trajectories, position, speed, and road geometry, but do NOT contain real-time physical signal light phase recordings or live pedestrian push-button press logs. Where fields are missing, they are clearly labeled as `CONFIGURED_BASELINE` or `NULL`.
3. **Quantum Simulator Scope**: Quantum optimization circuits are executed via Qiskit Aer local simulators or exact Quantum-Inspired Simulated Annealing on local CPU hardware rather than physical NISQ quantum hardware backends.
4. **Corridor MVP Bounds**: The active optimization scope covers the 6-intersection corridor (Anna Salai, Kathipara Junction, Guindy, Saidapet, Nandanam, T. Nagar, Gemini Flyover). The adapter architecture supports scaling to larger city networks.
