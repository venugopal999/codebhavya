"use strict";

const { cMain, makeDsa } = require("./helpers");
const topic = "Queues & Deques";

function queueProgram(options) {
  return makeDsa({
    topic,
    concepts: ["Queue", "FIFO", "front/rear"],
    time: "O(n)",
    space: "O(n)",
    ...options
  });
}

module.exports = [
  queueProgram({
    slug: "dsa-linear-queue-array",
    title: "Implement a Linear Queue Using an Array",
    source: cMain(`    int queue[10], front = 0, rear = 0;
    queue[rear++] = 10; queue[rear++] = 20; queue[rear++] = 30;
    printf("Removed = %d\\n", queue[front++]);
    printf("Front = %d\\n", queue[front]);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Removed = 10\nFront = 20",
    time: "O(1) per operation",
    method: "Insert at rear and remove at front while maintaining two indices."
  }),
  queueProgram({
    slug: "dsa-circular-queue-array",
    title: "Implement a Circular Queue Using an Array",
    difficulty: "Intermediate",
    source: cMain(`    struct Queue queue = {{0}, 0, 0, 0};
    enqueue(&queue, 10); enqueue(&queue, 20); enqueue(&queue, 30);
    printf("Removed = %d\\n", dequeue(&queue));
    enqueue(&queue, 40);
    while (queue.count > 0) printf("%d ", dequeue(&queue));
    putchar('\\n');
    return 0;`, ["stdio.h", "stdlib.h"], `#define CAPACITY 5
struct Queue { int values[CAPACITY]; int front; int rear; int count; };
void enqueue(struct Queue *queue, int value)
{
    if (queue->count == CAPACITY) exit(EXIT_FAILURE);
    queue->values[queue->rear] = value;
    queue->rear = (queue->rear + 1) % CAPACITY;
    queue->count++;
}
int dequeue(struct Queue *queue)
{
    if (queue->count == 0) exit(EXIT_FAILURE);
    int value = queue->values[queue->front];
    queue->front = (queue->front + 1) % CAPACITY;
    queue->count--;
    return value;
}`),
    sampleInput: "No input required",
    sampleOutput: "Removed = 10\n20 30 40",
    time: "O(1) per operation",
    method: "Wrap front and rear with modulo so released array positions can be reused."
  }),
  queueProgram({
    slug: "dsa-queue-linked-list",
    title: "Implement a Queue Using a Linked List",
    source: cMain(`    struct Queue queue = {NULL, NULL};
    enqueue(&queue, 10); enqueue(&queue, 20); enqueue(&queue, 30);
    printf("Removed = %d\\n", dequeue(&queue));
    printf("Front = %d\\n", queue.front->data);
    while (queue.front != NULL) dequeue(&queue);
    return 0;`, ["stdio.h", "stdlib.h"], `struct Node { int data; struct Node *next; };
struct Queue { struct Node *front; struct Node *rear; };
void enqueue(struct Queue *queue, int value)
{
    struct Node *node = malloc(sizeof *node);
    if (node == NULL) exit(EXIT_FAILURE);
    node->data = value; node->next = NULL;
    if (queue->rear == NULL) queue->front = node;
    else queue->rear->next = node;
    queue->rear = node;
}
int dequeue(struct Queue *queue)
{
    if (queue->front == NULL) exit(EXIT_FAILURE);
    struct Node *removed = queue->front; int value = removed->data;
    queue->front = removed->next;
    if (queue->front == NULL) queue->rear = NULL;
    free(removed); return value;
}`),
    sampleInput: "No input required",
    sampleOutput: "Removed = 10\nFront = 20",
    time: "O(1) per operation",
    method: "Insert through rear and remove through front, resetting rear when the final node leaves."
  }),
  queueProgram({
    slug: "dsa-deque-circular-array",
    title: "Implement a Deque with a Circular Array",
    difficulty: "Intermediate",
    source: cMain(`    int deque[6] = {0}, front = 0, count = 0;
    push_back(deque, &front, &count, 10);
    push_back(deque, &front, &count, 20);
    push_front(deque, &front, &count, 5);
    printf("Front = %d\\n", deque[front]);
    int rear = (front + count - 1) % 6;
    printf("Rear = %d\\n", deque[rear]);
    return 0;`, ["stdio.h", "stdlib.h"], `void push_front(int deque[], int *front, int *count, int value)
{
    if (*count == 6) exit(EXIT_FAILURE);
    *front = (*front + 5) % 6;
    deque[*front] = value; (*count)++;
}
void push_back(int deque[], int *front, int *count, int value)
{
    if (*count == 6) exit(EXIT_FAILURE);
    deque[(*front + *count) % 6] = value; (*count)++;
}`),
    sampleInput: "No input required",
    sampleOutput: "Front = 5\nRear = 20",
    time: "O(1) per operation",
    method: "Use circular indices to allow insertion and removal at both ends."
  }),
  queueProgram({
    slug: "dsa-priority-queue-array",
    title: "Implement a Priority Queue Using an Ordered Array",
    difficulty: "Intermediate",
    source: cMain(`    struct Item queue[6];
    int count = 0;
    insert(queue, &count, 10, 2);
    insert(queue, &count, 20, 1);
    insert(queue, &count, 30, 3);
    while (count > 0) {
        struct Item item = queue[--count];
        printf("%d(p%d) ", item.value, item.priority);
    }
    putchar('\\n');
    return 0;`, ["stdio.h"], `struct Item { int value; int priority; };
void insert(struct Item queue[], int *count, int value, int priority)
{
    int index = *count;
    while (index > 0 && queue[index - 1].priority > priority) {
        queue[index] = queue[index - 1]; index--;
    }
    queue[index] = (struct Item){value, priority};
    (*count)++;
}`),
    sampleInput: "No input required",
    sampleOutput: "30(p3) 10(p2) 20(p1)",
    time: "O(n) insertion, O(1) removal",
    method: "Keep entries ordered by priority so the highest-priority item is removed from the end."
  }),
  queueProgram({
    slug: "dsa-reverse-queue-stack",
    title: "Reverse a Queue Using a Stack",
    source: cMain(`    int queue[] = {10, 20, 30, 40};
    int stack[4], top = -1;
    for (int front = 0; front < 4; front++) stack[++top] = queue[front];
    for (int rear = 0; rear < 4; rear++) queue[rear] = stack[top--];
    for (int index = 0; index < 4; index++) printf("%d ", queue[index]);
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "40 30 20 10",
    method: "Move every queue item through a LIFO stack before enqueuing it again."
  }),
  queueProgram({
    slug: "dsa-interleave-queue-halves",
    title: "Interleave the Two Halves of a Queue",
    difficulty: "Intermediate",
    source: cMain(`    int queue[] = {1, 2, 3, 4, 5, 6};
    int first_half[] = {1, 2, 3};
    for (int index = 0; index < 3; index++) {
        printf("%d %d ", first_half[index], queue[index + 3]);
    }
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "1 4 2 5 3 6",
    method: "Separate the first half, then alternately take one value from each half."
  }),
  queueProgram({
    slug: "dsa-generate-binary-numbers-queue",
    title: "Generate Binary Numbers Using a Queue",
    source: cMain(`    unsigned int queue[20];
    int front = 0, rear = 0;
    queue[rear++] = 1;
    for (int count = 0; count < 8; count++) {
        unsigned int current = queue[front++];
        printf("%u ", current);
        queue[rear++] = current * 10;
        queue[rear++] = current * 10 + 1;
    }
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "1 10 11 100 101 110 111 1000",
    time: "O(n)",
    method: "For each dequeued binary string, enqueue copies with zero and one appended."
  }),
  queueProgram({
    slug: "dsa-queue-using-two-stacks",
    title: "Implement a Queue Using Two Stacks",
    difficulty: "Intermediate",
    source: cMain(`    struct Queue queue = {{{0}, -1}, {{0}, -1}};
    enqueue(&queue, 10); enqueue(&queue, 20); enqueue(&queue, 30);
    int first = dequeue(&queue);
    int second = dequeue(&queue);
    int third = dequeue(&queue);
    printf("%d %d %d\\n", first, second, third);
    return 0;`, ["stdio.h", "stdlib.h"], `struct Stack { int values[20]; int top; };
struct Queue { struct Stack input; struct Stack output; };
void push(struct Stack *stack, int value) { stack->values[++stack->top] = value; }
int pop(struct Stack *stack) { return stack->values[stack->top--]; }
void enqueue(struct Queue *queue, int value) { push(&queue->input, value); }
int dequeue(struct Queue *queue)
{
    if (queue->output.top < 0)
        while (queue->input.top >= 0) push(&queue->output, pop(&queue->input));
    if (queue->output.top < 0) exit(EXIT_FAILURE);
    return pop(&queue->output);
}`),
    sampleInput: "No input required",
    sampleOutput: "10 20 30",
    time: "Amortized O(1)",
    method: "Transfer input-stack values only when the output stack is empty to expose FIFO order."
  }),
  queueProgram({
    slug: "dsa-stack-using-two-queues",
    title: "Implement a Stack Using Two Queues",
    difficulty: "Intermediate",
    source: cMain(`    int first[20], second[20];
    int first_count = 0, second_count = 0;
    push_value(first, &first_count, second, &second_count, 10);
    push_value(first, &first_count, second, &second_count, 20);
    push_value(first, &first_count, second, &second_count, 30);
    printf("%d %d %d\\n", first[0], first[1], first[2]);
    return 0;`, ["stdio.h"], `void push_value(int first[], int *first_count, int second[], int *second_count, int value)
{
    second[(*second_count)++] = value;
    for (int index = 0; index < *first_count; index++) second[(*second_count)++] = first[index];
    for (int index = 0; index < *second_count; index++) first[index] = second[index];
    *first_count = *second_count;
    *second_count = 0;
}`),
    sampleInput: "No input required",
    sampleOutput: "30 20 10",
    time: "O(n) push, O(1) pop",
    method: "Place each new value before all older queue values so the front behaves as a stack top."
  })
];
