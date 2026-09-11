"""CSV attendance analyzer with shortage and recovery calculations."""

import csv
from dataclasses import dataclass
from math import ceil
from pathlib import Path

DATA_FILE = Path("attendance.csv")
REQUIRED_PERCENTAGE = 75.0


@dataclass
class StudentAttendance:
    student_id: str
    name: str
    attended: int
    conducted: int

    @property
    def percentage(self) -> float:
        return 0.0 if self.conducted == 0 else self.attended * 100 / self.conducted

    @property
    def status(self) -> str:
        return "Eligible" if self.percentage >= REQUIRED_PERCENTAGE else "Shortage"

    def classes_needed(self) -> int:
        """Minimum future classes that must all be attended to reach the threshold."""
        if self.percentage >= REQUIRED_PERCENTAGE:
            return 0
        required = REQUIRED_PERCENTAGE / 100
        return ceil((required * self.conducted - self.attended) / (1 - required))

    def safe_absences(self) -> int:
        """Future classes that may be missed before dropping below the threshold."""
        if self.percentage < REQUIRED_PERCENTAGE:
            return 0
        return max(0, int(self.attended / (REQUIRED_PERCENTAGE / 100) - self.conducted))


def load_records(path: Path = DATA_FILE) -> list[StudentAttendance]:
    if not path.exists():
        return []
    records = []
    with path.open("r", newline="", encoding="utf-8") as file:
        for line_number, row in enumerate(csv.DictReader(file), start=2):
            try:
                attended = int(row["attended"])
                conducted = int(row["conducted"])
                if attended < 0 or conducted < 0 or attended > conducted:
                    raise ValueError("require 0 <= attended <= conducted")
                records.append(StudentAttendance(row["student_id"].strip(), row["name"].strip(), attended, conducted))
            except (KeyError, ValueError) as error:
                print(f"Skipping invalid row {line_number}: {error}")
    return records


def save_records(records: list[StudentAttendance], path: Path = DATA_FILE) -> None:
    temporary = path.with_suffix(".tmp")
    with temporary.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["student_id", "name", "attended", "conducted"])
        for item in records:
            writer.writerow([item.student_id, item.name, item.attended, item.conducted])
    temporary.replace(path)


def add_student(records: list[StudentAttendance]) -> None:
    student_id = input("Student ID: ").strip().upper()
    name = input("Student name: ").strip()
    if not student_id or not name or any(item.student_id == student_id for item in records):
        print("ID/name is empty or the ID already exists.")
        return
    records.append(StudentAttendance(student_id, name, 0, 0))
    save_records(records)
    print("Student added.")


def record_class(records: list[StudentAttendance]) -> None:
    if not records:
        print("Add students before recording a class.")
        return
    present = {value.strip().upper() for value in input("Present student IDs (comma-separated): ").split(",") if value.strip()}
    known = {item.student_id for item in records}
    unknown = present - known
    if unknown:
        print("Unknown IDs; class not recorded:", ", ".join(sorted(unknown)))
        return
    for item in records:
        item.conducted += 1
        if item.student_id in present:
            item.attended += 1
    save_records(records)
    print("Class attendance recorded atomically for all students.")


def report(records: list[StudentAttendance]) -> None:
    if not records:
        print("No attendance records found.")
        return
    print("\nID       Name                 Attended  Held   Percent  Status")
    for item in sorted(records, key=lambda row: (row.percentage, row.student_id)):
        advice = (
            f"attend next {item.classes_needed()}"
            if item.status == "Shortage"
            else f"safe absences {item.safe_absences()}"
        )
        print(f"{item.student_id:<8} {item.name:<20} {item.attended:>8} {item.conducted:>5} {item.percentage:>8.2f}%  {item.status} ({advice})")


def main() -> None:
    print(f"CodeBhavya Attendance Analyzer | Required: {REQUIRED_PERCENTAGE:.0f}%")
    while True:
        records = load_records()
        print("\n1. Add student\n2. Record one class\n3. Show report\n4. Exit")
        choice = input("Choose: ").strip()
        if choice == "1":
            add_student(records)
        elif choice == "2":
            record_class(records)
        elif choice == "3":
            report(records)
        elif choice == "4":
            print("Analyzer closed.")
            break
        else:
            print("Choose a number from 1 to 4.")


if __name__ == "__main__":
    main()
