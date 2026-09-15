#include <stdio.h>

int main(void)
{
    unsigned int queue[20];
    int front = 0, rear = 0;
    queue[rear++] = 1;
    for (int count = 0; count < 8; count++) {
        unsigned int current = queue[front++];
        printf("%u ", current);
        queue[rear++] = current * 10;
        queue[rear++] = current * 10 + 1;
    }
    putchar('\n');
    return 0;
}
