matrix = [[1, 2], [3, 4], [5, 6]]
means = [sum(column) / len(column) for column in zip(*matrix)]
print(means)
