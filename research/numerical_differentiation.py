import numpy as np
import matplotlib.pyplot as plt


speed = np.array([20, 30, 40, 50, 60, 70, 80, 90, 100])

fuel = np.array([
    11.8, 10.2, 9.0, 8.1, 7.8,
    8.1, 9.0, 10.2, 11.8
])


# First numerical derivative
first_derivative = np.gradient(fuel, speed)

# Second numerical derivative
second_derivative = np.gradient(first_derivative, speed)

# Find the location of the smallest fuel value
minimum_index = np.argmin(fuel)

print("Approximate minimum speed:",
      speed[minimum_index], "km/h")

print("Minimum measured fuel value:",
      fuel[minimum_index])


# Plot fuel data
plt.figure(figsize=(10, 6))
plt.plot(speed, fuel, marker="o")
plt.scatter(
    speed[minimum_index],
    fuel[minimum_index],
    s=100
)
plt.xlabel("Speed (km/h)")
plt.ylabel("Fuel Consumption")
plt.title("Measured Fuel Consumption")
plt.grid(True)
plt.show()


# Plot first derivative
plt.figure(figsize=(10, 6))
plt.plot(speed, first_derivative, marker="o")
plt.axhline(0, linestyle="--")
plt.xlabel("Speed (km/h)")
plt.ylabel("Approximate First Derivative")
plt.title("Numerical First Derivative")
plt.grid(True)
plt.show()


# Plot second derivative
plt.figure(figsize=(10, 6))
plt.plot(speed, second_derivative, marker="o")
plt.axhline(0, linestyle="--")
plt.xlabel("Speed (km/h)")
plt.ylabel("Approximate Second Derivative")
plt.title("Numerical Second Derivative")
plt.grid(True)
plt.show()
