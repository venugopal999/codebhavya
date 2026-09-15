priors = {'spam':0.4, 'ham':0.6}
likelihood = {'spam':0.8, 'ham':0.2}
scores = {label: priors[label]*likelihood[label] for label in priors}
print(max(scores, key=scores.get), scores)
