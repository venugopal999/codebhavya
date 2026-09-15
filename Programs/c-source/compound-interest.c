#include <stdio.h>
#include <math.h>

int main(void)
{
    double principal, rate, time, amount;

    printf("Enter principal, annual rate and time: ");
    scanf("%lf %lf %lf", &principal, &rate, &time);
    amount = principal * pow(1.0 + rate / 100.0, time);
    printf("Compound interest = %.2f\n", amount - principal);
    printf("Total amount = %.2f\n", amount);
    return 0;
}
