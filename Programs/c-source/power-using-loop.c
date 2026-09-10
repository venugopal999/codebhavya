#include <stdio.h>

int main(void)
{
    long long base, result = 1;
    int exponent;

    printf("Enter integer base and non-negative exponent: ");
    scanf("%lld %d", &base, &exponent);
    if (exponent < 0) {
        printf("Exponent must be non-negative.\n");
        return 0;
    }
    for (int count = 0; count < exponent; count++)
        result *= base;
    printf("Result = %lld\n", result);
    return 0;
}
