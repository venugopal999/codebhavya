#include <stdio.h>

int binarySearch(const int values[], int left, int right, int target)
{
    if (left > right) return -1;
    int middle = left + (right - left) / 2;
    if (values[middle] == target) return middle;
    if (values[middle] < target) return binarySearch(values, middle + 1, right, target);
    return binarySearch(values, left, middle - 1, target);
}

int main(void)
{
    int size, values[100], target;

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    scanf("%d", &target);
    int position = binarySearch(values, 0, size - 1, target);
    if (position >= 0) printf("Found at position %d\n", position + 1);
    else printf("Not found\n");
    return 0;
}
