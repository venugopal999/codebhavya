#include <stdio.h>
#include <stdlib.h>

struct Node { int vertex; struct Node *next; };
void add_one(struct Node *graph[], int from, int to)
{
    struct Node *node = malloc(sizeof *node);
    if (node == NULL) exit(EXIT_FAILURE);
    node->vertex = to; node->next = graph[from]; graph[from] = node;
}
void add_edge(struct Node *graph[], int first, int second)
{
    add_one(graph, first, second); add_one(graph, second, first);
}
void clear_graph(struct Node *graph[], int vertices)
{
    for (int vertex = 0; vertex < vertices; vertex++)
        while (graph[vertex] != NULL) {
            struct Node *removed = graph[vertex];
            graph[vertex] = removed->next; free(removed);
        }
}

int main(void)
{
    struct Node *graph[4] = {NULL};
    add_edge(graph, 0, 1); add_edge(graph, 0, 2); add_edge(graph, 1, 3);
    for (int vertex = 0; vertex < 4; vertex++) {
        printf("%d:", vertex);
        for (struct Node *node = graph[vertex]; node != NULL; node = node->next)
            printf(" %d", node->vertex);
        putchar('\n');
    }
    clear_graph(graph, 4);
    return 0;
}
