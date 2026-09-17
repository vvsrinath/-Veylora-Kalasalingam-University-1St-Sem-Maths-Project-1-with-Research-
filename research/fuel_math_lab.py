import numpy as np
import sympy as sp
import matplotlib.pyplot as plt


# --------------------------------------------------
# 1. Define the variable and fuel-consumption function
# --------------------------------------------------

v = sp.symbols('v', real=True)

# Illustrative fuel-consumption function
F = 0.002 * v**2 - 0.24 * v + 15

print("Fuel-consumption function:")
print("F(v) =", F)


# --------------------------------------------------
# 2. First derivative
# --------------------------------------------------

first_derivative = sp.diff(F, v)

print("\nFirst derivative:")
print("F'(v) =", first_derivative)


# --------------------------------------------------
# 3. Find the critical point
# --------------------------------------------------

critical_points = sp.solve(sp.Eq(first_derivative, 0), v)

print("\nCritical point(s):")
print(critical_points)

# Select the first critical point
critical_speed = float(critical_points[0])


# --------------------------------------------------
# 4. Second derivative
# --------------------------------------------------

second_derivative = sp.diff(first_derivative, v)

print("\nSecond derivative:")
print("F''(v) =", second_derivative)

second_derivative_value = float(
    second_derivative.subs(v, critical_speed)
)

if second_derivative_value > 0:
    result = "Minimum"
elif second_derivative_value < 0:
    result = "Maximum"
else:
    result = "Inconclusive"

print("\nSecond derivative value:", second_derivative_value)
print("Critical point classification:", result)


# --------------------------------------------------
# 5. Calculate minimum fuel consumption
# --------------------------------------------------

minimum_consumption = float(F.subs(v, critical_speed))

print("\nOptimal speed:", critical_speed, "km/h")
print("Minimum modelled consumption:", minimum_consumption)


# --------------------------------------------------
# 6. Convert SymPy expressions into numerical functions
# --------------------------------------------------

fuel_function = sp.lambdify(v, F, "numpy")
derivative_function = sp.lambdify(v, first_derivative, "numpy")

# Speed range
speeds = np.linspace(0, 120, 500)

# Calculate values
fuel_values = fuel_function(speeds)
derivative_values = derivative_function(speeds)


# --------------------------------------------------
# 7. Visualization
# --------------------------------------------------

plt.figure(figsize=(10, 6))

plt.plot(
    speeds,
    fuel_values,
    label="Fuel Consumption Function"
)

plt.scatter(
    critical_speed,
    minimum_consumption,
    s=100,
    label="Minimum Point"
)

plt.axvline(
    critical_speed,
    linestyle="--",
    label=f"Optimal Speed = {critical_speed:.2f} km/h"
)

plt.xlabel("Vehicle Speed (km/h)")
plt.ylabel("Fuel Consumption")
plt.title("Fuel Consumption as a Function of Speed")
plt.grid(True)
plt.legend()
plt.show()


# --------------------------------------------------
# 8. First derivative visualization
# --------------------------------------------------

plt.figure(figsize=(10, 6))

plt.plot(
    speeds,
    derivative_values,
    label="First Derivative F'(v)"
)

plt.axhline(
    0,
    linestyle="--",
    label="F'(v) = 0"
)

plt.scatter(
    critical_speed,
    0,
    s=100,
    label="Critical Point"
)

plt.xlabel("Vehicle Speed (km/h)")
plt.ylabel("Rate of Change of Fuel Consumption")
plt.title("First Derivative of Fuel Consumption")
plt.grid(True)
plt.legend()
plt.show()


# --------------------------------------------------
# 9. Second derivative visualization
# --------------------------------------------------

second_derivative_values = np.full_like(
    speeds,
    second_derivative_value
)

plt.figure(figsize=(10, 6))

plt.plot(
    speeds,
    second_derivative_values,
    label="Second Derivative F''(v)"
)

plt.axhline(
    0,
    linestyle="--",
    label="Zero Reference"
)

plt.xlabel("Vehicle Speed (km/h)")
plt.ylabel("Second Derivative")
plt.title("Second Derivative Test")
plt.grid(True)
plt.legend()
plt.show()
