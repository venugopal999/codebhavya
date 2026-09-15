#include <stdio.h>

int main(void)
{
    double principal, rate, time, interest;

    printf("Enter principal, annual rate and time: ");
    scanf("%lf %lf %lf", &principal, &rate, &time);
    interest = principal * rate * time / 100.0;
    printf("Simple interest = %.2f\n", interest);
    printf("Total amount = %.2f\n", principal + interest);
    return 0;
}
