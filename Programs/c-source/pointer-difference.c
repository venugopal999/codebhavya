#include <stdio.h>
#include <stddef.h>

int main(void)
{
    int values[] = {10, 20, 30, 40, 50};
    int *first = &values[1];
    int *second = &values[4];
    ptrdiff_t distance = second - first;
    printf("Element distance = %td\n", distance);
    return 0;
}
