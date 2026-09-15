points = [[1,2],[3,4],[5,6]]
centroid = [sum(column)/len(points) for column in zip(*points)]
print(centroid)
