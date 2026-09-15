#include <stdio.h>

void heapify(int values[], int size, int root)
{
    int largest = root, left = 2 * root + 1, right = left + 1;
    if (left < size && values[left] > values[largest]) largest = left;
    if (right < size && values[right] > values[largest]) largest = right;
    if (largest != root) {
        int temporary = values[root]; values[root] = values[largest]; values[largest] = temporary;
        heapify(values, size, largest);
    }
}

int main(void)
{
    int values[] = {12, 11, 13, 5, 6, 7};
    int size = 6;
    for (int index = size / 2 - 1; index >= 0; index--) heapify(values, size, index);
    for (int end = size - 1; end > 0; end--) {
        int temporary = values[0]; values[0] = values[end]; values[end] = temporary;
        heapify(values, end, 0);
    }
    for (int index = 0; index < size; index++) printf("%d ", values[index]);
    putchar('\n');
    return 0;
}
