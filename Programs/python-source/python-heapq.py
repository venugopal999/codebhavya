import heapq
values = [7, 2, 5, 1]
heapq.heapify(values)
print([heapq.heappop(values) for _ in range(4)])
