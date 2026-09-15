values = [1,2,3,100]
threshold = 50
left = [x for x in values if x<threshold]
right = [x for x in values if x>=threshold]
print(left, right)
