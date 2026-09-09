#include <stdio.h>

int main(void)
{
    int number, isPrime = 1;

    printf("Enter an integer: ");
    scanf("%d", &number);
    if (number < 2) isPrime = 0;
    for (int divisor = 2; divisor <= number / divisor && isPrime; divisor++) {
        if (number % divisor == 0) isPrime = 0;
    }
    printf(isPrime ? "Prime number\n" : "Not a prime number\n");
    return 0;
}
