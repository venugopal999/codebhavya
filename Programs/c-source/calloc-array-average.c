#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    size_t count;
    printf("Enter number of values: ");
    scanf("%zu", &count);
    if (count == 0) { puts("Count must be positive."); return 0; }
    double *values = calloc(count, sizeof *values);
    if (values == NULL) { puts("Allocation failed."); return 1; }
    double sum = 0;
    printf("Enter values: ");
    for (size_t index = 0; index < count; index++) {
        scanf("%lf", &values[index]);
        sum += values[index];
    }
    printf("Average = %.2f\n", sum / (double) count);
    free(values);
    return 0;
}
