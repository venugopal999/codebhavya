#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int size;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100000) return 1;
    int *values = malloc((size_t) size * sizeof *values);
    if (values == NULL) {
        printf("Memory allocation failed.\n");
        return 1;
    }
    long long sum = 0;
    for (int index = 0; index < size; index++) {
        scanf("%d", &values[index]);
        sum += values[index];
    }
    printf("Sum = %lld\n", sum);
    free(values);
    return 0;
}
