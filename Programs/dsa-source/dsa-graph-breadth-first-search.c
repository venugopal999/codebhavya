#include <stdio.h>

int main(void)
{
    int graph[5][5] = {
        {0,1,1,0,0}, {1,0,0,1,0}, {1,0,0,1,1}, {0,1,1,0,0}, {0,0,1,0,0}
    };
    int visited[5] = {0}, queue[5], front = 0, rear = 0;
    visited[0] = 1; queue[rear++] = 0;
    while (front < rear) {
        int vertex = queue[front++];
        printf("%d ", vertex);
        for (int neighbour = 0; neighbour < 5; neighbour++)
            if (graph[vertex][neighbour] && !visited[neighbour]) {
                visited[neighbour] = 1; queue[rear++] = neighbour;
            }
    }
    putchar('\n');
    return 0;
}
