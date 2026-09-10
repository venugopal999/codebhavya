#include <stdio.h>
#include <stdlib.h>

#define CAPACITY 50
struct Stack { int values[CAPACITY]; int top; };
void stack_init(struct Stack *stack) { stack->top = -1; }
int stack_empty(const struct Stack *stack) { return stack->top < 0; }
void stack_push(struct Stack *stack, int value)
{
    if (stack->top + 1 >= CAPACITY) { puts("Stack overflow."); exit(EXIT_FAILURE); }
    stack->values[++stack->top] = value;
}
int stack_pop(struct Stack *stack)
{
    if (stack_empty(stack)) { puts("Stack underflow."); exit(EXIT_FAILURE); }
    return stack->values[stack->top--];
}
int stack_peek(const struct Stack *stack)
{
    if (stack_empty(stack)) { puts("Stack is empty."); exit(EXIT_FAILURE); }
    return stack->values[stack->top];
}
void insert_bottom(struct Stack *stack, int value)
{
    if (stack_empty(stack)) { stack_push(stack, value); return; }
    int top = stack_pop(stack);
    insert_bottom(stack, value);
    stack_push(stack, top);
}
void reverse_stack(struct Stack *stack)
{
    if (stack_empty(stack)) return;
    int top = stack_pop(stack);
    reverse_stack(stack);
    insert_bottom(stack, top);
}

int main(void)
{
    struct Stack stack; stack_init(&stack);
    stack_push(&stack, 10); stack_push(&stack, 20); stack_push(&stack, 30);
    reverse_stack(&stack);
    while (!stack_empty(&stack)) printf("%d ", stack_pop(&stack));
    putchar('\n');
    return 0;
}
