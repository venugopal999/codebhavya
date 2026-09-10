#include <stdio.h>

int main(void)
{
    int queue[10], front = 0, rear = 0;
    queue[rear++] = 10; queue[rear++] = 20; queue[rear++] = 30;
    printf("Removed = %d\n", queue[front++]);
    printf("Front = %d\n", queue[front]);
    return 0;
}
