#include <stdio.h>

int main(void)
{
    int limit;
    long long sum = 0;

    printf("Enter N: ");
    scanf("%d", &limit);
    for (int number = 2; number <= limit; number += 2)
        sum += number;
    printf("Even sum = %lld\n", sum);
    return 0;
}
