#include <stdio.h>

int main(void)
{
    double length, width;

    printf("Enter length and width: ");
    scanf("%lf %lf", &length, &width);
    printf("Area = %.2f\n", length * width);
    printf("Perimeter = %.2f\n", 2.0 * (length + width));
    return 0;
}
