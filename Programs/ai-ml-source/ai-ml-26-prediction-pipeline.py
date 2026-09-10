def preprocess(hours):
    return hours/10
def predict(value):
    return round(40+value*50,1)
print(predict(preprocess(6)))
