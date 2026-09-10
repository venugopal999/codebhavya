#include <stdio.h>

int main(void)
{
    int number, divisor = 0;
    printf("Enter an integer greater than 1: ");
    scanf("%d", &number);
    for (int candidate = 2; candidate < number; candidate++) {
        if (number % candidate == 0) {
            divisor = candidate;
            break;
        }
    }
    if (divisor) printf("First divisor = %d\n", divisor);
    else puts("The number is prime.");
    return 0;
}
