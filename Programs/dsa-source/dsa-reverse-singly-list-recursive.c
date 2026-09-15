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

struct Node *reverse_recursive(struct Node *head)
{
    if (head == NULL || head->next == NULL) return head;
    struct Node *new_head = reverse_recursive(head->next);
    head->next->next = head;
    head->next = NULL;
    return new_head;
}

int main(void)
{
    struct Node *head = NULL;
    append(&head, 10); append(&head, 20); append(&head, 30);
    head = reverse_recursive(head);
    print_list(head);
    free_list(head);
    return 0;
}
