from math import dist
point = [2,2]
centroids = [[0,0],[5,5]]
print(min(range(len(centroids)), key=lambda i: dist(point,centroids[i])))
