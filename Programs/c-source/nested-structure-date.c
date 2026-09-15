#include <stdio.h>

struct Date { int day, month, year; };
struct Employee { int id; char name[20]; struct Date joined; };

int main(void)
{
    struct Employee employee = {101, "Bhavya", {9, 9, 2026}};
    printf("%d %s joined on %02d-%02d-%d\n", employee.id, employee.name,
           employee.joined.day, employee.joined.month, employee.joined.year);
    return 0;
}
