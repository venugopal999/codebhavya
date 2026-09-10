"use strict";

const { cMain, makeDsa } = require("./helpers");
const topic = "Stacks & Expressions";

const arrayStack = `#define CAPACITY 50
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
}`;

function stackProgram(options) {
  return makeDsa({
    topic,
    concepts: ["Stack", "LIFO", "push/pop"],
    time: "O(n)",
    space: "O(n)",
    ...options
  });
}

module.exports = [
  stackProgram({
    slug: "dsa-stack-array-operations",
    title: "Implement Stack Operations Using an Array",
    source: cMain(`    struct Stack stack;
    stack_init(&stack);
    stack_push(&stack, 10); stack_push(&stack, 20); stack_push(&stack, 30);
    printf("Top = %d\\n", stack_peek(&stack));
    printf("Popped = %d\\n", stack_pop(&stack));
    printf("New top = %d\\n", stack_peek(&stack));
    return 0;`, ["stdio.h", "stdlib.h"], arrayStack),
    sampleInput: "No input required",
    sampleOutput: "Top = 30\nPopped = 30\nNew top = 20",
    time: "O(1) per operation",
    method: "Use a top index to identify the most recently pushed array element."
  }),
  stackProgram({
    slug: "dsa-stack-linked-list",
    title: "Implement a Stack Using a Linked List",
    source: cMain(`    struct Node *top = NULL;
    push(&top, 10); push(&top, 20); push(&top, 30);
    printf("Popped = %d\\n", pop(&top));
    printf("Top = %d\\n", top->data);
    while (top != NULL) pop(&top);
    return 0;`, ["stdio.h", "stdlib.h"], `struct Node { int data; struct Node *next; };
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
}`),
    sampleInput: "No input required",
    sampleOutput: "Popped = 30\nTop = 20",
    time: "O(1) per operation",
    method: "Treat the list head as the stack top for constant-time insertion and deletion."
  }),
  stackProgram({
    slug: "dsa-balanced-parentheses",
    title: "Check Balanced Parentheses Using a Stack",
    source: cMain(`    const char expression[] = "{[a+(b*c)]-d}";
    char stack[50];
    int top = -1, balanced = 1;
    for (size_t index = 0; expression[index] != '\\0'; index++) {
        char token = expression[index];
        if (token == '(' || token == '[' || token == '{') stack[++top] = token;
        else if (token == ')' || token == ']' || token == '}') {
            if (top < 0 || !matches(stack[top--], token)) { balanced = 0; break; }
        }
    }
    if (top != -1) balanced = 0;
    puts(balanced ? "Balanced." : "Not balanced.");
    return 0;`, ["stdio.h", "stddef.h"], `int matches(char opening, char closing)
{
    return (opening == '(' && closing == ')') ||
           (opening == '[' && closing == ']') ||
           (opening == '{' && closing == '}');
}`),
    sampleInput: "No input required",
    sampleOutput: "Balanced.",
    method: "Push openings and require every closing symbol to match the latest unmatched opening."
  }),
  stackProgram({
    slug: "dsa-infix-to-postfix",
    title: "Convert an Infix Expression to Postfix",
    difficulty: "Advanced",
    source: cMain(`    const char infix[] = "A+B*C";
    char operators[50], postfix[50];
    int top = -1, write = 0;
    for (size_t index = 0; infix[index] != '\\0'; index++) {
        char token = infix[index];
        if (isalnum((unsigned char) token)) postfix[write++] = token;
        else {
            while (top >= 0 && precedence(operators[top]) >= precedence(token))
                postfix[write++] = operators[top--];
            operators[++top] = token;
        }
    }
    while (top >= 0) postfix[write++] = operators[top--];
    postfix[write] = '\\0';
    printf("Postfix = %s\\n", postfix);
    return 0;`, ["stdio.h", "ctype.h", "stddef.h"], `int precedence(char operator)
{
    if (operator == '*' || operator == '/') return 2;
    if (operator == '+' || operator == '-') return 1;
    return 0;
}`),
    sampleInput: "No input required",
    sampleOutput: "Postfix = ABC*+",
    method: "Send operands directly to output and delay operators on a precedence-controlled stack."
  }),
  stackProgram({
    slug: "dsa-evaluate-postfix",
    title: "Evaluate a Postfix Expression",
    source: cMain(`    const char postfix[] = "23*54*+9-";
    struct Stack stack; stack_init(&stack);
    for (size_t index = 0; postfix[index] != '\\0'; index++) {
        char token = postfix[index];
        if (isdigit((unsigned char) token)) stack_push(&stack, token - '0');
        else {
            int right = stack_pop(&stack), left = stack_pop(&stack);
            switch (token) {
                case '+': stack_push(&stack, left + right); break;
                case '-': stack_push(&stack, left - right); break;
                case '*': stack_push(&stack, left * right); break;
                case '/': stack_push(&stack, left / right); break;
            }
        }
    }
    printf("Value = %d\\n", stack_pop(&stack));
    return 0;`, ["stdio.h", "stdlib.h", "ctype.h", "stddef.h"], arrayStack),
    sampleInput: "No input required",
    sampleOutput: "Value = 17",
    method: "Push operands and replace each operator with the result of its two latest operands."
  }),
  stackProgram({
    slug: "dsa-evaluate-prefix",
    title: "Evaluate a Prefix Expression",
    source: cMain(`    const char prefix[] = "-+7*45+20";
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
    printf("Value = %d\\n", stack_pop(&stack));
    return 0;`, ["stdio.h", "stdlib.h", "ctype.h", "string.h"], arrayStack),
    sampleInput: "No input required",
    sampleOutput: "Value = 25",
    method: "Scan from right to left, pushing operands and applying each operator in left-right order."
  }),
  stackProgram({
    slug: "dsa-reverse-string-stack",
    title: "Reverse a String Using a Stack",
    source: cMain(`    char text[] = "STACK";
    char stack[20];
    int top = -1;
    for (size_t index = 0; text[index] != '\\0'; index++) stack[++top] = text[index];
    for (size_t index = 0; text[index] != '\\0'; index++) text[index] = stack[top--];
    printf("Reversed = %s\\n", text);
    return 0;`, ["stdio.h", "stddef.h"]),
    sampleInput: "No input required",
    sampleOutput: "Reversed = KCATS",
    method: "Push characters in normal order and pop them in reverse order."
  }),
  stackProgram({
    slug: "dsa-next-greater-element",
    title: "Find Next Greater Elements with a Monotonic Stack",
    difficulty: "Intermediate",
    source: cMain(`    int values[] = {4, 5, 2, 10, 8};
    int result[5], stack[5], top = -1;
    for (int index = 4; index >= 0; index--) {
        while (top >= 0 && stack[top] <= values[index]) top--;
        result[index] = top < 0 ? -1 : stack[top];
        stack[++top] = values[index];
    }
    for (int index = 0; index < 5; index++) printf("%d ", result[index]);
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "5 10 10 -1 -1",
    time: "O(n)",
    method: "Keep only useful larger values to the right in a decreasing stack."
  }),
  stackProgram({
    slug: "dsa-stock-span",
    title: "Calculate Stock Span with a Monotonic Stack",
    difficulty: "Intermediate",
    source: cMain(`    int prices[] = {100, 80, 60, 70, 60, 75, 85};
    int stack[7], top = -1, spans[7];
    for (int day = 0; day < 7; day++) {
        while (top >= 0 && prices[stack[top]] <= prices[day]) top--;
        spans[day] = top < 0 ? day + 1 : day - stack[top];
        stack[++top] = day;
    }
    for (int day = 0; day < 7; day++) printf("%d ", spans[day]);
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "1 1 1 2 1 4 6",
    time: "O(n)",
    method: "Store indices of previous greater prices and discard smaller prices permanently."
  }),
  stackProgram({
    slug: "dsa-two-stacks-one-array",
    title: "Implement Two Stacks in One Array",
    source: cMain(`    int values[8];
    int first_top = -1, second_top = 8;
    values[++first_top] = 10;
    values[++first_top] = 20;
    values[--second_top] = 90;
    values[--second_top] = 80;
    printf("Stack 1 top = %d\\n", values[first_top]);
    printf("Stack 2 top = %d\\n", values[second_top]);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Stack 1 top = 20\nStack 2 top = 80",
    time: "O(1) per operation",
    method: "Grow one stack from the left and the other from the right until their tops meet."
  }),
  stackProgram({
    slug: "dsa-min-stack",
    title: "Implement a Stack with Constant-Time Minimum",
    source: cMain(`    int values[] = {5, 2, 8, 1, 4};
    struct Stack data, minimums;
    stack_init(&data); stack_init(&minimums);
    for (int index = 0; index < 5; index++) {
        stack_push(&data, values[index]);
        if (stack_empty(&minimums) || values[index] <= stack_peek(&minimums))
            stack_push(&minimums, values[index]);
    }
    printf("Minimum = %d\\n", stack_peek(&minimums));
    int removed = stack_pop(&data);
    if (removed == stack_peek(&minimums)) stack_pop(&minimums);
    printf("After pop, minimum = %d\\n", stack_peek(&minimums));
    return 0;`, ["stdio.h", "stdlib.h"], arrayStack),
    sampleInput: "No input required",
    sampleOutput: "Minimum = 1\nAfter pop, minimum = 1",
    time: "O(1) per operation",
    method: "Maintain a second stack containing the minimum values active at each depth."
  }),
  stackProgram({
    slug: "dsa-reverse-stack-recursion",
    title: "Reverse a Stack Using Recursion",
    difficulty: "Advanced",
    source: cMain(`    struct Stack stack; stack_init(&stack);
    stack_push(&stack, 10); stack_push(&stack, 20); stack_push(&stack, 30);
    reverse_stack(&stack);
    while (!stack_empty(&stack)) printf("%d ", stack_pop(&stack));
    putchar('\\n');
    return 0;`, ["stdio.h", "stdlib.h"], arrayStack + `
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
}`),
    sampleInput: "No input required",
    sampleOutput: "10 20 30",
    time: "O(n²)",
    space: "O(n) call stack",
    method: "Recursively remove each top value and insert it beneath all remaining values."
  })
];
