#include <stdio.h>

int gcd(int first, int second)
{
    if (second == 0) return first;
    return gcd(second, first % second);
}

int main(void)
{
    int first, second;

    printf("Enter two positive integers: ");
    scanf("%d %d", &first, &second);
    printf("GCD of %d and %d is %d.\n", first, second, gcd(first, second));
    return 0;
}
