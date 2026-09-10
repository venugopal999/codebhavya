#include <stdio.h>

int main(void)
{
    int size, values[100], target, left = 0, right, position = -1;

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    scanf("%d", &target);
    right = size - 1;
    while (left <= right) {
        int middle = left + (right - left) / 2;
        if (values[middle] == target) { position = middle; break; }
        if (values[middle] < target) left = middle + 1;
        else right = middle - 1;
    }
    if (position >= 0) printf("Found at position %d\n", position + 1);
    else printf("Not found\n");
    return 0;
}
