from math import sqrt
values = [2, 4, 6, 8]
mean = sum(values) / len(values)
print(round(sqrt(sum((x - mean) ** 2 for x in values) / len(values)), 3))
