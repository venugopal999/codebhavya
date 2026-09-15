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
    int values[] = {5, 2, 8, 1, 4};
    struct Stack data, minimums;
    stack_init(&data); stack_init(&minimums);
    for (int index = 0; index < 5; index++) {
        stack_push(&data, values[index]);
        if (stack_empty(&minimums) || values[index] <= stack_peek(&minimums))
            stack_push(&minimums, values[index]);
    }
    printf("Minimum = %d\n", stack_peek(&minimums));
    int removed = stack_pop(&data);
    if (removed == stack_peek(&minimums)) stack_pop(&minimums);
    printf("After pop, minimum = %d\n", stack_peek(&minimums));
    return 0;
}
