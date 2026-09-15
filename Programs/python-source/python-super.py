class Person:
    def __init__(self, name):
        self.name = name

class Student(Person):
    def __init__(self, name, mark):
        super().__init__(name)
        self.mark = mark

student = Student('Asha', 92)
print(student.name, student.mark)
