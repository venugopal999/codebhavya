#include <stdio.h>

int main(void)
{
    int parent[] = {0, 1, 2, 3, 4};
    parent[1] = 0; parent[2] = 1;
    int root0 = 0, root2 = 2;
    while (parent[root0] != root0) root0 = parent[root0];
    while (parent[root2] != root2) root2 = parent[root2];
    printf("Connected = %s\n", root0 == root2 ? "Yes" : "No");
    return 0;
}
