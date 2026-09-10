#include <stdio.h>

int main(void)
{
    int number, sum;

    printf("Enter a three-digit positive integer: ");
    scanf("%d", &number);
    sum = number / 100 + (number / 10) % 10 + number % 10;
    printf("Digit sum = %d\n", sum);
    return 0;
}
