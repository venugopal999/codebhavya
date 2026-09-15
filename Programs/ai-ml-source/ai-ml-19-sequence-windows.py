values=[1,2,3,4,5]
size=3
print([values[i:i+size] for i in range(len(values)-size+1)])
