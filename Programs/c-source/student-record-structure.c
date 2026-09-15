#include <stdio.h>
#include <string.h>

struct Student
{
    int rollNumber;
    char name[100];
    float marks;
};

int main(void)
{
    struct Student student;

    printf("Enter roll number: ");
    scanf("%d", &student.rollNumber);
    getchar();
    printf("Enter name: ");
    fgets(student.name, sizeof student.name, stdin);
    student.name[strcspn(student.name, "\n")] = '\0';
    printf("Enter marks: ");
    scanf("%f", &student.marks);
    printf("Roll: %d\nName: %s\nMarks: %.2f\n", student.rollNumber, student.name, student.marks);
    return 0;
}
