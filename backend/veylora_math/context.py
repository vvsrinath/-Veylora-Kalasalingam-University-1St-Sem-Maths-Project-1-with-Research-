"""Contextual adjustment factors for the Veylora consumption model.

The base curve F(v) = a*v**2 + b*v + c is seeded for a vehicle in neutral
conditions. Real-world trips add context. Every factor is applied as a small,
transparent multiplicative delta so the math stays explainable:

    F_ctx(v) = F(v) * phi_context
    phi_context = prod(1 + delta_i)

Deltas are deliberately conservative estimates intended for education and
recommendations, NOT calibrated measurements.
"""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Dict, Optional


@dataclass
class ContextInputs:
    """Context captured with a trip. All fields optional = treated as neutral."""

    traffic: Optional[str] = None            # 'light' | 'moderate' | 'heavy'
    road_condition: Optional[str] = None     # 'good' | 'fair' | 'poor'
    extra_load_kg: Optional[float] = None
    ac_used: Optional[bool] = None
    temperature_c: Optional[float] = None
    wind_kmh: Optional[float] = None
    aqi: Optional[int] = None
    climb_m: Optional[float] = None
    distance_km: Optional[float] = None
    tyre_pressure: Optional[str] = None      # 'good' | 'fair' | 'poor'

    def to_dict(self) -> Dict:
        return {k: v for k, v in asdict(self).items() if v is not None}


@dataclass
class ContextResult:
    deltas: Dict[str, float] = field(default_factory=dict)
    total_pct: float = 0.0

    def to_dict(self) -> Dict:
        return {"deltas": self.deltas, "total_pct": self.total_pct}


def _pct(delta: float) -> float:
    return round(delta * 100.0, 1)


def context_deltas(ctx: ContextInputs) -> Dict[str, float]:
    """Return per-factor percentage deltas (fractions of 1.0)."""
    deltas: Dict[str, float] = {}
    t = ctx.temperature_c
    if t is not None:
        if t < 10:
            deltas["cold_start"] = round((10 - t) * 0.006, 4)          # richer cold mixture
        elif t > 32:
            deltas["ac_heat_load"] = round((t - 32) * 0.006, 4)        # cabin cooling load

    if ctx.ac_used:
        deltas["ac_use"] = 0.04

    if ctx.wind_kmh:
        deltas["wind"] = round(max(0.0, (ctx.wind_kmh - 15) * 0.004), 4)

    if ctx.aqi is not None and ctx.aqi > 100:
        deltas["air_quality"] = 0.01                                   # recirculation load

    if ctx.traffic == "light":
        deltas["traffic"] = -0.02
    elif ctx.traffic == "moderate":
        deltas["traffic"] = 0.05
    elif ctx.traffic == "heavy":
        deltas["traffic"] = 0.10

    if ctx.road_condition == "fair":
        deltas["road"] = 0.04
    elif ctx.road_condition == "poor":
        deltas["road"] = 0.08

    if ctx.climb_m and ctx.distance_km and ctx.distance_km > 0:
        grade_pct = (ctx.climb_m / 100.0) / ctx.distance_km * 100.0 * 0.30  # simplified
        deltas["grade"] = round(min(0.20, max(0.0, grade_pct * 0.005)), 4)

    if ctx.extra_load_kg:
        deltas["load"] = round((ctx.extra_load_kg / 100.0) * 0.02, 4)

    if ctx.tyre_pressure == "fair":
        deltas["tyre_pressure"] = 0.02
    elif ctx.tyre_pressure == "poor":
        deltas["tyre_pressure"] = 0.04

    return deltas


def compute_context(ctx: ContextInputs) -> ContextResult:
    """Compute phi_context and the total impact percentage."""
    deltas = context_deltas(ctx)
    phi = 1.0
    for d in deltas.values():
        phi *= 1.0 + d
    total_pct = round((phi - 1.0) * 100.0, 1)
    return ContextResult(deltas=deltas, total_pct=total_pct)


def apply_context(consumption_l100km: float, ctx: ContextInputs) -> float:
    """Scale a consumption value by the context deltas."""
    result = compute_context(ctx)
    phi = 1.0
    for d in result.deltas.values():
        phi *= 1.0 + d
    return round(consumption_l100km * phi, 3)


AVAILABLE_FACTORS = [
    "cold_start",
    "ac_heat_load",
    "ac_use",
    "wind",
    "air_quality",
    "traffic",
    "road",
    "grade",
    "load",
    "tyre_pressure",
]