#include <stdio.h>

int main(void)
{
    double units, bill;

    printf("Enter consumed units: ");
    scanf("%lf", &units);
    if (units < 0) {
        printf("Invalid units\n");
        return 0;
    }
    if (units <= 100)
        bill = units * 1.50;
    else if (units <= 200)
        bill = 100 * 1.50 + (units - 100) * 2.50;
    else
        bill = 100 * 1.50 + 100 * 2.50 + (units - 200) * 4.00;
    printf("Bill amount = %.2f\n", bill);
    return 0;
}
