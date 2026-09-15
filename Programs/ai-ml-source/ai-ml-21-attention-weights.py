from math import exp
scores=[1,2]
values=[exp(score) for score in scores]
print([round(value/sum(values),3) for value in values])
