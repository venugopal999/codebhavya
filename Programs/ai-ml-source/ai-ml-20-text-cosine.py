from math import sqrt
a,b=[1,1,0],[1,0,1]
score=sum(x*y for x,y in zip(a,b))/(sqrt(sum(x*x for x in a))*sqrt(sum(y*y for y in b)))
print(round(score,3))
