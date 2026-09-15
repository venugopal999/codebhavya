a, b = [1,2], [4,6]
print(sum(abs(x-y) for x,y in zip(a,b)))
