values = [10, 20, 30]
mean = sum(values) / len(values)
std = (sum((x - mean) ** 2 for x in values) / len(values)) ** 0.5
print([round((x - mean) / std, 3) for x in values])
