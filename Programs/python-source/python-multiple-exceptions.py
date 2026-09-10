value = 'abc'
try:
    print(int(value))
except (ValueError, TypeError) as error:
    print(type(error).__name__)
