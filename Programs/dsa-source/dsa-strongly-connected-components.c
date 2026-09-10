#include <stdio.h>

void finish(int vertex, int graph[5][5], int visited[5], int order[5], int *top)
{
    visited[vertex] = 1;
    for (int next = 0; next < 5; next++)
        if (graph[vertex][next] && !visited[next]) finish(next, graph, visited, order, top);
    order[(*top)++] = vertex;
}
void mark(int vertex, int graph[5][5], int visited[5])
{
    visited[vertex] = 1;
    for (int next = 0; next < 5; next++)
        if (graph[vertex][next] && !visited[next]) mark(next, graph, visited);
}

int main(void)
{
    int graph[5][5] = {{0}}, transpose[5][5] = {{0}};
    int edges[][2] = {{1,0},{0,2},{2,1},{0,3},{3,4}};
    for (int index = 0; index < 5; index++) {
        graph[edges[index][0]][edges[index][1]] = 1;
        transpose[edges[index][1]][edges[index][0]] = 1;
    }
    int visited[5] = {0}, order[5], top = 0;
    for (int vertex = 0; vertex < 5; vertex++)
        if (!visited[vertex]) finish(vertex, graph, visited, order, &top);
    for (int vertex = 0; vertex < 5; vertex++) visited[vertex] = 0;
    int components = 0;
    while (top > 0) {
        int vertex = order[--top];
        if (!visited[vertex]) { mark(vertex, transpose, visited); components++; }
    }
    printf("Strongly connected components = %d\n", components);
    return 0;
}
