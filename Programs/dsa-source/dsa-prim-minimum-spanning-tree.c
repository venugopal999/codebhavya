#include <stdio.h>
#include <limits.h>

int main(void)
{
    int graph[5][5] = {
        {0,2,0,6,0}, {2,0,3,8,5}, {0,3,0,0,7}, {6,8,0,0,9}, {0,5,7,9,0}
    };
    int key[5] = {0, INT_MAX, INT_MAX, INT_MAX, INT_MAX};
    int parent[5] = {-1,-1,-1,-1,-1}, used[5] = {0};
    for (int step = 0; step < 5; step++) {
        int vertex = -1;
        for (int candidate = 0; candidate < 5; candidate++)
            if (!used[candidate] && (vertex < 0 || key[candidate] < key[vertex])) vertex = candidate;
        used[vertex] = 1;
        for (int neighbour = 0; neighbour < 5; neighbour++)
            if (graph[vertex][neighbour] && !used[neighbour] && graph[vertex][neighbour] < key[neighbour]) {
                key[neighbour] = graph[vertex][neighbour]; parent[neighbour] = vertex;
            }
    }
    int cost = 0;
    for (int vertex = 1; vertex < 5; vertex++) {
        printf("%d-%d(%d) ", parent[vertex], vertex, graph[parent[vertex]][vertex]);
        cost += graph[parent[vertex]][vertex];
    }
    printf("\nCost = %d\n", cost);
    return 0;
}
