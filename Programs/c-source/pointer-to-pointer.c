#include <stdio.h>

int main(void)
{
    int value = 42;
    int *pointer = &value;
    int **double_pointer = &pointer;
    printf("Value = %d\n", **double_pointer);
    return 0;
}
