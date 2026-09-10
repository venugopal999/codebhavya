number = 153
digits = str(number)
power = len(digits)
print(sum(int(digit) ** power for digit in digits) == number)
