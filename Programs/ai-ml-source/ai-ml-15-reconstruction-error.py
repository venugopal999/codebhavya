original = [1,4,7]
reconstructed = [1,3,8]
error = sum((a-b)**2 for a,b in zip(original,reconstructed))/len(original)
print(round(error,3))
