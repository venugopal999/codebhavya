tp,fp,fn=42,8,10
precision=tp/(tp+fp)
recall=tp/(tp+fn)
f1=2*precision*recall/(precision+recall)
print(round(precision,3),round(recall,3),round(f1,3))
