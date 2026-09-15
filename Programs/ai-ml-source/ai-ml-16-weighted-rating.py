similarities=[0.9,0.6]
ratings=[5,3]
prediction=sum(s*r for s,r in zip(similarities,ratings))/sum(similarities)
print(round(prediction,2))
