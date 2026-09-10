#include <stdio.h>

int has_cycle(int vertex, int parent, int graph[4][4], int visited[4])
{
    visited[vertex] = 1;
    for (int neighbour = 0; neighbour < 4; neighbour++) if (graph[vertex][neighbour]) {
        if (!visited[neighbour]) {
            if (has_cycle(neighbour, vertex, graph, visited)) return 1;
        } else if (neighbour != parent) return 1;
    }
    return 0;
}

int main(void)
{
    int graph[4][4] = {
        {0,1,1,0}, {1,0,1,0}, {1,1,0,1}, {0,0,1,0}
    };
    int visited[4] = {0};
    puts(has_cycle(0, -1, graph, visited) ? "Cycle detected." : "No cycle.");
    return 0;
}
