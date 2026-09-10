import re
email = 'student@example.com'
pattern = r'^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$'
print(bool(re.fullmatch(pattern, email)))
