from functools import reduce
values = [1, 2, 3, 4]
print(reduce(lambda a, b: a * b, values))
