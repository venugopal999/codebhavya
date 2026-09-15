#include <stdio.h>
#include <ctype.h>
#include <stddef.h>

int precedence(char operator)
{
    if (operator == '*' || operator == '/') return 2;
    if (operator == '+' || operator == '-') return 1;
    return 0;
}

int main(void)
{
    const char infix[] = "A+B*C";
    char operators[50], postfix[50];
    int top = -1, write = 0;
    for (size_t index = 0; infix[index] != '\0'; index++) {
        char token = infix[index];
        if (isalnum((unsigned char) token)) postfix[write++] = token;
        else {
            while (top >= 0 && precedence(operators[top]) >= precedence(token))
                postfix[write++] = operators[top--];
            operators[++top] = token;
        }
    }
    while (top >= 0) postfix[write++] = operators[top--];
    postfix[write] = '\0';
    printf("Postfix = %s\n", postfix);
    return 0;
}
