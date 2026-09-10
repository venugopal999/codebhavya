training=[10,12,14]
production=[15,17,19]
drift=sum(production)/len(production)-sum(training)/len(training)
print(drift)
