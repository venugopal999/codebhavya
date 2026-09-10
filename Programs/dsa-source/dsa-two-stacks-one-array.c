#include <stdio.h>

int main(void)
{
    int values[8];
    int first_top = -1, second_top = 8;
    values[++first_top] = 10;
    values[++first_top] = 20;
    values[--second_top] = 90;
    values[--second_top] = 80;
    printf("Stack 1 top = %d\n", values[first_top]);
    printf("Stack 2 top = %d\n", values[second_top]);
    return 0;
}
