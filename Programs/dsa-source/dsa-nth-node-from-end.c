#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node *next; };

struct Node *create_node(int value)
{
    struct Node *node = malloc(sizeof *node);
    if (node == NULL) { perror("malloc"); exit(EXIT_FAILURE); }
    node->data = value;
    node->next = NULL;
    return node;
}

void append(struct Node **head, int value)
{
    struct Node *node = create_node(value);
    if (*head == NULL) { *head = node; return; }
    struct Node *current = *head;
    while (current->next != NULL) current = current->next;
    current->next = node;
}

void print_list(const struct Node *head)
{
    while (head != NULL) { printf("%d ", head->data); head = head->next; }
    putchar('\n');
}

void free_list(struct Node *head)
{
    while (head != NULL) { struct Node *next = head->next; free(head); head = next; }
}

int main(void)
{
    struct Node *head = NULL;
    for (int value = 10; value <= 50; value += 10) append(&head, value);
    size_t n = 2;
    const struct Node *lead = head, *follow = head;
    for (size_t step = 0; step < n && lead != NULL; step++) lead = lead->next;
    while (lead != NULL) { lead = lead->next; follow = follow->next; }
    printf("2nd from end = %d\n", follow->data);
    free_list(head);
    return 0;
}
