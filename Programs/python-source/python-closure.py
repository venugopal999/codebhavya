def multiplier(factor):
    def multiply(number):
        return number * factor
    return multiply

double = multiplier(2)
print(double(12))
