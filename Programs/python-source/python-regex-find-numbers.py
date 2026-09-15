import re
text = 'C 200, DSA 106, ADS 112'
print(re.findall(r'\d+', text))
