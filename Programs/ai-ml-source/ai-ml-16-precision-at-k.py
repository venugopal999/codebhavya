recommended=['A','B','C']
relevant={'A','C','D'}
print(sum(item in relevant for item in recommended)/len(recommended))
