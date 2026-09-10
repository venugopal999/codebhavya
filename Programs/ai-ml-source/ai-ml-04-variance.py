values = [2, 4, 6, 8]
mean = sum(values) / len(values)
variance = sum((value - mean) ** 2 for value in values) / len(values)
print(variance)
