#include <stdio.h>
#include <stdlib.h>

void push_front(int deque[], int *front, int *count, int value)
{
    if (*count == 6) exit(EXIT_FAILURE);
    *front = (*front + 5) % 6;
    deque[*front] = value; (*count)++;
}
void push_back(int deque[], int *front, int *count, int value)
{
    if (*count == 6) exit(EXIT_FAILURE);
    deque[(*front + *count) % 6] = value; (*count)++;
}

int main(void)
{
    int deque[6] = {0}, front = 0, count = 0;
    push_back(deque, &front, &count, 10);
    push_back(deque, &front, &count, 20);
    push_front(deque, &front, &count, 5);
    printf("Front = %d\n", deque[front]);
    int rear = (front + count - 1) % 6;
    printf("Rear = %d\n", deque[rear]);
    return 0;
}
