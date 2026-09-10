import random
random.seed(3)
data = [1,2,3,4]
print(random.choices(data, k=len(data)))
