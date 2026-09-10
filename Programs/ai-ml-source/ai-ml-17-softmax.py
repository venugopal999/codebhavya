from math import exp
logits=[1,2,3]
values=[exp(x) for x in logits]
print([round(x/sum(values),3) for x in values])
