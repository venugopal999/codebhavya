from pathlib import Path
path = Path('lesson.txt')
path.write_text('Learn Python', encoding='utf-8')
print(path.read_text(encoding='utf-8'))
