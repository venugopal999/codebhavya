#include <stdio.h>

int main(void)
{
    int graph[6][6] = {{0}};
    int edges[][2] = {{5,2},{5,0},{4,0},{4,1},{2,3},{3,1}};
    int indegree[6] = {0};
    for (int index = 0; index < 6; index++) {
        graph[edges[index][0]][edges[index][1]] = 1;
        indegree[edges[index][1]]++;
    }
    int queue[6], front = 0, rear = 0;
    for (int vertex = 0; vertex < 6; vertex++) if (indegree[vertex] == 0) queue[rear++] = vertex;
    while (front < rear) {
        int vertex = queue[front++]; printf("%d ", vertex);
        for (int neighbour = 0; neighbour < 6; neighbour++)
            if (graph[vertex][neighbour] && --indegree[neighbour] == 0) queue[rear++] = neighbour;
    }
    putchar('\n');
    return 0;
}
