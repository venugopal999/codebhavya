#include <ctype.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_EXPRESSION 256
#define MAX_STACK 128

typedef struct {
    char items[MAX_STACK];
    int top;
} OperatorStack;

typedef struct {
    long long items[MAX_STACK];
    int top;
} ValueStack;

static int isOperator(char ch) {
    return ch == '+' || ch == '-' || ch == '*' || ch == '/' ||
           ch == '%' || ch == '^';
}

static int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/' || op == '%') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

static int isRightAssociative(char op) {
    return op == '^';
}

static int pushOperator(OperatorStack *stack, char value) {
    if (stack->top == MAX_STACK - 1) return 0;
    stack->items[++stack->top] = value;
    return 1;
}

static int popOperator(OperatorStack *stack, char *value) {
    if (stack->top < 0) return 0;
    *value = stack->items[stack->top--];
    return 1;
}

static int pushValue(ValueStack *stack, long long value) {
    if (stack->top == MAX_STACK - 1) return 0;
    stack->items[++stack->top] = value;
    return 1;
}

static int popValue(ValueStack *stack, long long *value) {
    if (stack->top < 0) return 0;
    *value = stack->items[stack->top--];
    return 1;
}

static int appendToken(char *postfix, size_t capacity, const char *token) {
    size_t used = strlen(postfix);
    int written;

    if (used >= capacity) return 0;
    written = snprintf(postfix + used, capacity - used, "%s ", token);
    return written > 0 && (size_t)written < capacity - used;
}

static int appendOperator(char *postfix, size_t capacity, char op) {
    char token[2] = {op, '\0'};
    return appendToken(postfix, capacity, token);
}

static int infixToPostfix(const char *infix, char *postfix, size_t capacity,
                          char *error, size_t errorSize) {
    OperatorStack operators = {{0}, -1};
    size_t i = 0;
    int expectOperand = 1;
    int sawOperand = 0;

    postfix[0] = '\0';

    while (infix[i] != '\0') {
        if (isspace((unsigned char)infix[i])) {
            ++i;
            continue;
        }

        if (isdigit((unsigned char)infix[i])) {
            char number[32];
            size_t start = i;
            size_t length;

            if (!expectOperand) {
                snprintf(error, errorSize, "Missing operator before position %zu.", i + 1);
                return 0;
            }
            while (isdigit((unsigned char)infix[i])) ++i;
            length = i - start;
            if (length >= sizeof(number)) {
                snprintf(error, errorSize, "Number at position %zu is too long.", start + 1);
                return 0;
            }
            memcpy(number, infix + start, length);
            number[length] = '\0';
            if (!appendToken(postfix, capacity, number)) {
                snprintf(error, errorSize, "Postfix output is too long.");
                return 0;
            }
            expectOperand = 0;
            sawOperand = 1;
            continue;
        }

        if (infix[i] == '(') {
            if (!expectOperand) {
                snprintf(error, errorSize, "Missing operator before '('.");
                return 0;
            }
            if (!pushOperator(&operators, '(')) {
                snprintf(error, errorSize, "Operator stack overflow.");
                return 0;
            }
            ++i;
            continue;
        }

        if (infix[i] == ')') {
            char op;
            int matched = 0;

            if (expectOperand) {
                snprintf(error, errorSize, "Unexpected ')' at position %zu.", i + 1);
                return 0;
            }
            while (popOperator(&operators, &op)) {
                if (op == '(') {
                    matched = 1;
                    break;
                }
                if (!appendOperator(postfix, capacity, op)) {
                    snprintf(error, errorSize, "Postfix output is too long.");
                    return 0;
                }
            }
            if (!matched) {
                snprintf(error, errorSize, "Unmatched ')' at position %zu.", i + 1);
                return 0;
            }
            expectOperand = 0;
            ++i;
            continue;
        }

        if (isOperator(infix[i])) {
            char incoming = infix[i];

            if (expectOperand) {
                snprintf(error, errorSize,
                         "Operator '%c' has no left operand at position %zu.",
                         incoming, i + 1);
                return 0;
            }

            while (operators.top >= 0 &&
                   operators.items[operators.top] != '(' &&
                   (precedence(operators.items[operators.top]) > precedence(incoming) ||
                    (precedence(operators.items[operators.top]) == precedence(incoming) &&
                     !isRightAssociative(incoming)))) {
                char op;
                popOperator(&operators, &op);
                if (!appendOperator(postfix, capacity, op)) {
                    snprintf(error, errorSize, "Postfix output is too long.");
                    return 0;
                }
            }
            if (!pushOperator(&operators, incoming)) {
                snprintf(error, errorSize, "Operator stack overflow.");
                return 0;
            }
            expectOperand = 1;
            ++i;
            continue;
        }

        snprintf(error, errorSize, "Unsupported character '%c' at position %zu.",
                 infix[i], i + 1);
        return 0;
    }

    if (!sawOperand) {
        snprintf(error, errorSize, "Expression is empty.");
        return 0;
    }
    if (expectOperand) {
        snprintf(error, errorSize, "Expression cannot end with an operator.");
        return 0;
    }

    while (operators.top >= 0) {
        char op;
        popOperator(&operators, &op);
        if (op == '(') {
            snprintf(error, errorSize, "Unmatched '('.");
            return 0;
        }
        if (!appendOperator(postfix, capacity, op)) {
            snprintf(error, errorSize, "Postfix output is too long.");
            return 0;
        }
    }
    return 1;
}

static int integerPower(long long base, long long exponent, long long *result) {
    long long answer = 1;

    if (exponent < 0) return 0;
    while (exponent > 0) {
        if (exponent % 2 == 1) answer *= base;
        exponent /= 2;
        if (exponent > 0) base *= base;
    }
    *result = answer;
    return 1;
}

static int applyOperator(long long left, long long right, char op,
                         long long *result, char *error, size_t errorSize) {
    switch (op) {
        case '+': *result = left + right; return 1;
        case '-': *result = left - right; return 1;
        case '*': *result = left * right; return 1;
        case '/':
            if (right == 0) {
                snprintf(error, errorSize, "Division by zero.");
                return 0;
            }
            *result = left / right;
            return 1;
        case '%':
            if (right == 0) {
                snprintf(error, errorSize, "Modulo by zero.");
                return 0;
            }
            *result = left % right;
            return 1;
        case '^':
            if (!integerPower(left, right, result)) {
                snprintf(error, errorSize, "Negative exponents are not supported.");
                return 0;
            }
            return 1;
        default:
            snprintf(error, errorSize, "Unknown operator '%c'.", op);
            return 0;
    }
}

static int evaluatePostfix(char *postfix, long long *result,
                           char *error, size_t errorSize) {
    ValueStack values = {{0}, -1};
    char *token = strtok(postfix, " ");

    while (token != NULL) {
        if (strlen(token) == 1 && isOperator(token[0])) {
            long long left, right, answer;
            if (!popValue(&values, &right) || !popValue(&values, &left)) {
                snprintf(error, errorSize, "Operator '%c' has too few operands.", token[0]);
                return 0;
            }
            if (!applyOperator(left, right, token[0], &answer, error, errorSize) ||
                !pushValue(&values, answer)) {
                if (error[0] == '\0') snprintf(error, errorSize, "Value stack overflow.");
                return 0;
            }
        } else {
            char *end;
            long long value = strtoll(token, &end, 10);
            if (*end != '\0' || !pushValue(&values, value)) {
                snprintf(error, errorSize, "Invalid value token '%s'.", token);
                return 0;
            }
        }
        token = strtok(NULL, " ");
    }

    if (!popValue(&values, result) || values.top != -1) {
        snprintf(error, errorSize, "Expression leaves an invalid value stack.");
        return 0;
    }
    return 1;
}

int main(void) {
    char infix[MAX_EXPRESSION];
    char postfix[MAX_EXPRESSION * 2];
    char evaluationCopy[MAX_EXPRESSION * 2];
    char error[120] = "";
    long long result;

    puts("Expression Calculator using Stacks");
    puts("Supported: non-negative integers, (), +, -, *, /, %, ^");
    puts("Note: division is integer division; unary minus is not supported.");
    printf("Enter an infix expression: ");

    if (fgets(infix, sizeof(infix), stdin) == NULL) {
        puts("No expression was entered.");
        return 1;
    }
    infix[strcspn(infix, "\n")] = '\0';

    if (!infixToPostfix(infix, postfix, sizeof(postfix), error, sizeof(error))) {
        printf("Invalid expression: %s\n", error);
        return 1;
    }

    strcpy(evaluationCopy, postfix);
    if (!evaluatePostfix(evaluationCopy, &result, error, sizeof(error))) {
        printf("Evaluation error: %s\n", error);
        return 1;
    }

    printf("Postfix expression: %s\n", postfix);
    printf("Result: %lld\n", result);
    return 0;
}
