#include <stdio.h>

int main(void)
{
    long long first, second;

    printf("Enter two integers: ");
    scanf("%lld %lld", &first, &second);
    first = first + second;
    second = first - second;
    first = first - second;
    printf("After swapping: %lld %lld\n", first, second);
    return 0;
}
