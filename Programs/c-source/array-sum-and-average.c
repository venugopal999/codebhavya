#include <stdio.h>

int main(void)
{
    int size, values[100];
    long long sum = 0;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    printf("Enter %d integers: ", size);
    for (int index = 0; index < size; index++) {
        scanf("%d", &values[index]);
        sum += values[index];
    }
    printf("Sum = %lld\nAverage = %.2f\n", sum, (double) sum / size);
    return 0;
}
