import numpy as np
import random
import math
from typing import Tuple, List

class ClassicalQUBOSolver:
    r"""
    Exact & Simulated Annealing Solver for QUBO Problem: min x^T Q x, x \in {0,1}^N
    """
    def __init__(self, Q: np.ndarray):
        self.Q = Q
        self.N = Q.shape[0]

    def energy(self, x: np.ndarray) -> float:
        return float(np.dot(x, np.dot(self.Q, x)))

    def solve_exact_min(self) -> Tuple[List[int], float]:
        """
        Brute force exact evaluation for small N (N <= 22)
        """
        best_x = None
        best_val = float('inf')

        for i in range(1 << self.N):
            bitstring = [(i >> k) & 1 for k in range(self.N)]
            x = np.array(bitstring)
            val = self.energy(x)
            if val < best_val:
                best_val = val
                best_x = bitstring

        return best_x, best_val

    def solve_simulated_annealing(self, steps: int = 5000, initial_temp: float = 100.0) -> Tuple[List[int], float]:
        """
        Quantum-Inspired Simulated Annealing for larger N
        """
        current_x = np.random.randint(0, 2, size=self.N)
        current_energy = self.energy(current_x)

        best_x = current_x.copy()
        best_energy = current_energy

        temp = initial_temp
        cooling_rate = 0.995

        for _ in range(steps):
            # Flip a random bit
            flip_idx = random.randint(0, self.N - 1)
            neighbor_x = current_x.copy()
            neighbor_x[flip_idx] = 1 - neighbor_x[flip_idx]
            neighbor_energy = self.energy(neighbor_x)

            delta = neighbor_energy - current_energy
            if delta < 0 or random.random() < math.exp(-delta / max(temp, 1e-5)):
                current_x = neighbor_x
                current_energy = neighbor_energy
                if current_energy < best_energy:
                    best_energy = current_energy
                    best_x = current_x.copy()

            temp *= cooling_rate

        return best_x.tolist(), best_energy
