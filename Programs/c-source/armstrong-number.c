#include <stdio.h>

int main(void)
{
    int number, value, digits = 0, sum = 0;

    printf("Enter a non-negative integer: ");
    scanf("%d", &number);
    if (number < 0) {
        printf("Use a non-negative integer.\n");
        return 0;
    }
    value = number;
    do {
        digits++;
        value /= 10;
    } while (value > 0);
    value = number;
    do {
        int digit = value % 10;
        int power = 1;
        for (int count = 0; count < digits; count++) power *= digit;
        sum += power;
        value /= 10;
    } while (value > 0);
    printf(sum == number ? "Armstrong number\n" : "Not an Armstrong number\n");
    return 0;
}
