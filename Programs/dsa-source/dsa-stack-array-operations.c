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

int main(void)
{
    struct Stack stack;
    stack_init(&stack);
    stack_push(&stack, 10); stack_push(&stack, 20); stack_push(&stack, 30);
    printf("Top = %d\n", stack_peek(&stack));
    printf("Popped = %d\n", stack_pop(&stack));
    printf("New top = %d\n", stack_peek(&stack));
    return 0;
}
