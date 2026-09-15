from math import exp
weight, alpha, label, prediction = 0.25, 0.7, 1, -1
updated = weight * exp(-alpha*label*prediction)
print(round(updated, 4))
