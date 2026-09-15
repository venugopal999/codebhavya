values = [10, None, 20, 30]
known = [value for value in values if value is not None]
mean = sum(known) / len(known)
print([mean if value is None else value for value in values])
