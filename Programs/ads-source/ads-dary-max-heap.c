#include <stdio.h>

void insert(int heap[], int *size, int value, int degree) { int index = (*size)++; heap[index] = value; while (index > 0) { int parent = (index - 1) / degree; if (heap[parent] >= heap[index]) break; int t = heap[parent]; heap[parent] = heap[index]; heap[index] = t; index = parent; } }
int extract_max(int heap[], int *size, int degree) { int answer = heap[0]; heap[0] = heap[--(*size)]; int index = 0; for (;;) { int best = index; for (int child = degree * index + 1; child <= degree * index + degree && child < *size; child++) if (heap[child] > heap[best]) best = child; if (best == index) break; int t = heap[index]; heap[index] = heap[best]; heap[best] = t; index = best; } return answer; }

int main(void)
{
    int heap[20], size = 0, values[] = {10, 40, 15, 30, 50, 20};
    for (int i = 0; i < 6; i++) insert(heap, &size, values[i], 3);
    printf("Extracted:"); while (size) printf(" %d", extract_max(heap, &size, 3)); putchar('\n'); return 0;
}
