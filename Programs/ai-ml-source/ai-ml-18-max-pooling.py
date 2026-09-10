pixels=[[1,4,2,3],[5,2,8,1],[0,6,3,7],[4,2,9,5]]
pooled=[[max(pixels[r+i][c+j] for i in range(2) for j in range(2)) for c in (0,2)] for r in (0,2)]
print(pooled)
