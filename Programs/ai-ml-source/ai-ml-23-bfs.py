from collections import deque
graph={'A':['B','C'],'B':['D'],'C':[],'D':[]}
queue,visited=deque(['A']),[]
while queue:
    node=queue.popleft()
    if node not in visited:
        visited.append(node); queue.extend(graph[node])
print(visited)
