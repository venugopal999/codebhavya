q=2.0
reward=3
next_max=4
alpha,gamma=0.5,0.9
q += alpha*(reward+gamma*next_max-q)
print(round(q,2))
