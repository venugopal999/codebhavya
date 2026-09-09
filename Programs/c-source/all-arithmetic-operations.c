#include <stdio.h>

int main(void)
{
    int first, second;

    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    printf("Sum = %d\nDifference = %d\nProduct = %d\n", first + second, first - second, first * second);
    if (second != 0) {
        printf("Quotient = %.2f\nRemainder = %d\n", (double) first / second, first % second);
    } else {
        printf("Division and remainder are undefined for zero.\n");
    }
    return 0;
}
