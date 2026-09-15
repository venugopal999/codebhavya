#include <stdio.h>

int boundary(const int values[], int count, int target, int first)
{
    int low = 0, high = count - 1, answer = -1;
    while (low <= high) { int middle = low + (high - low) / 2; if (values[middle] == target) { answer = middle; if (first) high = middle - 1; else low = middle + 1; } else if (values[middle] < target) low = middle + 1; else high = middle - 1; }
    return answer;
}

int main(void)
{
    int values[] = {1, 2, 2, 2, 4, 7}, target = 2;
    int first = boundary(values, 6, target, 1), last = boundary(values, 6, target, 0);
    printf("First = %d Last = %d\n", first, last); return 0;
}
