#include <stdio.h>

int main(void)
{
    int limit;
    long long sum = 0;

    printf("Enter N: ");
    scanf("%d", &limit);
    for (int number = 1; number <= limit; number++)
        sum += number;
    printf("Sum = %lld\n", sum);
    return 0;
}
