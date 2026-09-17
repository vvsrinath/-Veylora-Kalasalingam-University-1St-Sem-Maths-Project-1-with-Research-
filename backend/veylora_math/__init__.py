"""Veylora math engine.

A free, self-contained Python package that performs the calculus behind
Veylora's fuel-consumption optimization:

  F(v)   = a*v**2 + b*v + c      (consumption in L/100km vs speed)
  F'(v)  = 2*a*v + b
  v*     = -b / (2*a)             (stationary point)
  F''(v) = 2*a > 0                (confirms a local minimum)

The derivation is done symbolically with SymPy so the mathematics cannot
drift from the implementation. Context factors (grade, temperature, wind,
traffic, road condition, load, air quality, AC use, tyre pressure) are
applied as transparent multiplicative deltas on the consumption curve.
"""

from .calculus import (
    fuel_consumption,
    first_derivative,
    optimal_speed,
    second_derivative,
    derive_optimization,
    clamp_to_legal,
    build_curve_points,
)
from .context import (
    ContextInputs,
    ContextResult,
    compute_context,  # kept as alias for compatibility
    context_deltas,
)
from .fit import fit_quadratic, fit_quadratic_from_trips, model_metrics, TripPoint
from .engine import build_standard_model, generate_model_json, BASE_COEFFICIENTS

__all__ = [
    "fuel_consumption",
    "first_derivative",
    "optimal_speed",
    "second_derivative",
    "derive_optimization",
    "clamp_to_legal",
    "build_curve_points",
    "ContextInputs",
    "ContextResult",
    "compute_context",
    "context_deltas",
    "fit_quadratic",
    "fit_quadratic_from_trips",
    "model_metrics",
    "TripPoint",
    "build_standard_model",
    "generate_model_json",
    "BASE_COEFFICIENTS",
]

__version__ = "0.2.0"