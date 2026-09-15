counts = {'yes': {'sunny': 3}, 'no': {'sunny': 1}}
priors = {'yes': 0.6, 'no': 0.4}
scores = {label: priors[label] * counts[label]['sunny']/4 for label in priors}
print(max(scores, key=scores.get))
