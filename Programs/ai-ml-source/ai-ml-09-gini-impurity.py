counts = [3, 2]
total = sum(counts)
gini = 1 - sum((count/total)**2 for count in counts)
print(round(gini, 2))
