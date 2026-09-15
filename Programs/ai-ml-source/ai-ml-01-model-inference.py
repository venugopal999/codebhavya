weights = [0.5, 1.5]
features = [4, 2]
bias = 1
prediction = sum(w * x for w, x in zip(weights, features)) + bias
print(prediction)
