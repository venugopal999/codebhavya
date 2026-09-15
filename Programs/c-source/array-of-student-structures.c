#include <stdio.h>

struct Student { char name[20]; int marks; };

int main(void)
{
    struct Student students[3];
    for (int index = 0; index < 3; index++)
        scanf("%19s %d", students[index].name, &students[index].marks);
    for (int index = 0; index < 3; index++)
        printf("%s: %d\n", students[index].name, students[index].marks);
    return 0;
}
