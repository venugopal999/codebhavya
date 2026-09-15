#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node *next; };
struct Queue { struct Node *front; struct Node *rear; };
void enqueue(struct Queue *queue, int value)
{
    struct Node *node = malloc(sizeof *node);
    if (node == NULL) exit(EXIT_FAILURE);
    node->data = value; node->next = NULL;
    if (queue->rear == NULL) queue->front = node;
    else queue->rear->next = node;
    queue->rear = node;
}
int dequeue(struct Queue *queue)
{
    if (queue->front == NULL) exit(EXIT_FAILURE);
    struct Node *removed = queue->front; int value = removed->data;
    queue->front = removed->next;
    if (queue->front == NULL) queue->rear = NULL;
    free(removed); return value;
}

int main(void)
{
    struct Queue queue = {NULL, NULL};
    enqueue(&queue, 10); enqueue(&queue, 20); enqueue(&queue, 30);
    printf("Removed = %d\n", dequeue(&queue));
    printf("Front = %d\n", queue.front->data);
    while (queue.front != NULL) dequeue(&queue);
    return 0;
}
