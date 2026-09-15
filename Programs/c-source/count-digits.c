#include <stdio.h>

int main(void)
{
    long long number, value;
    int count = 0;

    printf("Enter an integer: ");
    scanf("%lld", &number);
    value = number < 0 ? -number : number;
    do {
        count++;
        value /= 10;
    } while (value != 0);
    printf("Digit count = %d\n", count);
    return 0;
}
