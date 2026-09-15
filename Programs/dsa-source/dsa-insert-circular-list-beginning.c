#include <stdio.h>
#include <stdlib.h>

struct CNode { int data; struct CNode *next; };

struct CNode *new_cnode(int value)
{
    struct CNode *node = malloc(sizeof *node);
    if (node == NULL) exit(EXIT_FAILURE);
    node->data = value; node->next = node;
    return node;
}

void cappend(struct CNode **tail, int value)
{
    struct CNode *node = new_cnode(value);
    if (*tail == NULL) { *tail = node; return; }
    node->next = (*tail)->next;
    (*tail)->next = node;
    *tail = node;
}

void cprint(const struct CNode *tail)
{
    if (tail == NULL) { putchar('\n'); return; }
    const struct CNode *current = tail->next;
    do { printf("%d ", current->data); current = current->next; } while (current != tail->next);
    putchar('\n');
}

void cfree(struct CNode *tail)
{
    if (tail == NULL) return;
    struct CNode *head = tail->next;
    tail->next = NULL;
    while (head != NULL) { struct CNode *next = head->next; free(head); head = next; }
}

int main(void)
{
    struct CNode *tail = NULL;
    cappend(&tail, 20); cappend(&tail, 30);
    struct CNode *node = new_cnode(10);
    node->next = tail->next;
    tail->next = node;
    cprint(tail);
    cfree(tail);
    return 0;
}
