actual = [3, 5, 8]
predicted = [2, 5, 10]
loss = sum(abs(a - p) for a, p in zip(actual, predicted)) / len(actual)
print(round(loss, 2))
