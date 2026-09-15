#include <stdio.h>

int main(void)
{
    int operations = 0;
    for (int row = 0; row < 5; row++)
        for (int column = 0; column < 5; column++) operations++;
    printf("Operations = %d\n", operations);
    return 0;
}
