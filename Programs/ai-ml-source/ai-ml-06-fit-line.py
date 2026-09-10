x = [1, 2, 3]
y = [2, 4, 6]
x_mean, y_mean = sum(x)/len(x), sum(y)/len(y)
slope = sum((a-x_mean)*(b-y_mean) for a,b in zip(x,y)) / sum((a-x_mean)**2 for a in x)
intercept = y_mean - slope*x_mean
print(slope, intercept)
