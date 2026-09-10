graph={'A':['B','C'],'B':['D'],'C':[],'D':[]}
stack,visited=['A'],[]
while stack:
    node=stack.pop()
    if node not in visited:
        visited.append(node); stack.extend(reversed(graph[node]))
print(visited)
