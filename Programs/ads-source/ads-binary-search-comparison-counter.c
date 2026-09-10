#include <stdio.h>

int main(void)
{
    int values[31], target = 31, low = 0, high = 30, comparisons = 0;
    for (int index = 0; index < 31; index++) values[index] = index + 1;
    while (low <= high) {
        int middle = low + (high - low) / 2;
        comparisons++;
        if (values[middle] == target) break;
        if (values[middle] < target) low = middle + 1; else high = middle - 1;
    }
    printf("Comparisons = %d\n", comparisons);
    return 0;
}
