from collections import deque
queue = deque([2, 3])
queue.appendleft(1)
queue.append(4)
print(list(queue), queue.popleft())
