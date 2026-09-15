x, y = 2, 5
weight, learning_rate = 1.0, 0.1
prediction = weight * x
gradient = 2 * x * (prediction - y)
weight -= learning_rate * gradient
print(round(weight, 2))
