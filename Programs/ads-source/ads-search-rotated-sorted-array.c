#include <stdio.h>

int main(void)
{
    int values[] = {4, 5, 6, 7, 0, 1, 2}, target = 0, low = 0, high = 6;
    while (low <= high) {
        int middle = low + (high - low) / 2;
        if (values[middle] == target) { printf("Index = %d\n", middle); break; }
        if (values[low] <= values[middle]) { if (values[low] <= target && target < values[middle]) high = middle - 1; else low = middle + 1; }
        else { if (values[middle] < target && target <= values[high]) low = middle + 1; else high = middle - 1; }
    }
    return 0;
}
