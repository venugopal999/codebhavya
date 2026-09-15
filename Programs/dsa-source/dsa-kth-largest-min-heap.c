#include <stdio.h>

void sift_up(int heap[], int position)
{
    while (position > 0) {
        int parent = (position - 1) / 2;
        if (heap[parent] <= heap[position]) return;
        int temporary = heap[parent]; heap[parent] = heap[position]; heap[position] = temporary;
        position = parent;
    }
}
void sift_down(int heap[], int size, int position)
{
    while (1) {
        int smallest = position, left = 2 * position + 1, right = left + 1;
        if (left < size && heap[left] < heap[smallest]) smallest = left;
        if (right < size && heap[right] < heap[smallest]) smallest = right;
        if (smallest == position) return;
        int temporary = heap[position]; heap[position] = heap[smallest]; heap[smallest] = temporary;
        position = smallest;
    }
}

int main(void)
{
    int values[] = {7, 10, 4, 3, 20, 15};
    int heap[3], size = 0, k = 3;
    for (int index = 0; index < 6; index++) {
        if (size < k) {
            heap[size] = values[index];
            sift_up(heap, size++);
        } else if (values[index] > heap[0]) {
            heap[0] = values[index];
            sift_down(heap, size, 0);
        }
    }
    printf("3rd largest = %d\n", heap[0]);
    return 0;
}
