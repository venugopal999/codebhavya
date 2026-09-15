#include <stdio.h>

int directed_cycle(int vertex, int graph[4][4], int color[4])
{
    color[vertex] = 1;
    for (int neighbour = 0; neighbour < 4; neighbour++) if (graph[vertex][neighbour]) {
        if (color[neighbour] == 1) return 1;
        if (color[neighbour] == 0 && directed_cycle(neighbour, graph, color)) return 1;
    }
    color[vertex] = 2;
    return 0;
}

int main(void)
{
    int graph[4][4] = {
        {0,1,0,0}, {0,0,1,0}, {1,0,0,1}, {0,0,0,0}
    };
    int color[4] = {0}, cycle = 0;
    for (int vertex = 0; vertex < 4 && !cycle; vertex++)
        if (color[vertex] == 0) cycle = directed_cycle(vertex, graph, color);
    puts(cycle ? "Cycle detected." : "No cycle.");
    return 0;
}
