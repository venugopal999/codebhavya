#include <stdio.h>

int parent[10], rank_value[10], set_size[10];
void initialize(int count) { for (int i = 0; i < count; i++) { parent[i] = i; rank_value[i] = 0; set_size[i] = 1; } }
int find_root(int value) { return parent[value] == value ? value : (parent[value] = find_root(parent[value])); }
void unite_rank(int first, int second)
{
    first = find_root(first); second = find_root(second);
    if (first == second) return;
    if (rank_value[first] < rank_value[second]) { int temp = first; first = second; second = temp; }
    parent[second] = first; set_size[first] += set_size[second];
    if (rank_value[first] == rank_value[second]) rank_value[first]++;
}

int main(void)
{
    initialize(4);
    int edges[][2] = {{0, 1}, {1, 2}, {2, 0}, {2, 3}};
    for (int edge = 0; edge < 4; edge++) {
        int first = edges[edge][0], second = edges[edge][1];
        if (find_root(first) == find_root(second)) { printf("Redundant = %d-%d\n", first, second); break; }
        unite_rank(first, second);
    }
    return 0;
}
