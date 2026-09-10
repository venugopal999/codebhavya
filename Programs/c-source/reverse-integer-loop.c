#include <stdio.h>

int main(void)
{
    long long number, value, reversed = 0;

    printf("Enter an integer: ");
    scanf("%lld", &number);
    value = number < 0 ? -number : number;
    while (value > 0) {
        reversed = reversed * 10 + value % 10;
        value /= 10;
    }
    if (number < 0) reversed = -reversed;
    printf("Reversed = %lld\n", reversed);
    return 0;
}
