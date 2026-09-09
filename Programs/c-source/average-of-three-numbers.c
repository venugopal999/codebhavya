#include <stdio.h>

int main(void)
{
    double first, second, third;

    printf("Enter three numbers: ");
    scanf("%lf %lf %lf", &first, &second, &third);
    printf("Average = %.2f\n", (first + second + third) / 3.0);
    return 0;
}
