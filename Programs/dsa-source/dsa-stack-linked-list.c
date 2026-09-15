#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node *next; };
void push(struct Node **top, int value)
{
    struct Node *node = malloc(sizeof *node);
    if (node == NULL) exit(EXIT_FAILURE);
    node->data = value; node->next = *top; *top = node;
}
int pop(struct Node **top)
{
    if (*top == NULL) { puts("Stack underflow."); exit(EXIT_FAILURE); }
    struct Node *removed = *top; int value = removed->data;
    *top = removed->next; free(removed); return value;
}

int main(void)
{
    struct Node *top = NULL;
    push(&top, 10); push(&top, 20); push(&top, 30);
    printf("Popped = %d\n", pop(&top));
    printf("Top = %d\n", top->data);
    while (top != NULL) pop(&top);
    return 0;
}
