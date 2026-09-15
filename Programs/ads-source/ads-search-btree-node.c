#include <stdio.h>

int main(void)
{
    int keys[] = {10, 20, 35, 50, 70}, target = 35, position = 0;
    while (position < 5 && keys[position] < target) position++;
    printf("Found at slot = %d\n", position); return 0;
}
