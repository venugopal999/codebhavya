features={'hours':4,'attendance':0.8}
weights={'hours':5,'attendance':10}
contributions={name:features[name]*weights[name] for name in features}
print(contributions,sum(contributions.values()))
