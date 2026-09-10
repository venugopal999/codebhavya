from collections import defaultdict
groups = defaultdict(list)
for name in ['Asha', 'Anu', 'Ravi']:
    groups[name[0]].append(name)
print(dict(groups))
