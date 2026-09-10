chunks=['Python basics','Machine learning models','Database systems']
query={'learning','models'}
score=lambda text:len(query & set(text.lower().split()))
print(max(chunks,key=score))
