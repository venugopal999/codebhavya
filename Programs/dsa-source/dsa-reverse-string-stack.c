#include <stdio.h>
#include <stddef.h>

int main(void)
{
    char text[] = "STACK";
    char stack[20];
    int top = -1;
    for (size_t index = 0; text[index] != '\0'; index++) stack[++top] = text[index];
    for (size_t index = 0; text[index] != '\0'; index++) text[index] = stack[top--];
    printf("Reversed = %s\n", text);
    return 0;
}
