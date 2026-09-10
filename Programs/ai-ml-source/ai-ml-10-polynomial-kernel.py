x, y = [1,2], [3,4]
degree, constant = 2, 1
dot = sum(a*b for a,b in zip(x,y))
print((dot+constant)**degree)
