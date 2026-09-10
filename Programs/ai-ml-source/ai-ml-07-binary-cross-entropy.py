from math import log
y, probability = 1, 0.8
loss = -(y*log(probability) + (1-y)*log(1-probability))
print(round(loss, 4))
