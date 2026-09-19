# OPTIMIZATION MATHEMATICAL FORMULATION

## QUBO Mathematical Formulation

For $N$ signalized intersections, we define candidate green phase durations $t \in \{20, 30, 40\}$ seconds.

Binary decision variable:
$$x_{i, t} \in \{0, 1\}$$
where $x_{i, t} = 1$ if intersection $i$ is assigned green duration $t$, and $0$ otherwise.

### 1. Hard Single-Choice Constraint
Each intersection must be assigned exactly one green duration:
$$\sum_{t \in \{20, 30, 40\}} x_{i, t} = 1, \quad \forall i \in \{1, \dots, N\}$$

Quadratic penalty term incorporated into QUBO objective:
$$H_{\text{penalty}} = P \sum_{i=1}^N \left( \sum_{t} x_{i, t} - 1 \right)^2$$
where penalty weight $P = 500.0$.

### 2. Traffic Queue & Delay Cost Function
$$H_{\text{delay}} = \sum_{i=1}^N \sum_{t} \left[ q_i \cdot (45 - t) + v_i \cdot \frac{40}{t} \right] x_{i, t}$$
where $q_i$ is the derived queue length in meters at intersection $i$, and $v_i$ is the directional traffic volume.

### 3. Inter-Intersection Corridor Coordination
$$H_{\text{coord}} = \sum_{(i, j) \in E} \sum_{t_i, t_j} \alpha \cdot |t_i - t_j| \cdot x_{i, t_i} x_{j, t_j}$$

### Combined QUBO Objective
$$\min_{x \in \{0,1\}^{3N}} x^T Q x = H_{\text{delay}} + H_{\text{coord}} + H_{\text{penalty}}$$

---

## Execution via QAOA & Fallbacks

1. **Qiskit Aer QAOA**: Formulates state vector circuit on Qiskit Aer simulator when available.
2. **Exact Simulated Annealing Fallback**: When QAOA is unavailable or for large $N$, executes exact QUBO energy minimization on the identical matrix $Q$, guaranteeing zero mathematical distortion.
