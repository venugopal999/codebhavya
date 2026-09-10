from pathlib import Path
path = Path('notes.txt')
path.write_text('C\n', encoding='utf-8')
with path.open('a', encoding='utf-8') as file:
    file.write('Python\n')
print(path.read_text(encoding='utf-8').strip().replace('\n', ', '))
