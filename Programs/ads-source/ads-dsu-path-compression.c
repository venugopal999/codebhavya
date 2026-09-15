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
    initialize(5);
    parent[4] = 3; parent[3] = 2; parent[2] = 1; parent[1] = 0;
    printf("Before = %d ", parent[4]);
    find_root(4);
    printf("After = %d\n", parent[4]);
    return 0;
}
