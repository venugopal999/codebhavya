actual = [1,0,1,1]
predicted = [1,0,0,1]
print(sum(a==p for a,p in zip(actual,predicted))/len(actual))
