#include <stdio.h>

int main(void)
{
    int choice;
    double value;
    printf("1. Celsius to Fahrenheit\n2. Fahrenheit to Celsius\nChoose: ");
    scanf("%d", &choice);
    printf("Enter temperature: ");
    scanf("%lf", &value);
    switch (choice) {
        case 1: printf("Fahrenheit = %.2f\n", value * 9.0 / 5.0 + 32.0); break;
        case 2: printf("Celsius = %.2f\n", (value - 32.0) * 5.0 / 9.0); break;
        default: puts("Invalid choice.");
    }
    return 0;
}
