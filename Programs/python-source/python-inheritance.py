class Person:
    def role(self):
        return 'Person'

class Student(Person):
    pass

print(Student().role())
