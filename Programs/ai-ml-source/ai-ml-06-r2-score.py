actual = [2, 4, 6]
predicted = [2, 5, 5]
mean = sum(actual)/len(actual)
r2 = 1 - sum((a-p)**2 for a,p in zip(actual,predicted)) / sum((a-mean)**2 for a in actual)
print(round(r2, 3))
