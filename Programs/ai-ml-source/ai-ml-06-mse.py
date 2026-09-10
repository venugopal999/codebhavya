actual = [3, 5, 7]
predicted = [2, 5, 8]
mse = sum((a - p) ** 2 for a, p in zip(actual, predicted)) / len(actual)
print(round(mse, 3))
