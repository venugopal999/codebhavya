rows = [[2, 4, 6], [3, 6, 9]]
features = [row[:-1] for row in rows]
target = [row[-1] for row in rows]
print(features, target)
