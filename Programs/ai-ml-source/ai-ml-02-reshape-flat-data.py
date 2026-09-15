values = list(range(1, 7))
rows = [values[index:index + 3] for index in range(0, len(values), 3)]
print(rows)
