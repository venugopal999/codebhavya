#include <stdio.h>

struct Employee
{
    int id;
    char name[50];
    double basicSalary;
    double hra;
    double da;
};

int main(void)
{
    struct Employee employee;

    scanf("%d", &employee.id);
    scanf("%49s", employee.name);
    scanf("%lf", &employee.basicSalary);
    employee.hra = employee.basicSalary * 0.20;
    employee.da = employee.basicSalary * 0.10;
    printf("ID: %d\nName: %s\nGross salary: %.2f\n",
           employee.id, employee.name, employee.basicSalary + employee.hra + employee.da);
    return 0;
}
