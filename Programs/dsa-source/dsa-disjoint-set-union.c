#include <stdio.h>

int find(int parent[], int value)
{
    if (parent[value] != value) parent[value] = find(parent, parent[value]);
    return parent[value];
}
void unite(int parent[], int rank[], int first, int second)
{
    int left = find(parent, first), right = find(parent, second);
    if (left == right) return;
    if (rank[left] < rank[right]) parent[left] = right;
    else if (rank[left] > rank[right]) parent[right] = left;
    else { parent[right] = left; rank[left]++; }
}

int main(void)
{
    int parent[6], rank[6] = {0};
    for (int index = 0; index < 6; index++) parent[index] = index;
    unite(parent, rank, 0, 1); unite(parent, rank, 1, 2); unite(parent, rank, 3, 4);
    printf("0 and 2 connected: %s\n", find(parent, 0) == find(parent, 2) ? "yes" : "no");
    printf("0 and 4 connected: %s\n", find(parent, 0) == find(parent, 4) ? "yes" : "no");
    return 0;
}
