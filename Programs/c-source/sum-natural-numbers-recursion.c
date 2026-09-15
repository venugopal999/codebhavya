#include <stdio.h>

long long sumTo(int number)
{
    if (number == 0) return 0;
    return number + sumTo(number - 1);
}

int main(void)
{
    int number;

    printf("Enter a non-negative integer: ");
    scanf("%d", &number);
    if (number < 0) return 1;
    printf("Sum = %lld\n", sumTo(number));
    return 0;
}
