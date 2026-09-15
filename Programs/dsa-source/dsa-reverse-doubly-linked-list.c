#include <stdio.h>
#include <stdlib.h>

struct DNode { int data; struct DNode *previous; struct DNode *next; };

struct DNode *new_dnode(int value)
{
    struct DNode *node = malloc(sizeof *node);
    if (node == NULL) exit(EXIT_FAILURE);
    node->data = value; node->previous = NULL; node->next = NULL;
    return node;
}

void dappend(struct DNode **head, int value)
{
    struct DNode *node = new_dnode(value);
    if (*head == NULL) { *head = node; return; }
    struct DNode *tail = *head;
    while (tail->next != NULL) tail = tail->next;
    tail->next = node; node->previous = tail;
}

void dprint(const struct DNode *head)
{
    while (head != NULL) { printf("%d ", head->data); head = head->next; }
    putchar('\n');
}

void dfree(struct DNode *head)
{
    while (head != NULL) { struct DNode *next = head->next; free(head); head = next; }
}

int main(void)
{
    struct DNode *head = NULL;
    dappend(&head, 10); dappend(&head, 20); dappend(&head, 30);
    struct DNode *current = head, *new_head = NULL;
    while (current != NULL) {
        struct DNode *next = current->next;
        current->next = current->previous;
        current->previous = next;
        new_head = current;
        current = next;
    }
    head = new_head;
    dprint(head);
    dfree(head);
    return 0;
}
