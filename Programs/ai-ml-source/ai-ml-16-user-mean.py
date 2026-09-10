ratings=[5,None,3,4]
known=[value for value in ratings if value is not None]
print(sum(known)/len(known))
