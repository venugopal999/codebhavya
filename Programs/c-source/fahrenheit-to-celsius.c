#include <stdio.h>

int main(void)
{
    double fahrenheit, celsius;

    printf("Enter temperature in Fahrenheit: ");
    scanf("%lf", &fahrenheit);
    celsius = (fahrenheit - 32.0) * 5.0 / 9.0;
    printf("Celsius = %.2f\n", celsius);
    return 0;
}
