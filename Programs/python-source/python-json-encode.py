import json
data = {'course': 'Python', 'level': 1}
print(json.dumps(data, sort_keys=True))
