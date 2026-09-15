#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>

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
    const char prefix[] = "-+7*45+20";
    struct Stack stack; stack_init(&stack);
    for (int index = (int) strlen(prefix) - 1; index >= 0; index--) {
        char token = prefix[index];
        if (isdigit((unsigned char) token)) stack_push(&stack, token - '0');
        else {
            int left = stack_pop(&stack), right = stack_pop(&stack);
            switch (token) {
                case '+': stack_push(&stack, left + right); break;
                case '-': stack_push(&stack, left - right); break;
                case '*': stack_push(&stack, left * right); break;
                case '/': stack_push(&stack, left / right); break;
            }
        }
    }
    printf("Value = %d\n", stack_pop(&stack));
    return 0;
}
