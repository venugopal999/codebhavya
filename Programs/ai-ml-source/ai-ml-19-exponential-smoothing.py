values=[10,14,13]
alpha=0.5
smoothed=[values[0]]
for value in values[1:]:
    smoothed.append(alpha*value+(1-alpha)*smoothed[-1])
print(smoothed)
