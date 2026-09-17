"""Symbolic calculus for the Veylora fuel-consumption model.

The fuel consumption curve is modelled as a quadratic function of speed:

    F(v) = a*v**2 + b*v + c      [L/100km]

All mathematics is done with SymPy so the printed derivation always matches
the numbers we ship to the application.
"""
from typing import Dict, List, Tuple

import sympy as sp


def _symbols():
    v, a, b, c = sp.symbols("v a b c", real=True, positive=True)
    return v, a, b, c


def fuel_consumption(v: sp.Symbol, a: sp.Symbol, b: sp.Symbol, c: sp.Symbol) -> sp.Expr:
    """F(v) = a*v**2 + b*v + c."""
    return a * v**2 + b * v + c


def first_derivative(v: sp.Symbol, a: sp.Symbol, b: sp.Symbol, c: sp.Symbol) -> sp.Expr:
    """F'(v) = 2*a*v + b."""
    return sp.diff(fuel_consumption(v, a, b, c), v)


def second_derivative(v: sp.Symbol, a: sp.Symbol, b: sp.Symbol, c: sp.Symbol) -> sp.Expr:
    """F''(v) = 2*a."""
    return sp.diff(fuel_consumption(v, a, b, c), v, 2)


def optimal_speed(a: float, b: float) -> float:
    """v* = -b / (2*a), the speed where F'(v) = 0 (stationary point)."""
    if a <= 0:
        return 0.0
    return -b / (2 * a)


def clamp_to_legal(speed_kmh: float, legal_limit_kmh: float) -> float:
    """The theoretical optimum must respect the legal speed limit."""
    if speed_kmh <= 0:
        return 0.0
    return min(speed_kmh, max(legal_limit_kmh, 0.0))


def build_curve_points(a: float, b: float, c: float, min_v: float = 10.0, max_v: float = 120.0, step: float = 5.0) -> List[Dict[str, float]]:
    """Sample the curve for charts."""
    return [
        {"v_kmh": v, "consumption_l100km": round(a * v * v + b * v + c, 2)}
        for v in [min_v + i * step for i in range(int((max_v - min_v) / step) + 1)]
    ]


def derive_optimization(a: float, b: float, c: float, legal_limit_kmh: float | None = None) -> Dict:
    """Produce the full symbolic derivation, plus numeric values."""
    v, av, bv, cv = _symbols()
    if a <= 0:
        raise ValueError("a must be positive for a minimum to exist")

    f_expr = fuel_consumption(v, av, bv, cv)
    f1_expr = first_derivative(v, av, bv, cv)
    f2_expr = second_derivative(v, av, bv, cv)

    v_opt_raw = optimal_speed(a, b)
    v_opt = clamp_to_legal(v_opt_raw, legal_limit_kmh) if legal_limit_kmh is not None else v_opt_raw
    min_consumption = a * v_opt_raw**2 + b * v_opt_raw + c

    return {
        "function": sp.pretty(f_expr),
        "first_derivative": sp.pretty(f1_expr),
        "second_derivative": sp.pretty(f2_expr),
        "stationary_point": "v = -b / (2*a)",
        "optimal_speed_kmh": round(v_opt, 2),
        "actual_optimal_speed_kmh": round(v_opt_raw, 2),
        "legal_limit_kmh": legal_limit_kmh,
        "min_consumption_l100km": round(float(min_consumption), 4),
        "second_derivative_positive": bool(2 * a > 0),
        "coefficients": {"a": a, "b": b, "c": c},
        "curve_points": build_curve_points(a, b, c),
    }


def expected_fuel_used_l(distance_km: float, mileage_km_per_l: float) -> float:
    """Baseline fuel for a distance at a given mileage (for CO2 savings)."""
    if mileage_km_per_l <= 0:
        return 0.0
    return distance_km / mileage_km_per_l


def quadratic_from_three_points(p1: Tuple[float, float], p2: Tuple[float, float], p3: Tuple[float, float]) -> Tuple[float, float, float]:
    """Analytic quadratic fit through three (v, consumption) points (a, b, c)."""
    x1, y1 = p1
    x2, y2 = p2
    x3, y3 = p3
    det = (x1 - x2) * (x1 - x3) * (x2 - x3)
    if abs(det) < 1e-12:
        raise ValueError("points must have distinct speeds")
    a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / det
    b = (x3**2 * (y1 - y2) + x2**2 * (y3 - y1) + x1**2 * (y2 - y3)) / det
    c = (x2 * x3 * y1 * (x2 - x3) + x3 * x1 * y2 * (x3 - x1) + x1 * x2 * y3 * (x1 - x2)) / det
    return float(a), float(b), float(c)