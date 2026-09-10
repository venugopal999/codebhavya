#include <stdio.h>
#include <limits.h>

int main(void)
{
    int graph[5][5] = {
        {0,10,0,5,0}, {0,0,1,2,0}, {0,0,0,0,4},
        {0,3,9,0,2}, {7,0,6,0,0}
    };
    int distance[5] = {0, INT_MAX, INT_MAX, INT_MAX, INT_MAX};
    int used[5] = {0};
    for (int step = 0; step < 5; step++) {
        int vertex = -1;
        for (int candidate = 0; candidate < 5; candidate++)
            if (!used[candidate] && (vertex < 0 || distance[candidate] < distance[vertex])) vertex = candidate;
        used[vertex] = 1;
        for (int neighbour = 0; neighbour < 5; neighbour++)
            if (graph[vertex][neighbour] && distance[vertex] != INT_MAX &&
                distance[vertex] + graph[vertex][neighbour] < distance[neighbour])
                distance[neighbour] = distance[vertex] + graph[vertex][neighbour];
    }
    for (int vertex = 0; vertex < 5; vertex++) printf("%d ", distance[vertex]);
    putchar('\n');
    return 0;
}
