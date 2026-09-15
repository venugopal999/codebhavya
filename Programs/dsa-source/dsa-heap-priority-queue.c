#include <stdio.h>
#include <stdlib.h>

void push(int heap[], int *size, int value)
{
    int position = (*size)++; heap[position] = value;
    while (position > 0) {
        int parent = (position - 1) / 2;
        if (heap[parent] >= heap[position]) return;
        int temporary = heap[parent]; heap[parent] = heap[position]; heap[position] = temporary;
        position = parent;
    }
}
int extract_max(int heap[], int *size)
{
    if (*size == 0) exit(EXIT_FAILURE);
    int result = heap[0]; heap[0] = heap[--(*size)];
    int position = 0;
    while (1) {
        int largest = position, left = 2 * position + 1, right = left + 1;
        if (left < *size && heap[left] > heap[largest]) largest = left;
        if (right < *size && heap[right] > heap[largest]) largest = right;
        if (largest == position) break;
        int temporary = heap[position]; heap[position] = heap[largest]; heap[largest] = temporary;
        position = largest;
    }
    return result;
}

int main(void)
{
    int heap[10], size = 0;
    push(heap, &size, 40); push(heap, &size, 10); push(heap, &size, 70);
    int first = extract_max(heap, &size);
    int second = extract_max(heap, &size);
    int third = extract_max(heap, &size);
    printf("%d %d %d\n", first, second, third);
    return 0;
}
