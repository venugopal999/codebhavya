from math import log2
probabilities = [0.5, 0.5]
print(-sum(p*log2(p) for p in probabilities))
