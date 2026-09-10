def countdown(number):
    while number > 0:
        yield number
        number -= 1

print(list(countdown(4)))
