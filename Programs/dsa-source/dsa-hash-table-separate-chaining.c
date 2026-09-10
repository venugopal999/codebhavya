#include <stdio.h>
#include <stdlib.h>

struct Node { int key; struct Node *next; };
void insert(struct Node *table[], int key)
{
    int bucket = key % 5;
    struct Node *node = malloc(sizeof *node);
    if (node == NULL) exit(EXIT_FAILURE);
    node->key = key; node->next = table[bucket]; table[bucket] = node;
}
void clear(struct Node *table[])
{
    for (int bucket = 0; bucket < 5; bucket++)
        while (table[bucket] != NULL) {
            struct Node *removed = table[bucket];
            table[bucket] = removed->next; free(removed);
        }
}

int main(void)
{
    struct Node *table[5] = {NULL};
    int keys[] = {10, 15, 7, 12, 17};
    for (int index = 0; index < 5; index++) insert(table, keys[index]);
    for (int bucket = 0; bucket < 5; bucket++) {
        printf("%d:", bucket);
        for (struct Node *node = table[bucket]; node != NULL; node = node->next) printf(" %d", node->key);
        putchar('\n');
    }
    clear(table);
    return 0;
}
