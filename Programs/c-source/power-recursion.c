#include <stdio.h>

long long power(long long base, unsigned int exponent)
{
    if (exponent == 0) return 1;
    long long half = power(base, exponent / 2);
    if (exponent % 2 == 0) return half * half;
    return base * half * half;
}

int main(void)
{
    long long base;
    unsigned int exponent;

    printf("Enter integer base and non-negative exponent: ");
    scanf("%lld %u", &base, &exponent);
    printf("Result = %lld\n", power(base, exponent));
    return 0;
}
