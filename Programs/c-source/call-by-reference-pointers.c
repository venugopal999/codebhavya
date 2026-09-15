#include <stdio.h>

void swap_values(int *first, int *second)
{
    int temporary = *first;
    *first = *second;
    *second = temporary;
}

int main(void)
{
    int first = 10, second = 20;
    swap_values(&first, &second);
    printf("After call: %d %d\n", first, second);
    return 0;
}
