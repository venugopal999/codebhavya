from math import exp, pi, sqrt
x, mean, variance = 1, 0, 1
likelihood = exp(-((x-mean)**2)/(2*variance)) / sqrt(2*pi*variance)
print(round(likelihood, 4))
