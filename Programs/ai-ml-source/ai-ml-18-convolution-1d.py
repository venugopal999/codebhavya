signal=[1,2,3,4,5]
kernel=[1,0,-1]
output=[sum(signal[i+j]*kernel[j] for j in range(3)) for i in range(3)]
print(output)
