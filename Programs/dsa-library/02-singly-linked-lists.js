"use strict";

const { cMain, makeDsa } = require("./helpers");
const topic = "Singly Linked Lists";

const base = `struct Node { int data; struct Node *next; };

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
    putchar('\\n');
}

void free_list(struct Node *head)
{
    while (head != NULL) { struct Node *next = head->next; free(head); head = next; }
}`;

function listProgram(options) {
  return makeDsa({
    topic,
    concepts: ["Linked list", "Node", "Pointers"],
    time: "O(n)",
    space: "O(n)",
    ...options,
    source: cMain(options.body, ["stdio.h", "stdlib.h"], `${base}${options.extra ? `\n\n${options.extra}` : ""}`)
  });
}

module.exports = [
  listProgram({
    slug: "dsa-create-traverse-singly-list",
    title: "Create and Traverse a Singly Linked List",
    body: `    struct Node *head = NULL;
    append(&head, 10); append(&head, 20); append(&head, 30);
    print_list(head);
    free_list(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "10 20 30",
    method: "Allocate one node per value, connect the next pointers and follow them from head to NULL."
  }),
  listProgram({
    slug: "dsa-insert-singly-list-beginning",
    title: "Insert a Node at the Beginning of a Singly Linked List",
    body: `    struct Node *head = NULL;
    append(&head, 20); append(&head, 30);
    struct Node *node = create_node(10);
    node->next = head;
    head = node;
    print_list(head);
    free_list(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "10 20 30",
    time: "O(1)",
    method: "Point the new node at the old head and replace head with the new node."
  }),
  listProgram({
    slug: "dsa-insert-singly-list-end",
    title: "Insert a Node at the End of a Singly Linked List",
    body: `    struct Node *head = NULL;
    append(&head, 10); append(&head, 20); append(&head, 30);
    print_list(head);
    free_list(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "10 20 30",
    method: "Walk to the last node and connect its next pointer to the new node."
  }),
  listProgram({
    slug: "dsa-insert-singly-list-position",
    title: "Insert a Node at a Given Linked-List Position",
    body: `    struct Node *head = NULL;
    append(&head, 10); append(&head, 30); append(&head, 40);
    insert_at(&head, 20, 2);
    print_list(head);
    free_list(head);
    return 0;`,
    extra: `void insert_at(struct Node **head, int value, size_t position)
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
}`,
    sampleInput: "No input required",
    sampleOutput: "10 20 30 40",
    method: "Stop at the predecessor, then link the new node between the predecessor and successor."
  }),
  listProgram({
    slug: "dsa-delete-singly-list-beginning",
    title: "Delete the First Node of a Singly Linked List",
    body: `    struct Node *head = NULL;
    append(&head, 10); append(&head, 20); append(&head, 30);
    if (head != NULL) { struct Node *removed = head; head = head->next; free(removed); }
    print_list(head);
    free_list(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "20 30",
    time: "O(1)",
    method: "Save the current head, advance head to the second node and release the removed node."
  }),
  listProgram({
    slug: "dsa-delete-singly-list-end",
    title: "Delete the Last Node of a Singly Linked List",
    body: `    struct Node *head = NULL;
    append(&head, 10); append(&head, 20); append(&head, 30);
    delete_last(&head);
    print_list(head);
    free_list(head);
    return 0;`,
    extra: `void delete_last(struct Node **head)
{
    if (*head == NULL) return;
    if ((*head)->next == NULL) { free(*head); *head = NULL; return; }
    struct Node *current = *head;
    while (current->next->next != NULL) current = current->next;
    free(current->next);
    current->next = NULL;
}`,
    sampleInput: "No input required",
    sampleOutput: "10 20",
    method: "Stop at the second-last node, free its successor and set next to NULL."
  }),
  listProgram({
    slug: "dsa-delete-singly-list-key",
    title: "Delete the First Matching Linked-List Node",
    body: `    struct Node *head = NULL;
    append(&head, 10); append(&head, 20); append(&head, 30);
    delete_key(&head, 20);
    print_list(head);
    free_list(head);
    return 0;`,
    extra: `void delete_key(struct Node **head, int key)
{
    struct Node **link = head;
    while (*link != NULL && (*link)->data != key) link = &(*link)->next;
    if (*link != NULL) { struct Node *removed = *link; *link = removed->next; free(removed); }
}`,
    sampleInput: "No input required",
    sampleOutput: "10 30",
    method: "Track the pointer that owns each link, bypass the match and free it."
  }),
  listProgram({
    slug: "dsa-search-singly-linked-list",
    title: "Search for a Value in a Singly Linked List",
    body: `    struct Node *head = NULL;
    append(&head, 8); append(&head, 13); append(&head, 21);
    int key = 13, position = 1;
    const struct Node *current = head;
    while (current != NULL && current->data != key) { current = current->next; position++; }
    if (current != NULL) printf("Found at position %d\\n", position);
    else puts("Value not found.");
    free_list(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "Found at position 2",
    method: "Traverse sequentially until the key matches or the end is reached."
  }),
  listProgram({
    slug: "dsa-count-singly-list-nodes",
    title: "Count Nodes in a Singly Linked List",
    body: `    struct Node *head = NULL;
    append(&head, 5); append(&head, 10); append(&head, 15); append(&head, 20);
    size_t count = 0;
    for (const struct Node *current = head; current != NULL; current = current->next) count++;
    printf("Nodes = %zu\\n", count);
    free_list(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "Nodes = 4",
    method: "Increment a counter once for every node reached before NULL."
  }),
  listProgram({
    slug: "dsa-reverse-singly-list-iterative",
    title: "Reverse a Singly Linked List Iteratively",
    difficulty: "Intermediate",
    body: `    struct Node *head = NULL;
    append(&head, 10); append(&head, 20); append(&head, 30);
    struct Node *previous = NULL, *current = head;
    while (current != NULL) {
        struct Node *next = current->next;
        current->next = previous;
        previous = current;
        current = next;
    }
    head = previous;
    print_list(head);
    free_list(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "30 20 10",
    method: "Reverse each next pointer while preserving the unprocessed remainder."
  }),
  listProgram({
    slug: "dsa-reverse-singly-list-recursive",
    title: "Reverse a Singly Linked List Recursively",
    difficulty: "Advanced",
    body: `    struct Node *head = NULL;
    append(&head, 10); append(&head, 20); append(&head, 30);
    head = reverse_recursive(head);
    print_list(head);
    free_list(head);
    return 0;`,
    extra: `struct Node *reverse_recursive(struct Node *head)
{
    if (head == NULL || head->next == NULL) return head;
    struct Node *new_head = reverse_recursive(head->next);
    head->next->next = head;
    head->next = NULL;
    return new_head;
}`,
    sampleInput: "No input required",
    sampleOutput: "30 20 10",
    space: "O(n) call stack",
    method: "Reverse the suffix recursively and attach the current node behind its former successor."
  }),
  listProgram({
    slug: "dsa-middle-singly-linked-list",
    title: "Find the Middle Node with Slow and Fast Pointers",
    body: `    struct Node *head = NULL;
    for (int value = 10; value <= 50; value += 10) append(&head, value);
    const struct Node *slow = head, *fast = head;
    while (fast != NULL && fast->next != NULL) { slow = slow->next; fast = fast->next->next; }
    printf("Middle = %d\\n", slow->data);
    free_list(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "Middle = 30",
    method: "Advance one pointer once and another twice so the slow pointer reaches the middle."
  }),
  listProgram({
    slug: "dsa-nth-node-from-end",
    title: "Find the Nth Node from the End",
    difficulty: "Intermediate",
    body: `    struct Node *head = NULL;
    for (int value = 10; value <= 50; value += 10) append(&head, value);
    size_t n = 2;
    const struct Node *lead = head, *follow = head;
    for (size_t step = 0; step < n && lead != NULL; step++) lead = lead->next;
    while (lead != NULL) { lead = lead->next; follow = follow->next; }
    printf("2nd from end = %d\\n", follow->data);
    free_list(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "2nd from end = 40",
    method: "Maintain a fixed gap of n nodes between two pointers."
  }),
  listProgram({
    slug: "dsa-detect-linked-list-cycle",
    title: "Detect a Linked-List Cycle with Floyd's Algorithm",
    difficulty: "Advanced",
    body: `    struct Node *head = NULL;
    append(&head, 10); append(&head, 20); append(&head, 30); append(&head, 40);
    struct Node *tail = head;
    while (tail->next != NULL) tail = tail->next;
    tail->next = head->next;
    const struct Node *slow = head, *fast = head;
    int cycle = 0;
    while (fast != NULL && fast->next != NULL) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) { cycle = 1; break; }
    }
    puts(cycle ? "Cycle detected." : "No cycle.");
    tail->next = NULL;
    free_list(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "Cycle detected.",
    method: "A one-step pointer and a two-step pointer must meet when a cycle exists."
  })
];
