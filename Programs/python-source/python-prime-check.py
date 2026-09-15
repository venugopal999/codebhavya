number = 29
is_prime = number > 1 and all(number % divisor for divisor in range(2, int(number ** 0.5) + 1))
print(is_prime)
