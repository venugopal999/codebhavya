from dataclasses import dataclass

@dataclass
class Student:
    name: str
    mark: int

print(Student('Asha', 90))
