#include <stdio.h>
#include <stddef.h>

int matches(char opening, char closing)
{
    return (opening == '(' && closing == ')') ||
           (opening == '[' && closing == ']') ||
           (opening == '{' && closing == '}');
}

int main(void)
{
    const char expression[] = "{[a+(b*c)]-d}";
    char stack[50];
    int top = -1, balanced = 1;
    for (size_t index = 0; expression[index] != '\0'; index++) {
        char token = expression[index];
        if (token == '(' || token == '[' || token == '{') stack[++top] = token;
        else if (token == ')' || token == ']' || token == '}') {
            if (top < 0 || !matches(stack[top--], token)) { balanced = 0; break; }
        }
    }
    if (top != -1) balanced = 0;
    puts(balanced ? "Balanced." : "Not balanced.");
    return 0;
}
