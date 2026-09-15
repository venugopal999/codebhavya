probabilities = [0.3, 0.55, 0.8]
for threshold in [0.5, 0.7]:
    print(threshold, [int(p >= threshold) for p in probabilities])
