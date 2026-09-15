#include <stdio.h>

int isPrime(int number)
{
    if (number < 2) return 0;
    for (int divisor = 2; divisor <= number / divisor; divisor++)
        if (number % divisor == 0) return 0;
    return 1;
}

int main(void)
{
    int number;

    printf("Enter an integer: ");
    scanf("%d", &number);
    printf(isPrime(number) ? "Prime number\n" : "Not a prime number\n");
    return 0;
}
