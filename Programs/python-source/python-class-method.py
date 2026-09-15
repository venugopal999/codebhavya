class Course:
    platform = 'CodeBhavya'

    @classmethod
    def label(cls, name):
        return f'{cls.platform}: {name}'

print(Course.label('Python'))
