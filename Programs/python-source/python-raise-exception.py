mark = -1
try:
    if not 0 <= mark <= 100:
        raise ValueError('Mark must be 0 to 100')
except ValueError as error:
    print(error)
