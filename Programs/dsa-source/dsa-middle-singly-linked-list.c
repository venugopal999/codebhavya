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
    const struct Node *slow = head, *fast = head;
    while (fast != NULL && fast->next != NULL) { slow = slow->next; fast = fast->next->next; }
    printf("Middle = %d\n", slow->data);
    free_list(head);
    return 0;
}
