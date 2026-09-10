from math import sqrt
score = 3
weights = [2, 1]
print(round(abs(score)/sqrt(sum(w*w for w in weights)), 3))
