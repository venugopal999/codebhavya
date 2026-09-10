from math import dist
points = [[1,1],[2,1],[8,8],[9,8]]
centroids = [[1,1],[9,8]]
labels = [min(range(2), key=lambda i: dist(p,centroids[i])) for p in points]
print(labels)
