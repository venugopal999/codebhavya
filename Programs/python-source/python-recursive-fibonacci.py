def fibonacci(number):
    return number if number < 2 else fibonacci(number - 1) + fibonacci(number - 2)

print(fibonacci(8))
