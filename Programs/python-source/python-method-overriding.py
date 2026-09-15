class Person:
    def role(self):
        return 'Person'

class Student(Person):
    def role(self):
        return 'Student'

print(Student().role())
