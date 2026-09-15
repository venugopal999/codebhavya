#include <stdio.h>
#include <limits.h>

struct Edge { int from; int to; int weight; };

int main(void)
{
    struct Edge edges[] = {
        {0,1,-1},{0,2,4},{1,2,3},{1,3,2},{1,4,2},{3,2,5},{3,1,1},{4,3,-3}
    };
    int distance[5] = {0, INT_MAX, INT_MAX, INT_MAX, INT_MAX};
    for (int pass = 1; pass < 5; pass++)
        for (int index = 0; index < 8; index++) {
            int from = edges[index].from, to = edges[index].to, weight = edges[index].weight;
            if (distance[from] != INT_MAX && distance[from] + weight < distance[to])
                distance[to] = distance[from] + weight;
        }
    for (int vertex = 0; vertex < 5; vertex++) printf("%d ", distance[vertex]);
    putchar('\n');
    return 0;
}
