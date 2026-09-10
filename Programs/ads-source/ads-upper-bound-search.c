#include <stdio.h>

int main(void)
{
    int values[] = {1, 2, 2, 2, 4, 7}, target = 2, low = 0, high = 6;
    while (low < high) { int middle = low + (high - low) / 2; if (values[middle] <= target) low = middle + 1; else high = middle; }
    printf("Upper bound index = %d\n", low); return 0;
}
