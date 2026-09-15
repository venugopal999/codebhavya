categories = ['red', 'blue', 'red']
labels = sorted(set(categories))
encoded = [[int(value == label) for label in labels] for value in categories]
print(labels, encoded)
