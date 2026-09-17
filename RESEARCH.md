# Veylora — Full Project Research Details

## 1. Project Title

**Optimize the Fuel Consumption in Automobile Using Differentiation**

**Project Name:** Veylora

**Tagline:** Find your most efficient drive.

---

## 2. Abstract

Veylora is a mathematical and software-based project that studies the relationship between automobile speed and fuel consumption. The main purpose is to represent fuel consumption as a mathematical function of speed and use differentiation to determine the speed at which fuel consumption is minimum.

The project uses mathematical concepts such as functions, graphs, first derivatives, critical points, second derivatives, maximum and minimum values, and optimization. A Python program is used to calculate fuel consumption, plot graphs, find the critical speed, and visualize the minimum point.

The initial model focuses on speed as the main variable. Future development can include vehicle weight, fuel type, road gradient, traffic, weather, vehicle age, maintenance condition, acceleration, braking, and driving behaviour.

---

## 3. Problem Statement

Automobile fuel consumption changes according to driving speed and surrounding conditions. Driving too slowly, too quickly, or with frequent speed changes may affect fuel usage.

However, users often do not know the speed at which their vehicle can achieve minimum fuel consumption under specific conditions.

This project attempts to solve the mathematical part of this problem by:

- Representing fuel consumption as a function of speed.
- Studying the graph of the function.
- Applying differentiation.
- Finding the critical point.
- Determining whether the critical point is a maximum or minimum.
- Calculating the speed corresponding to minimum fuel consumption.

---

## 4. Main Objective

The main objective is:

> To model automobile fuel consumption as a function of vehicle speed and apply differentiation to determine the speed corresponding to minimum fuel consumption.

---

## 5. Research Objectives

The project aims to:

- Study the relationship between speed and fuel consumption.
- Create a mathematical fuel-consumption function.
- Plot the function using Python.
- Calculate the first derivative.
- Find the stationary or critical point.
- Use the second derivative test.
- Determine the minimum fuel-consumption value.
- Compare fuel consumption at different speeds.
- Visualize the optimal speed on a graph.
- Build a foundation for future personalized automobile optimization.

---

## 6. Research Questions

- How does fuel consumption change as vehicle speed increases?
- Can fuel consumption be represented using a mathematical function?
- At what speed does the mathematical model predict minimum consumption?
- How can differentiation identify the critical speed?
- How can the second derivative confirm a minimum?
- How can the model be extended for different vehicles and road conditions?

---

## 7. Variables

Let:

- $v$ = vehicle speed in km/h
- $F(v)$ = fuel consumption at speed $v$

For the basic model:

$$
F(v) = av^2 + bv + c
$$

Here:

- $a$, $b$, and $c$ are constants.
- $v$ is the independent variable.
- $F(v)$ is the dependent variable.

The function may represent fuel consumption in:

- Litres per hour, or
- A normalized fuel-consumption index.

For real vehicle data, the unit must be clearly specified.

---

## 8. Mathematical Model

A quadratic function is used as a simple educational model:

$$
F(v) = av^2 + bv + c
$$

Assume:

$$
F(v) = 0.002v^2 - 0.24v + 15
$$

This is an illustrative model. It is not universal for every automobile.

The graph of this function is a parabola. Since the coefficient of $v^2$ is positive, the parabola opens upward and can have a minimum point.

---

## 9. First Differentiation

Given:

$$
F(v) = 0.002v^2 - 0.24v + 15
$$

Differentiate with respect to $v$:

$$
F'(v) = 0.004v - 0.24
$$

At the critical point:

$$
F'(v) = 0
$$

Therefore:

$$
0.004v - 0.24 = 0
$$

$$
0.004v = 0.24
$$

$$
v = 60 \text{ km/h}
$$

The critical speed predicted by this model is:

$$
\boxed{60 \text{ km/h}}
$$

---

## 10. Second Derivative Test

Differentiate the first derivative:

$$
F'(v) = 0.004v - 0.24
$$

Therefore:

$$
F''(v) = 0.004
$$

Since:

$$
F''(v) > 0
$$

the critical point is a minimum.

Thus, the model predicts that fuel consumption is minimum at:

$$
\boxed{60 \text{ km/h}}
$$

---

## 11. Minimum Fuel Consumption

Substitute $v = 60$ into the original function:

$$
F(60) = 0.002(60)^2 - 0.24(60) + 15
$$

$$
F(60) = 7.2 - 14.4 + 15
$$

$$
F(60) = 7.8
$$

Therefore, the model predicts:

- **Optimal speed:** 60 km/h
- **Minimum modelled consumption:** 7.8 units

The exact physical interpretation of the value depends on how the function was fitted to real data.

---

## 12. Maximum and Minimum Concepts

For a function $F(v)$:

### Critical Point

A critical point occurs when:

$$
F'(v) = 0
$$

or when the derivative is undefined.

### Minimum

A point is a local minimum when the function changes from decreasing to increasing. Using the second derivative:

$$
F''(v) > 0
$$

indicates a local minimum.

### Maximum

A point is a local maximum when the function changes from increasing to decreasing. Using the second derivative:

$$
F''(v) < 0
$$

indicates a local maximum.

### Important Project Note

For a realistic fuel-consumption model, the expected useful result is usually a minimum within a valid speed range. The model must not recommend speeds above legal limits or unsafe speeds.

---

## 13. Extended Research Scope

The core model uses speed:

$$
F(v)
$$

The extended model may include additional variables:

$$
F = F(v, m, f, r, g, t, a)
$$

where:

- $v$ = speed
- $m$ = vehicle mass
- $f$ = fuel type
- $r$ = road type
- $g$ = road gradient
- $t$ = traffic and environmental conditions
- $a$ = driving behaviour

Future research can investigate:

- Petrol, diesel, CNG, and blended fuels
- Vehicle weight and engine characteristics
- Vehicle age and maintenance
- City, highway, rural, and hill roads
- Road gradient and elevation
- Traffic density
- Wind, rain, and temperature
- Air-conditioning usage
- Acceleration and braking
- Idling duration
- Speed variation
- Fuel cost and emissions

These factors can later be incorporated through multivariable calculus, regression, numerical methods, or machine learning.

---

## 14. Research Methodology

### Step 1: Data Collection

Collect speed and fuel-consumption data from:

- Controlled experiments
- Vehicle dashboard readings
- Refuelling records
- OBD devices
- Reliable vehicle datasets
- Simulated sample data for the initial demonstration

GPS can measure speed and distance, but it cannot directly measure fuel consumption without additional fuel data.

### Step 2: Data Preparation

Prepare a table containing:

| Speed (km/h) | Fuel Consumption |
| --- | --- |
| 20 | 11.8 |
| 30 | 10.2 |
| 40 | 9.0 |
| 50 | 8.1 |
| 60 | 7.8 |
| 70 | 8.1 |
| 80 | 9.0 |
| 90 | 10.2 |
| 100 | 11.8 |

These values are illustrative.

### Step 3: Mathematical Fitting

Fit a mathematical function to the data. Possible methods:

- Quadratic regression
- Polynomial regression
- Spline interpolation
- Numerical curve fitting

### Step 4: Differentiation

Calculate:

$$
F'(v)
$$

Set:

$$
F'(v) = 0
$$

### Step 5: Minimum Confirmation

Calculate:

$$
F''(v)
$$

If:

$$
F''(v) > 0
$$

the critical point is a minimum.

### Step 6: Visualization

Plot:

- Fuel consumption versus speed
- First derivative versus speed
- Optimal speed marker
- Minimum consumption marker

### Step 7: Interpretation

Explain the optimal speed within the tested speed range and under the assumptions of the model.

---

## 15. Python Math Lab Program

The following program:

- Defines the mathematical function.
- Calculates the first derivative.
- Calculates the second derivative.
- Finds the critical speed.
- Checks whether it is a minimum.
- Calculates minimum consumption.
- Displays three graphs.

```python
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
```

---

## 16. Python Program Using Experimental Data

This version uses sample data and quadratic regression.

```python
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
```

---

## 17. Optional Numerical Differentiation Code

If you have measured data rather than a mathematical formula, numerical differentiation can be used.

```python
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
```

---

## 18. Expected Visualization

The main graph should show:

- Speed on the horizontal axis.
- Fuel consumption on the vertical axis.
- A downward trend before the optimal speed.
- A minimum point at the optimal speed.
- An upward trend after the optimal speed.

The first derivative graph should show:

- Negative values before the minimum.
- Zero at the critical speed.
- Positive values after the minimum.

The second derivative should be positive for an upward-opening quadratic model.

---

## 19. Project Modules

### Module 1: Data Input

- Enter speed values.
- Enter fuel-consumption values.
- Validate numerical inputs.

### Module 2: Mathematical Modelling

- Fit a function to the data.
- Display the equation.
- Calculate model parameters.

### Module 3: Differentiation

- Calculate first derivative.
- Find critical points.
- Calculate second derivative.
- Classify maximum or minimum.

### Module 4: Visualization

- Plot fuel consumption.
- Plot derivative functions.
- Mark the optimal speed.
- Display minimum consumption.

### Module 5: Comparison

Compare different conditions such as:

- Different vehicle types
- Different fuel types
- City and highway conditions
- Different vehicle loads
- Different road gradients

### Module 6: Future Optimization

- Fuel-cost optimization
- Emission estimation
- Maintenance-aware modelling
- Multivariable optimization
- Personalized recommendations

---

## 20. Limitations

The basic model has several limitations:

- It is a simplified mathematical approximation.
- It may not represent every automobile.
- It does not automatically measure fuel usage.
- Traffic and road gradient may change the result.
- Acceleration and braking are not included in the basic equation.
- The model does not replace legal speed limits or safe-driving practices.
- Sample data must be replaced with reliable vehicle-specific data for real-world use.

---

## 21. Future Development

Future versions of Veylora may include:

- Vehicle profile creation.
- Fuel-type comparison.
- Road-gradient analysis.
- Traffic-condition analysis.
- Weather and temperature inputs.
- Maintenance-condition inputs.
- Driving-behaviour analysis.
- GPS-based speed and distance tracking.
- Fuel-cost calculation.
- Emission estimation.
- Multivariable differentiation.
- Machine-learning-based fuel prediction.
- Offline-first Progressive Web App development.
- Interactive reports and trip history.
- Optional OBD-based data collection.

---

## 22. Expected Outcome

At the end of the project, the system should:

- Produce a mathematical fuel-consumption function.
- Display the function graph.
- Calculate the first derivative.
- Identify the critical speed.
- Calculate the second derivative.
- Determine whether the critical point is a maximum or minimum.
- Display the predicted optimal speed.
- Show the minimum modelled fuel consumption.
- Provide a foundation for future automobile optimization research.

---

## 23. Conclusion

Veylora applies mathematical differentiation to an automobile engineering problem. By representing fuel consumption as a function of speed, the project demonstrates how first derivatives can identify critical points and how second derivatives can classify those points as maximum or minimum values.

The project begins with a simple speed-based mathematical model but can later be expanded to include vehicle characteristics, fuel type, road conditions, environmental factors, maintenance, and driving behaviour.

Therefore, Veylora connects **calculus, automobile engineering, data analysis, Python programming, and optimization** in one research-oriented project.
