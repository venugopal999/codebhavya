a, b = 0, 1
for _ in range(8):
    print(a, end=' ')
    a, b = b, a + b
