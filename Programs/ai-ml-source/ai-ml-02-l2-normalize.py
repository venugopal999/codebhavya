from math import sqrt
vector = [3, 4]
norm = sqrt(sum(value ** 2 for value in vector))
print([value / norm for value in vector])
