#include <stdio.h>

int main(void)
{
    int queue[] = {10, 20, 30, 40};
    int stack[4], top = -1;
    for (int front = 0; front < 4; front++) stack[++top] = queue[front];
    for (int rear = 0; rear < 4; rear++) queue[rear] = stack[top--];
    for (int index = 0; index < 4; index++) printf("%d ", queue[index]);
    putchar('\n');
    return 0;
}
