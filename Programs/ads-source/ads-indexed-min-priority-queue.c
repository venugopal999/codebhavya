#include <stdio.h>

void swap_ids(int heap[], int position[], int a, int b) { int t = heap[a]; heap[a] = heap[b]; heap[b] = t; position[heap[a]] = a; position[heap[b]] = b; }
void decrease(int heap[], int position[], int key[], int id, int value) { key[id] = value; int index = position[id]; while (index && key[heap[(index - 1) / 2]] > key[heap[index]]) { swap_ids(heap, position, index, (index - 1) / 2); index = (index - 1) / 2; } }
int pop_min(int heap[], int position[], const int key[], int *size) { int answer = heap[0]; swap_ids(heap, position, 0, *size - 1); (*size)--; int index = 0; for (;;) { int left = 2 * index + 1, right = left + 1, best = index; if (left < *size && key[heap[left]] < key[heap[best]]) best = left; if (right < *size && key[heap[right]] < key[heap[best]]) best = right; if (best == index) break; swap_ids(heap, position, index, best); index = best; } return answer; }

int main(void)
{
    int heap[] = {1, 3, 2, 4}, key[] = {0, 40, 30, 20, 50}, position[] = {0,0,2,1,3}, size = 4;
    decrease(heap, position, key, 4, 10);
    while (size) { int id = pop_min(heap, position, key, &size); printf("%d:%d%c", id, key[id], size ? ' ' : '\n'); }
    return 0;
}
