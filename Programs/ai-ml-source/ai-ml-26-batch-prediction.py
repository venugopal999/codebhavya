def predict(hours):
    return min(100,40+hours*6)
print([predict(value) for value in [2,5,10]])
