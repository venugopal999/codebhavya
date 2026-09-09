#include <stdio.h>

int main(void)
{
    long long number, square, divisor = 10;

    printf("Enter a non-negative integer: ");
    scanf("%lld", &number);
    if (number < 0) {
        printf("Use a non-negative integer.\n");
        return 0;
    }
    square = number * number;
    for (long long value = number; value >= 10; value /= 10) divisor *= 10;
    printf(square % divisor == number ? "Automorphic number\n" : "Not an automorphic number\n");
    return 0;
}
