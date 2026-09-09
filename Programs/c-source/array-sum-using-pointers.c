#include <stdio.h>

int main(void)
{
    int size, values[100];
    long long sum = 0;

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", values + index);
    for (int *current = values; current < values + size; current++) sum += *current;
    printf("Sum = %lld\n", sum);
    return 0;
}
