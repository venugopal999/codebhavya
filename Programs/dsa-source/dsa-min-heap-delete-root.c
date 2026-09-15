#include <stdio.h>

int main(void)
{
    int heap[] = {5, 10, 20, 30, 40};
    int size = 5, minimum = heap[0];
    heap[0] = heap[--size];
    int position = 0;
    while (1) {
        int left = 2 * position + 1, right = left + 1, smallest = position;
        if (left < size && heap[left] < heap[smallest]) smallest = left;
        if (right < size && heap[right] < heap[smallest]) smallest = right;
        if (smallest == position) break;
        int temporary = heap[position]; heap[position] = heap[smallest]; heap[smallest] = temporary;
        position = smallest;
    }
    printf("Removed = %d\nHeap: ", minimum);
    for (int index = 0; index < size; index++) printf("%d ", heap[index]);
    putchar('\n');
    return 0;
}
