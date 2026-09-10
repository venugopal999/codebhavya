#include <stdio.h>

int main(void)
{
    int heap[20], size = 0;
    int values[] = {30, 10, 40, 5, 20};
    for (int index = 0; index < 5; index++) {
        int position = size++;
        heap[position] = values[index];
        while (position > 0) {
            int parent = (position - 1) / 2;
            if (heap[parent] <= heap[position]) break;
            int temporary = heap[parent]; heap[parent] = heap[position]; heap[position] = temporary;
            position = parent;
        }
    }
    for (int index = 0; index < size; index++) printf("%d ", heap[index]);
    putchar('\n');
    return 0;
}
