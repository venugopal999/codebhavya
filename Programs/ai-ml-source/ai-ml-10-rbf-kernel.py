from math import exp
x, y, gamma = [1,2], [2,4], 0.5
squared_distance = sum((a-b)**2 for a,b in zip(x,y))
print(round(exp(-gamma*squared_distance), 4))
