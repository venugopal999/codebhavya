#include <stdio.h>

int main(void)
{
    int values[] = {4, 5, 2, 10, 8};
    int result[5], stack[5], top = -1;
    for (int index = 4; index >= 0; index--) {
        while (top >= 0 && stack[top] <= values[index]) top--;
        result[index] = top < 0 ? -1 : stack[top];
        stack[++top] = values[index];
    }
    for (int index = 0; index < 5; index++) printf("%d ", result[index]);
    putchar('\n');
    return 0;
}
