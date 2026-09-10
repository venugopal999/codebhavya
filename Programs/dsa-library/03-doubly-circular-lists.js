"use strict";

const { cMain, makeDsa } = require("./helpers");
const topic = "Doubly & Circular Linked Lists";

const doublyBase = `struct DNode { int data; struct DNode *previous; struct DNode *next; };

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
    putchar('\\n');
}

void dfree(struct DNode *head)
{
    while (head != NULL) { struct DNode *next = head->next; free(head); head = next; }
}`;

const circularBase = `struct CNode { int data; struct CNode *next; };

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
    if (tail == NULL) { putchar('\\n'); return; }
    const struct CNode *current = tail->next;
    do { printf("%d ", current->data); current = current->next; } while (current != tail->next);
    putchar('\\n');
}

void cfree(struct CNode *tail)
{
    if (tail == NULL) return;
    struct CNode *head = tail->next;
    tail->next = NULL;
    while (head != NULL) { struct CNode *next = head->next; free(head); head = next; }
}`;

function doubly(options) {
  return makeDsa({
    topic,
    difficulty: "Intermediate",
    concepts: ["Doubly linked list", "previous", "next"],
    time: "O(n)",
    space: "O(n)",
    ...options,
    source: cMain(options.body, ["stdio.h", "stdlib.h"], doublyBase + (options.extra ? "\n\n" + options.extra : ""))
  });
}

function circular(options) {
  return makeDsa({
    topic,
    difficulty: "Intermediate",
    concepts: ["Circular linked list", "Tail pointer", "do-while"],
    time: "O(n)",
    space: "O(n)",
    ...options,
    source: cMain(options.body, ["stdio.h", "stdlib.h"], circularBase + (options.extra ? "\n\n" + options.extra : ""))
  });
}

module.exports = [
  doubly({
    slug: "dsa-traverse-doubly-list-both-directions",
    title: "Traverse a Doubly Linked List in Both Directions",
    body: `    struct DNode *head = NULL;
    dappend(&head, 10); dappend(&head, 20); dappend(&head, 30);
    dprint(head);
    struct DNode *tail = head;
    while (tail->next != NULL) tail = tail->next;
    while (tail != NULL) { printf("%d ", tail->data); tail = tail->previous; }
    putchar('\\n');
    dfree(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "10 20 30\n30 20 10",
    method: "Follow next links to move forward and previous links to return from the tail."
  }),
  doubly({
    slug: "dsa-insert-doubly-list-beginning",
    title: "Insert at the Beginning of a Doubly Linked List",
    body: `    struct DNode *head = NULL;
    dappend(&head, 20); dappend(&head, 30);
    struct DNode *node = new_dnode(10);
    node->next = head;
    head->previous = node;
    head = node;
    dprint(head);
    dfree(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "10 20 30",
    time: "O(1)",
    method: "Connect both directions between the new node and old head before replacing head."
  }),
  doubly({
    slug: "dsa-insert-doubly-list-end",
    title: "Insert at the End of a Doubly Linked List",
    body: `    struct DNode *head = NULL;
    dappend(&head, 10); dappend(&head, 20); dappend(&head, 30);
    dprint(head);
    dfree(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "10 20 30",
    method: "Connect the former tail and new node through both next and previous pointers."
  }),
  doubly({
    slug: "dsa-delete-doubly-list-node",
    title: "Delete a Node from a Doubly Linked List",
    body: `    struct DNode *head = NULL;
    dappend(&head, 10); dappend(&head, 20); dappend(&head, 30);
    struct DNode *removed = head->next;
    removed->previous->next = removed->next;
    removed->next->previous = removed->previous;
    free(removed);
    dprint(head);
    dfree(head);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "10 30",
    time: "O(1) after locating the node",
    method: "Reconnect the predecessor and successor in both directions, then release the node."
  }),
  doubly({
    slug: "dsa-reverse-doubly-linked-list",
    title: "Reverse a Doubly Linked List",
    body: `    struct DNode *head = NULL;
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
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "30 20 10",
    method: "Swap next and previous in every node and make the original tail the new head."
  }),
  circular({
    slug: "dsa-create-traverse-circular-list",
    title: "Create and Traverse a Circular Linked List",
    body: `    struct CNode *tail = NULL;
    cappend(&tail, 10); cappend(&tail, 20); cappend(&tail, 30);
    cprint(tail);
    cfree(tail);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "10 20 30",
    method: "Start at tail->next and stop only after returning to the same head node."
  }),
  circular({
    slug: "dsa-insert-circular-list-beginning",
    title: "Insert at the Beginning of a Circular Linked List",
    body: `    struct CNode *tail = NULL;
    cappend(&tail, 20); cappend(&tail, 30);
    struct CNode *node = new_cnode(10);
    node->next = tail->next;
    tail->next = node;
    cprint(tail);
    cfree(tail);
    return 0;`,
    sampleInput: "No input required",
    sampleOutput: "10 20 30",
    time: "O(1)",
    method: "Insert between the tail and current head without changing the tail pointer."
  }),
  circular({
    slug: "dsa-delete-circular-list-value",
    title: "Delete a Value from a Circular Linked List",
    body: `    struct CNode *tail = NULL;
    cappend(&tail, 10); cappend(&tail, 20); cappend(&tail, 30);
    delete_cvalue(&tail, 20);
    cprint(tail);
    cfree(tail);
    return 0;`,
    extra: `void delete_cvalue(struct CNode **tail, int key)
{
    if (*tail == NULL) return;
    struct CNode *previous = *tail, *current = (*tail)->next;
    do {
        if (current->data == key) {
            if (current == previous) *tail = NULL;
            else {
                previous->next = current->next;
                if (current == *tail) *tail = previous;
            }
            free(current);
            return;
        }
        previous = current; current = current->next;
    } while (current != (*tail)->next);
}`,
    sampleInput: "No input required",
    sampleOutput: "10 30",
    method: "Track the previous node around the circle, bypass the match and update tail when necessary."
  })
];
