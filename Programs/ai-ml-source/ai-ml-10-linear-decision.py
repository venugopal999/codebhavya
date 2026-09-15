weights = [0.5, -1]
features = [4, 1]
bias = 0.2
score = sum(w*x for w,x in zip(weights,features)) + bias
print(round(score, 2), 1 if score >= 0 else -1)
