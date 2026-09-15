#include <stdio.h>

void topo(int vertex, int graph[6][6], int visited[6], int stack[6], int *top)
{
    visited[vertex] = 1;
    for (int neighbour = 0; neighbour < 6; neighbour++)
        if (graph[vertex][neighbour] && !visited[neighbour]) topo(neighbour, graph, visited, stack, top);
    stack[(*top)++] = vertex;
}

int main(void)
{
    int graph[6][6] = {{0}};
    int edges[][2] = {{5,2},{5,0},{4,0},{4,1},{2,3},{3,1}};
    for (int index = 0; index < 6; index++) graph[edges[index][0]][edges[index][1]] = 1;
    int visited[6] = {0}, stack[6], top = 0;
    for (int vertex = 0; vertex < 6; vertex++)
        if (!visited[vertex]) topo(vertex, graph, visited, stack, &top);
    while (top > 0) printf("%d ", stack[--top]);
    putchar('\n');
    return 0;
}
