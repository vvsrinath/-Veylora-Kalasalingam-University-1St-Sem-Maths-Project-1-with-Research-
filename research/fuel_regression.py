import numpy as np
import matplotlib.pyplot as plt
import sympy as sp


# -----------------------------------------
# 1. Sample experimental data
# -----------------------------------------

speed_data = np.array([20, 30, 40, 50, 60, 70, 80, 90, 100])

fuel_data = np.array([
    11.8, 10.2, 9.0, 8.1, 7.8,
    8.1, 9.0, 10.2, 11.8
])


# -----------------------------------------
# 2. Fit a quadratic model
# -----------------------------------------

coefficients = np.polyfit(speed_data, fuel_data, 2)

a, b, c = coefficients

print("Fitted quadratic function:")
print(f"F(v) = {a:.6f}v² + {b:.6f}v + {c:.6f}")


# -----------------------------------------
# 3. Calculate optimal speed
# -----------------------------------------

optimal_speed = -b / (2 * a)

# Calculate minimum fuel consumption
minimum_fuel = a * optimal_speed**2 + b * optimal_speed + c

# Second derivative
second_derivative = 2 * a

print("\nOptimal speed:", round(optimal_speed, 2), "km/h")
print("Minimum fuel consumption:", round(minimum_fuel, 2))
print("Second derivative:", round(second_derivative, 6))

if second_derivative > 0:
    print("Result: Minimum point")
elif second_derivative < 0:
    print("Result: Maximum point")
else:
    print("Result: Inconclusive")


# -----------------------------------------
# 4. Generate fitted curve
# -----------------------------------------

speed_range = np.linspace(
    min(speed_data),
    max(speed_data),
    500
)

fitted_values = (
    a * speed_range**2
    + b * speed_range
    + c
)


# -----------------------------------------
# 5. Plot data and fitted curve
# -----------------------------------------

plt.figure(figsize=(10, 6))

plt.scatter(
    speed_data,
    fuel_data,
    label="Observed/Sample Data"
)

plt.plot(
    speed_range,
    fitted_values,
    label="Quadratic Fitted Model"
)

plt.scatter(
    optimal_speed,
    minimum_fuel,
    s=120,
    label="Predicted Minimum"
)

plt.axvline(
    optimal_speed,
    linestyle="--",
    label=f"Optimal Speed = {optimal_speed:.2f} km/h"
)

plt.xlabel("Vehicle Speed (km/h)")
plt.ylabel("Fuel Consumption")
plt.title("Quadratic Regression of Automobile Fuel Consumption")
plt.grid(True)
plt.legend()
plt.show()
