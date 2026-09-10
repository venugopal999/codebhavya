from io import StringIO
buffer = StringIO()
buffer.write('Python')
buffer.write(' Practice')
print(buffer.getvalue())
