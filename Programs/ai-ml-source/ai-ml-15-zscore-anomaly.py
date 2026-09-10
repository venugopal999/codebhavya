value, mean, std = 130, 100, 8
z = abs(value-mean)/std
print(round(z,2), z>3)
