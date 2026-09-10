scores = {1:0.72, 3:0.81, 5:0.78}
best = max(scores, key=scores.get)
print(best, scores[best])
