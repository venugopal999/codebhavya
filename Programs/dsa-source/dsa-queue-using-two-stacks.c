#include <stdio.h>
#include <stdlib.h>

struct Stack { int values[20]; int top; };
struct Queue { struct Stack input; struct Stack output; };
void push(struct Stack *stack, int value) { stack->values[++stack->top] = value; }
int pop(struct Stack *stack) { return stack->values[stack->top--]; }
void enqueue(struct Queue *queue, int value) { push(&queue->input, value); }
int dequeue(struct Queue *queue)
{
    if (queue->output.top < 0)
        while (queue->input.top >= 0) push(&queue->output, pop(&queue->input));
    if (queue->output.top < 0) exit(EXIT_FAILURE);
    return pop(&queue->output);
}

int main(void)
{
    struct Queue queue = {{{0}, -1}, {{0}, -1}};
    enqueue(&queue, 10); enqueue(&queue, 20); enqueue(&queue, 30);
    int first = dequeue(&queue);
    int second = dequeue(&queue);
    int third = dequeue(&queue);
    printf("%d %d %d\n", first, second, third);
    return 0;
}
