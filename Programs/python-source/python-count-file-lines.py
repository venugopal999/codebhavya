from pathlib import Path
path = Path('topics.txt')
path.write_text('Basics\nLoops\nFunctions\n', encoding='utf-8')
with path.open(encoding='utf-8') as file:
    print(sum(1 for _ in file))
