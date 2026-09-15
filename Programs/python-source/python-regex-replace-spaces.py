import re
text = 'Learn   Python  daily'
print(re.sub(r'\s+', ' ', text))
