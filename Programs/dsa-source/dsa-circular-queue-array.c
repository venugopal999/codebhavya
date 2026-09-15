#include <stdio.h>
#include <stdlib.h>

#define CAPACITY 5
struct Queue { int values[CAPACITY]; int front; int rear; int count; };
void enqueue(struct Queue *queue, int value)
{
    if (queue->count == CAPACITY) exit(EXIT_FAILURE);
    queue->values[queue->rear] = value;
    queue->rear = (queue->rear + 1) % CAPACITY;
    queue->count++;
}
int dequeue(struct Queue *queue)
{
    if (queue->count == 0) exit(EXIT_FAILURE);
    int value = queue->values[queue->front];
    queue->front = (queue->front + 1) % CAPACITY;
    queue->count--;
    return value;
}

int main(void)
{
    struct Queue queue = {{0}, 0, 0, 0};
    enqueue(&queue, 10); enqueue(&queue, 20); enqueue(&queue, 30);
    printf("Removed = %d\n", dequeue(&queue));
    enqueue(&queue, 40);
    while (queue.count > 0) printf("%d ", dequeue(&queue));
    putchar('\n');
    return 0;
}
