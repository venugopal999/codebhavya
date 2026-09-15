#include <stdio.h>

void mark(int vertex, int graph[6][6], int visited[6])
{
    visited[vertex] = 1;
    for (int neighbour = 0; neighbour < 6; neighbour++)
        if (graph[vertex][neighbour] && !visited[neighbour]) mark(neighbour, graph, visited);
}

int main(void)
{
    int graph[6][6] = {
        {0,1,0,0,0,0}, {1,0,1,0,0,0}, {0,1,0,0,0,0},
        {0,0,0,0,1,0}, {0,0,0,1,0,1}, {0,0,0,0,1,0}
    };
    int visited[6] = {0}, components = 0;
    for (int vertex = 0; vertex < 6; vertex++)
        if (!visited[vertex]) { mark(vertex, graph, visited); components++; }
    printf("Components = %d\n", components);
    return 0;
}
