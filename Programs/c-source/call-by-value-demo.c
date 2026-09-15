#include <stdio.h>

void swap_copies(int first, int second)
{
    int temporary = first;
    first = second;
    second = temporary;
    printf("Inside function: %d %d\n", first, second);
}

int main(void)
{
    int first = 10, second = 20;
    swap_copies(first, second);
    printf("After call: %d %d\n", first, second);
    return 0;
}
