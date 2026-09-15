#include <stdio.h>

int main(void)
{
    int values[] = {3, 6, 9, 12, 15};
    int *pointer = values;
    size_t length = sizeof values / sizeof values[0];
    for (size_t index = 0; index < length; index++) printf("%d ", *(pointer + index));
    putchar('\n');
    return 0;
}
