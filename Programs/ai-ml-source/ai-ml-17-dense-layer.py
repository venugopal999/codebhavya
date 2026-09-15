inputs=[1,2]
weights=[[0.5,1.0],[-1.0,0.5]]
bias=[0.1,0.2]
outputs=[sum(x*w for x,w in zip(inputs,row))+b for row,b in zip(weights,bias)]
print(outputs)
