from math import sqrt
query=[1,2]
key=[2,1]
print(round(sum(q*k for q,k in zip(query,key))/sqrt(len(query)),3))
