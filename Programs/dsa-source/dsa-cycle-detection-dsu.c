#include <stdio.h>

struct Edge { int source; int destination; };
int find(int parent[], int value)
{
    while (parent[value] != value) value = parent[value];
    return value;
}

int main(void)
{
    struct Edge edges[] = {{0, 1}, {1, 2}, {2, 0}};
    int parent[] = {0, 1, 2}, cycle = 0;
    for (int index = 0; index < 3; index++) {
        int first = find(parent, edges[index].source);
        int second = find(parent, edges[index].destination);
        if (first == second) { cycle = 1; break; }
        parent[second] = first;
    }
    puts(cycle ? "Cycle detected." : "No cycle.");
    return 0;
}
