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

void insert_at(struct Node **head, int value, size_t position)
{
    if (position <= 1 || *head == NULL) {
        struct Node *node = create_node(value); node->next = *head; *head = node; return;
    }
    struct Node *current = *head;
    for (size_t index = 1; index + 1 < position && current->next != NULL; index++)
        current = current->next;
    struct Node *node = create_node(value);
    node->next = current->next;
    current->next = node;
}

int main(void)
{
    struct Node *head = NULL;
    append(&head, 10); append(&head, 30); append(&head, 40);
    insert_at(&head, 20, 2);
    print_list(head);
    free_list(head);
    return 0;
}
