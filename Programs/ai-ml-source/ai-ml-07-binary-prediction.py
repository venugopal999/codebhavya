from math import exp
score = -0.4 + 0.8 * 2
probability = 1 / (1 + exp(-score))
print(round(probability, 3), int(probability >= 0.5))
