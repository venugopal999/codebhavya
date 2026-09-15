weights=[0.25,0.75]
values=[[2,4],[6,8]]
output=[sum(weights[i]*values[i][j] for i in range(2)) for j in range(2)]
print(output)
