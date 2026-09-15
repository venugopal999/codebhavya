predictions = [0.9, 0.6, 0.4]
weights = [0.5, 0.3, 0.2]
print(round(sum(p*w for p,w in zip(predictions,weights)), 2))
