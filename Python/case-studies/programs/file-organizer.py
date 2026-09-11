"""Safely organize real files by extension with preview and collision handling."""

import shutil
from collections import Counter
from pathlib import Path

CATEGORIES = {
    "Images": {".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"},
    "Documents": {".pdf", ".doc", ".docx", ".txt", ".md", ".odt"},
    "Spreadsheets": {".csv", ".xls", ".xlsx", ".ods"},
    "Presentations": {".ppt", ".pptx", ".odp"},
    "Code": {".py", ".c", ".cpp", ".java", ".js", ".html", ".css"},
    "Archives": {".zip", ".tar", ".gz", ".rar", ".7z"},
    "Audio": {".mp3", ".wav", ".aac", ".flac"},
    "Video": {".mp4", ".mkv", ".avi", ".mov"},
}


def category_for(path: Path) -> str:
    suffix = path.suffix.lower()
    return next((name for name, suffixes in CATEGORIES.items() if suffix in suffixes), "Other")


def available_destination(folder: Path, filename: str) -> Path:
    candidate = folder / filename
    if not candidate.exists():
        return candidate
    original = Path(filename)
    counter = 1
    while True:
        candidate = folder / f"{original.stem}_{counter}{original.suffix}"
        if not candidate.exists():
            return candidate
        counter += 1


def build_plan(folder: Path, script: Path) -> list[tuple[Path, Path, str]]:
    plan = []
    for source in sorted(folder.iterdir(), key=lambda path: path.name.lower()):
        if not source.is_file() or source.resolve() == script.resolve():
            continue
        category = category_for(source)
        destination = available_destination(folder / category, source.name)
        plan.append((source, destination, category))
    return plan


def main() -> None:
    print("CodeBhavya File Organizer")
    raw = input("Folder to organize (blank = current folder): ").strip()
    folder = Path(raw or ".").expanduser().resolve()
    if not folder.exists() or not folder.is_dir():
        print("That path is not an accessible directory.")
        return

    plan = build_plan(folder, Path(__file__))
    if not plan:
        print("No top-level files are available to organize.")
        return

    print("\nPreview (no files moved yet):")
    for source, destination, _ in plan:
        print(f"{source.name} -> {destination.relative_to(folder)}")
    counts = Counter(category for _, _, category in plan)
    print("Summary:", ", ".join(f"{name}={count}" for name, count in sorted(counts.items())))

    if input("Apply this plan? Type MOVE to confirm: ").strip() != "MOVE":
        print("Cancelled; no files were moved.")
        return

    moved = 0
    for source, destination, _ in plan:
        destination.parent.mkdir(exist_ok=True)
        try:
            shutil.move(str(source), str(destination))
            moved += 1
        except OSError as error:
            print(f"Could not move {source.name}: {error}")
    print(f"Moved {moved} of {len(plan)} files.")


if __name__ == "__main__":
    main()
