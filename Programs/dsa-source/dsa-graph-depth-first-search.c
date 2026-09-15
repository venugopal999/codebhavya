#include <stdio.h>

void dfs(int vertex, int graph[5][5], int visited[5])
{
    visited[vertex] = 1; printf("%d ", vertex);
    for (int neighbour = 0; neighbour < 5; neighbour++)
        if (graph[vertex][neighbour] && !visited[neighbour]) dfs(neighbour, graph, visited);
}

int main(void)
{
    int graph[5][5] = {
        {0,1,1,0,0}, {1,0,0,1,0}, {1,0,0,1,1}, {0,1,1,0,0}, {0,0,1,0,0}
    };
    int visited[5] = {0};
    dfs(0, graph, visited);
    putchar('\n');
    return 0;
}
