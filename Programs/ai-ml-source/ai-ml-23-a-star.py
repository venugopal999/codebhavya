nodes={'A':(3,5),'B':(4,2),'C':(2,6)}
priority={node:g+h for node,(g,h) in nodes.items()}
print(min(priority,key=priority.get),priority)
