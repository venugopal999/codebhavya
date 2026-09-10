#include <stdio.h>

int main(void)
{
    const double pi = 3.141592653589793;
    double radius;

    printf("Enter radius: ");
    scanf("%lf", &radius);
    printf("Area = %.2f\n", pi * radius * radius);
    printf("Circumference = %.2f\n", 2.0 * pi * radius);
    return 0;
}
