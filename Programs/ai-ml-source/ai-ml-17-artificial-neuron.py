inputs=[2,3]
weights=[0.5,-1]
bias=1
print(sum(x*w for x,w in zip(inputs,weights))+bias)
