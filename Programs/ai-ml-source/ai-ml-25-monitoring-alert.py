baseline_accuracy=0.9
current_accuracy=0.78
print('Retrain' if baseline_accuracy-current_accuracy>0.1 else 'Healthy')
