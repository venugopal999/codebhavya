prior = 0.01
sensitivity = 0.90
false_positive = 0.05
posterior = sensitivity * prior / (sensitivity * prior + false_positive * (1 - prior))
print(round(posterior, 4))
