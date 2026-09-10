#include <stdio.h>

int main(void)
{
    int graph[6][6] = {
        {0,1,1,0,0,0}, {1,0,0,1,0,0}, {1,0,0,1,1,0},
        {0,1,1,0,0,1}, {0,0,1,0,0,1}, {0,0,0,1,1,0}
    };
    int distance[6] = {-1,-1,-1,-1,-1,-1}, queue[6], front = 0, rear = 0;
    distance[0] = 0; queue[rear++] = 0;
    while (front < rear) {
        int vertex = queue[front++];
        for (int neighbour = 0; neighbour < 6; neighbour++)
            if (graph[vertex][neighbour] && distance[neighbour] < 0) {
                distance[neighbour] = distance[vertex] + 1; queue[rear++] = neighbour;
            }
    }
    for (int vertex = 0; vertex < 6; vertex++) printf("%d ", distance[vertex]);
    putchar('\n');
    return 0;
}
