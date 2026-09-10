#include <stdio.h>

int main(void)
{
    long long number;

    printf("Enter an integer: ");
    scanf("%lld", &number);
    printf("Square = %lld\n", number * number);
    printf("Cube = %lld\n", number * number * number);
    return 0;
}
