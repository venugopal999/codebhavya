#include <stdio.h>

void ap_dfs(int vertex, int graph[5][5], int visited[5], int discovery[5],
            int low[5], int parent[5], int articulation[5], int *time)
{
    visited[vertex] = 1; discovery[vertex] = low[vertex] = ++(*time);
    int children = 0;
    for (int neighbour = 0; neighbour < 5; neighbour++) if (graph[vertex][neighbour]) {
        if (!visited[neighbour]) {
            children++; parent[neighbour] = vertex;
            ap_dfs(neighbour, graph, visited, discovery, low, parent, articulation, time);
            if (low[neighbour] < low[vertex]) low[vertex] = low[neighbour];
            if (parent[vertex] == -1 && children > 1) articulation[vertex] = 1;
            if (parent[vertex] != -1 && low[neighbour] >= discovery[vertex]) articulation[vertex] = 1;
        } else if (neighbour != parent[vertex] && discovery[neighbour] < low[vertex])
            low[vertex] = discovery[neighbour];
    }
}

int main(void)
{
    int graph[5][5] = {
        {0,1,1,1,0}, {1,0,1,0,0}, {1,1,0,0,0}, {1,0,0,0,1}, {0,0,0,1,0}
    };
    int visited[5] = {0}, discovery[5], low[5], parent[5] = {-1,-1,-1,-1,-1};
    int articulation[5] = {0}, time = 0;
    ap_dfs(0, graph, visited, discovery, low, parent, articulation, &time);
    printf("Articulation points: ");
    for (int vertex = 0; vertex < 5; vertex++) if (articulation[vertex]) printf("%d ", vertex);
    putchar('\n');
    return 0;
}
