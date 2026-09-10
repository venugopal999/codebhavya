#include <stdio.h>

void heapify(int values[], int size, int root)
{
    while (1) {
        int largest = root, left = 2 * root + 1, right = left + 1;
        if (left < size && values[left] > values[largest]) largest = left;
        if (right < size && values[right] > values[largest]) largest = right;
        if (largest == root) return;
        int temporary = values[root]; values[root] = values[largest]; values[largest] = temporary;
        root = largest;
    }
}

int main(void)
{
    int values[] = {4, 10, 3, 5, 1};
    int size = 5;
    for (int index = size / 2 - 1; index >= 0; index--) heapify(values, size, index);
    for (int index = 0; index < size; index++) printf("%d ", values[index]);
    putchar('\n');
    return 0;
}
