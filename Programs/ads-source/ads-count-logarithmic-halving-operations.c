#include <stdio.h>

int main(void)
{
    int value = 64, operations = 0;
    while (value > 1) { value /= 2; operations++; }
    printf("Operations = %d\n", operations);
    return 0;
}
