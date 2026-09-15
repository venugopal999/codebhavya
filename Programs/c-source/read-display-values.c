#include <stdio.h>

int main(void)
{
    int age;
    float percentage;
    char grade;

    printf("Enter age, percentage and grade: ");
    scanf("%d %f %c", &age, &percentage, &grade);
    printf("Age = %d\nPercentage = %.2f\nGrade = %c\n", age, percentage, grade);
    return 0;
}
