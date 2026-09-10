def uppercase(function):
    def wrapper():
        return function().upper()
    return wrapper

@uppercase
def message():
    return 'keep learning'

print(message())
