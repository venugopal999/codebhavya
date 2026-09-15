#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int initialSize, extraSize;

    scanf("%d", &initialSize);
    if (initialSize < 1 || initialSize > 1000) return 1;
    int *values = malloc((size_t) initialSize * sizeof *values);
    if (values == NULL) return 1;
    for (int index = 0; index < initialSize; index++) scanf("%d", &values[index]);
    scanf("%d", &extraSize);
    if (extraSize < 0 || initialSize + extraSize > 2000) { free(values); return 1; }
    int *expanded = realloc(values, (size_t) (initialSize + extraSize) * sizeof *values);
    if (expanded == NULL) { free(values); return 1; }
    values = expanded;
    for (int index = initialSize; index < initialSize + extraSize; index++) scanf("%d", &values[index]);
    for (int index = 0; index < initialSize + extraSize; index++)
        printf("%d%c", values[index], index == initialSize + extraSize - 1 ? '\n' : ' ');
    free(values);
    return 0;
}
