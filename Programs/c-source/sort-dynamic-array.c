#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    size_t count;
    printf("Enter array size: ");
    scanf("%zu", &count);
    int *values = malloc(count * sizeof *values);
    if (values == NULL && count != 0) return 1;
    printf("Enter elements: ");
    for (size_t index = 0; index < count; index++) scanf("%d", &values[index]);
    for (size_t pass = 0; pass < count; pass++)
        for (size_t index = 0; index + 1 < count - pass; index++)
            if (values[index] > values[index + 1]) {
                int temporary = values[index];
                values[index] = values[index + 1];
                values[index + 1] = temporary;
            }
    printf("Sorted: ");
    for (size_t index = 0; index < count; index++) printf("%d ", values[index]);
    putchar('\n');
    free(values);
    return 0;
}
