ratings={'A':[5,4,5],'B':[3,4,3]}
averages={item:sum(values)/len(values) for item,values in ratings.items()}
print(max(averages,key=averages.get))
