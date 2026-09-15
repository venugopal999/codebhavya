import json
text = '{"name": "Asha", "mark": 90}'
data = json.loads(text)
print(data['name'], data['mark'])
