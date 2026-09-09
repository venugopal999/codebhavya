#include <stdio.h>
#include <math.h>

int main(void)
{
    double base, exponent;

    printf("Enter base and exponent: ");
    scanf("%lf %lf", &base, &exponent);
    printf("Result = %.4f\n", pow(base, exponent));
    return 0;
}
