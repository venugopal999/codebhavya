tokens=['AI','helps','learn']
probabilities=[0.2,0.6,0.2]
print(tokens[max(range(len(tokens)),key=lambda i:probabilities[i])])
