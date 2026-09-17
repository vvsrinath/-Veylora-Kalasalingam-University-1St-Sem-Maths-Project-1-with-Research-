# Veylora research scripts

Runnable Python versions of the programs embedded in [`../RESEARCH.md`](../RESEARCH.md).

## Requirements

```bash
pip install -r requirements.txt
```

## Scripts

| File | Purpose |
| --- | --- |
| `fuel_math_lab.py` | Symbolic model: `F(v)`, `F'(v)`, `F''(v)`, the critical speed, the minimum value, and three plots. |
| `fuel_regression.py` | Fits a quadratic to sample data with `numpy.polyfit`, reports the optimal speed and minimum, and plots the fit. |
| `numerical_differentiation.py` | Approximates the first and second derivatives from measured data with `numpy.gradient`. |

Each script opens matplotlib windows. When running headless (no display), either use a non-interactive backend or replace `plt.show()` with `plt.savefig(...)`.

The illustrative model used by the first script is:

$$
F(v) = 0.002v^2 - 0.24v + 15 \quad\Rightarrow\quad
F'(v) = 0.004v - 0.24 = 0 \quad\Rightarrow\quad
v = 60 \text{ km/h}, \quad F(60) = 7.8
$$
