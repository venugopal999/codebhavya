#include <stdio.h>

int main(void)
{
    int values[] = {1, 3, 20, 4, 1, 0}, low = 0, high = 5;
    while (low < high) { int middle = low + (high - low) / 2; if (values[middle] < values[middle + 1]) low = middle + 1; else high = middle; }
    printf("Peak = %d at index %d\n", values[low], low); return 0;
}
