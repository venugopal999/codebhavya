probabilities = [0.8, 0.6, 0.7]
average = sum(probabilities)/len(probabilities)
print(round(average, 2), int(average >= 0.5))
