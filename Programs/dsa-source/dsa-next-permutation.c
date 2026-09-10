#include <stdio.h>

int main(void)
{
    int values[] = {1, 2, 3, 6, 5, 4};
    int length = 6, pivot = length - 2;
    while (pivot >= 0 && values[pivot] >= values[pivot + 1]) pivot--;
    if (pivot >= 0) {
        int successor = length - 1;
        while (values[successor] <= values[pivot]) successor--;
        int temporary = values[pivot]; values[pivot] = values[successor]; values[successor] = temporary;
    }
    for (int left = pivot + 1, right = length - 1; left < right; left++, right--) {
        int temporary = values[left]; values[left] = values[right]; values[right] = temporary;
    }
    for (int index = 0; index < length; index++) printf("%d ", values[index]);
    putchar('\n');
    return 0;
}
