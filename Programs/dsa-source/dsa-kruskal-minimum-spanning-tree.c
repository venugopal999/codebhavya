#include <stdio.h>
#include <stdlib.h>

struct Edge { int source; int destination; int weight; };
int compare_edges(const void *left, const void *right)
{
    const struct Edge *first = left, *second = right;
    return (first->weight > second->weight) - (first->weight < second->weight);
}
int find(int parent[], int value)
{
    if (parent[value] != value) parent[value] = find(parent, parent[value]);
    return parent[value];
}

int main(void)
{
    struct Edge edges[] = {{0, 1, 10}, {0, 2, 6}, {0, 3, 5}, {1, 3, 15}, {2, 3, 4}};
    qsort(edges, 5, sizeof edges[0], compare_edges);
    int parent[] = {0, 1, 2, 3}, selected = 0, cost = 0;
    for (int index = 0; index < 5 && selected < 3; index++) {
        int first = find(parent, edges[index].source);
        int second = find(parent, edges[index].destination);
        if (first != second) {
            parent[second] = first; cost += edges[index].weight; selected++;
            printf("%d-%d(%d) ", edges[index].source, edges[index].destination, edges[index].weight);
        }
    }
    printf("\nCost = %d\n", cost);
    return 0;
}
