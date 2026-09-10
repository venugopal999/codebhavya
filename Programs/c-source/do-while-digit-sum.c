#include <stdio.h>

int main(void)
{
    int number, sum = 0;
    printf("Enter a non-negative integer: ");
    scanf("%d", &number);
    do {
        sum += number % 10;
        number /= 10;
    } while (number != 0);
    printf("Digit sum = %d\n", sum);
    return 0;
}
