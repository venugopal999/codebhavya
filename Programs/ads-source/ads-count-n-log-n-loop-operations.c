#include <stdio.h>

int main(void)
{
    int operations = 0;
    for (int scale = 1; scale < 8; scale *= 2)
        for (int index = 0; index < 8; index++) operations++;
    printf("Operations = %d\n", operations);
    return 0;
}
