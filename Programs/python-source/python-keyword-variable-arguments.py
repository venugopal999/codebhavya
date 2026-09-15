def show(**details):
    return ', '.join(f'{key}={value}' for key, value in details.items())

print(show(name='Asha', mark=88))
