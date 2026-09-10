try:
    result = 10 // 2
except ZeroDivisionError:
    print('Error')
else:
    print(result)
finally:
    print('Finished')
