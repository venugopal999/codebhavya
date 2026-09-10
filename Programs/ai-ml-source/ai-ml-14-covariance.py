x, y = [1,2,3], [2,4,6]
mx, my = sum(x)/len(x), sum(y)/len(y)
cov = sum((a-mx)*(b-my) for a,b in zip(x,y))/(len(x)-1)
print(cov)
