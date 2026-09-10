a = [[1, 2], [3, 4]]
b = [[2, 0], [1, 2]]
result = [[sum(a[i][k] * b[k][j] for k in range(2)) for j in range(2)] for i in range(2)]
print(result)
