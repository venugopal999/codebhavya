values=[2,4,6,8,10]
window=3
print([sum(values[i:i+window])/window for i in range(len(values)-window+1)])
