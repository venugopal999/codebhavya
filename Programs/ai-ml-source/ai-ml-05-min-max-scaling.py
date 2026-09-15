values = [10, 20, 30]
low, high = min(values), max(values)
print([(value - low) / (high - low) for value in values])
