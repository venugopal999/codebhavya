#include <stdio.h>

int main(void)
{
    int values[] = {2, 3, 4, 10, 40, 55, 70, 90}, target = 55, bound = 1;
    while (bound < 8 && values[bound] < target) bound *= 2;
    int low = bound / 2, high = bound < 7 ? bound : 7;
    while (low <= high) { int middle = low + (high - low) / 2; if (values[middle] == target) { printf("Index = %d\n", middle); break; } if (values[middle] < target) low = middle + 1; else high = middle - 1; }
    return 0;
}
