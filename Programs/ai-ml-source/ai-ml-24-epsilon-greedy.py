import random
random.seed(1)
actions=['left','right']
q=[1,3]
epsilon=0.2
choice=random.choice(actions) if random.random()<epsilon else actions[q.index(max(q))]
print(choice)
