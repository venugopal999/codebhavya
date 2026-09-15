from pathlib import Path
path = Path('created.txt')
path.touch()
print(path.exists(), path.is_file())
