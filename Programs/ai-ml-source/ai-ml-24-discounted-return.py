rewards=[1,2,3]
gamma=0.5
result=sum(reward*(gamma**step) for step,reward in enumerate(rewards))
print(result)
