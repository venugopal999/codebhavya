year = 2024
is_leap = year % 400 == 0 or (year % 4 == 0 and year % 100 != 0)
print(is_leap)
