#include <stdio.h>

int main(void)
{
    long long number, value;
    int sum = 0;

    printf("Enter an integer: ");
    scanf("%lld", &number);
    value = number < 0 ? -number : number;
    while (value > 0) {
        sum += (int) (value % 10);
        value /= 10;
    }
    printf("Digit sum = %d\n", sum);
    return 0;
}
