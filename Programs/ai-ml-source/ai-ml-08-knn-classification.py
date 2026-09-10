from math import dist
points = [([1,1],'A'),([2,1],'A'),([5,5],'B')]
query = [2,2]
nearest = sorted(points, key=lambda item: dist(item[0], query))[:2]
print(max(set(label for _,label in nearest), key=lambda label: sum(x[1]==label for x in nearest)))
