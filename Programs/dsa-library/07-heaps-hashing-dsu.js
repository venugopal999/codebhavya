"use strict";

const { cMain, makeDsa } = require("./helpers");
const topic = "Heaps, Hashing & Disjoint Sets";

function advanced(options) {
  return makeDsa({
    topic,
    difficulty: options.difficulty || "Intermediate",
    time: "O(n)",
    space: "O(n)",
    ...options
  });
}

module.exports = [
  advanced({
    slug: "dsa-min-heap-insertion",
    title: "Insert Values into a Min-Heap",
    concepts: ["Min-heap", "Insertion", "Heapify up"],
    source: cMain(`    int heap[20], size = 0;
    int values[] = {30, 10, 40, 5, 20};
    for (int index = 0; index < 5; index++) {
        int position = size++;
        heap[position] = values[index];
        while (position > 0) {
            int parent = (position - 1) / 2;
            if (heap[parent] <= heap[position]) break;
            int temporary = heap[parent]; heap[parent] = heap[position]; heap[position] = temporary;
            position = parent;
        }
    }
    for (int index = 0; index < size; index++) printf("%d ", heap[index]);
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "5 10 40 30 20",
    time: "O(log n) per insertion",
    method: "Append each value and swap it upward until its parent is no larger."
  }),
  advanced({
    slug: "dsa-min-heap-delete-root",
    title: "Delete the Root from a Min-Heap",
    concepts: ["Min-heap", "Extract minimum", "Heapify down"],
    source: cMain(`    int heap[] = {5, 10, 20, 30, 40};
    int size = 5, minimum = heap[0];
    heap[0] = heap[--size];
    int position = 0;
    while (1) {
        int left = 2 * position + 1, right = left + 1, smallest = position;
        if (left < size && heap[left] < heap[smallest]) smallest = left;
        if (right < size && heap[right] < heap[smallest]) smallest = right;
        if (smallest == position) break;
        int temporary = heap[position]; heap[position] = heap[smallest]; heap[smallest] = temporary;
        position = smallest;
    }
    printf("Removed = %d\\nHeap: ", minimum);
    for (int index = 0; index < size; index++) printf("%d ", heap[index]);
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Removed = 5\nHeap: 10 30 20 40",
    time: "O(log n)",
    method: "Move the final value to the root and swap it down with its smaller child."
  }),
  advanced({
    slug: "dsa-build-max-heap",
    title: "Build a Max-Heap from an Array",
    concepts: ["Max-heap", "Bottom-up heapify", "Complete tree"],
    source: cMain(`    int values[] = {4, 10, 3, 5, 1};
    int size = 5;
    for (int index = size / 2 - 1; index >= 0; index--) heapify(values, size, index);
    for (int index = 0; index < size; index++) printf("%d ", values[index]);
    putchar('\\n');
    return 0;`, ["stdio.h"], `void heapify(int values[], int size, int root)
{
    while (1) {
        int largest = root, left = 2 * root + 1, right = left + 1;
        if (left < size && values[left] > values[largest]) largest = left;
        if (right < size && values[right] > values[largest]) largest = right;
        if (largest == root) return;
        int temporary = values[root]; values[root] = values[largest]; values[largest] = temporary;
        root = largest;
    }
}`),
    sampleInput: "No input required",
    sampleOutput: "10 5 3 4 1",
    time: "O(n)",
    method: "Heapify every internal node from the bottom level toward the root."
  }),
  advanced({
    slug: "dsa-heap-sort",
    title: "Sort an Array with Heap Sort",
    concepts: ["Heap sort", "Max-heap", "In-place sorting"],
    source: cMain(`    int values[] = {12, 11, 13, 5, 6, 7};
    int size = 6;
    for (int index = size / 2 - 1; index >= 0; index--) heapify(values, size, index);
    for (int end = size - 1; end > 0; end--) {
        int temporary = values[0]; values[0] = values[end]; values[end] = temporary;
        heapify(values, end, 0);
    }
    for (int index = 0; index < size; index++) printf("%d ", values[index]);
    putchar('\\n');
    return 0;`, ["stdio.h"], `void heapify(int values[], int size, int root)
{
    int largest = root, left = 2 * root + 1, right = left + 1;
    if (left < size && values[left] > values[largest]) largest = left;
    if (right < size && values[right] > values[largest]) largest = right;
    if (largest != root) {
        int temporary = values[root]; values[root] = values[largest]; values[largest] = temporary;
        heapify(values, size, largest);
    }
}`),
    sampleInput: "No input required",
    sampleOutput: "5 6 7 11 12 13",
    time: "O(n log n)",
    space: "O(log n) recursion",
    method: "Build a max-heap and repeatedly move its root to the end of the unsorted region."
  }),
  advanced({
    slug: "dsa-kth-largest-min-heap",
    title: "Find the Kth-Largest Value with a Min-Heap",
    concepts: ["Top K", "Min-heap", "Selection"],
    source: cMain(`    int values[] = {7, 10, 4, 3, 20, 15};
    int heap[3], size = 0, k = 3;
    for (int index = 0; index < 6; index++) {
        if (size < k) {
            heap[size] = values[index];
            sift_up(heap, size++);
        } else if (values[index] > heap[0]) {
            heap[0] = values[index];
            sift_down(heap, size, 0);
        }
    }
    printf("3rd largest = %d\\n", heap[0]);
    return 0;`, ["stdio.h"], `void sift_up(int heap[], int position)
{
    while (position > 0) {
        int parent = (position - 1) / 2;
        if (heap[parent] <= heap[position]) return;
        int temporary = heap[parent]; heap[parent] = heap[position]; heap[position] = temporary;
        position = parent;
    }
}
void sift_down(int heap[], int size, int position)
{
    while (1) {
        int smallest = position, left = 2 * position + 1, right = left + 1;
        if (left < size && heap[left] < heap[smallest]) smallest = left;
        if (right < size && heap[right] < heap[smallest]) smallest = right;
        if (smallest == position) return;
        int temporary = heap[position]; heap[position] = heap[smallest]; heap[smallest] = temporary;
        position = smallest;
    }
}`),
    sampleInput: "No input required",
    sampleOutput: "3rd largest = 10",
    time: "O(n log k)",
    space: "O(k)",
    method: "Keep only the k largest values; the smallest retained value is the kth largest."
  }),
  advanced({
    slug: "dsa-heap-priority-queue",
    title: "Implement a Priority Queue with a Binary Heap",
    concepts: ["Priority queue", "Max-heap", "Extract maximum"],
    source: cMain(`    int heap[10], size = 0;
    push(heap, &size, 40); push(heap, &size, 10); push(heap, &size, 70);
    int first = extract_max(heap, &size);
    int second = extract_max(heap, &size);
    int third = extract_max(heap, &size);
    printf("%d %d %d\\n", first, second, third);
    return 0;`, ["stdio.h", "stdlib.h"], `void push(int heap[], int *size, int value)
{
    int position = (*size)++; heap[position] = value;
    while (position > 0) {
        int parent = (position - 1) / 2;
        if (heap[parent] >= heap[position]) return;
        int temporary = heap[parent]; heap[parent] = heap[position]; heap[position] = temporary;
        position = parent;
    }
}
int extract_max(int heap[], int *size)
{
    if (*size == 0) exit(EXIT_FAILURE);
    int result = heap[0]; heap[0] = heap[--(*size)];
    int position = 0;
    while (1) {
        int largest = position, left = 2 * position + 1, right = left + 1;
        if (left < *size && heap[left] > heap[largest]) largest = left;
        if (right < *size && heap[right] > heap[largest]) largest = right;
        if (largest == position) break;
        int temporary = heap[position]; heap[position] = heap[largest]; heap[largest] = temporary;
        position = largest;
    }
    return result;
}`),
    sampleInput: "No input required",
    sampleOutput: "70 40 10",
    time: "O(log n) per operation",
    method: "Maintain max-heap order so the highest-priority value stays at the root."
  }),
  advanced({
    slug: "dsa-hash-table-linear-probing",
    title: "Implement a Hash Table with Linear Probing",
    concepts: ["Hash table", "Open addressing", "Linear probing"],
    source: cMain(`    int table[11];
    for (int index = 0; index < 11; index++) table[index] = -1;
    int keys[] = {22, 1, 13, 11, 24, 33};
    for (int index = 0; index < 6; index++) {
        int position = keys[index] % 11;
        while (table[position] != -1) position = (position + 1) % 11;
        table[position] = keys[index];
    }
    for (int index = 0; index < 11; index++) if (table[index] != -1) printf("%d:%d ", index, table[index]);
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "0:22 1:1 2:13 3:11 4:24 5:33",
    method: "When a hashed position is occupied, inspect consecutive slots with wraparound."
  }),
  advanced({
    slug: "dsa-hash-table-separate-chaining",
    title: "Implement Hashing with Separate Chaining",
    concepts: ["Hash table", "Chaining", "Collision handling"],
    source: cMain(`    struct Node *table[5] = {NULL};
    int keys[] = {10, 15, 7, 12, 17};
    for (int index = 0; index < 5; index++) insert(table, keys[index]);
    for (int bucket = 0; bucket < 5; bucket++) {
        printf("%d:", bucket);
        for (struct Node *node = table[bucket]; node != NULL; node = node->next) printf(" %d", node->key);
        putchar('\\n');
    }
    clear(table);
    return 0;`, ["stdio.h", "stdlib.h"], `struct Node { int key; struct Node *next; };
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
}`),
    sampleInput: "No input required",
    sampleOutput: "0: 15 10\n2: 17 12 7",
    method: "Store colliding keys in a linked list owned by the hashed bucket."
  }),
  advanced({
    slug: "dsa-frequency-table-hashing",
    title: "Count Frequencies with a Hash-Style Table",
    concepts: ["Frequency table", "Direct addressing", "Counting"],
    source: cMain(`    int values[] = {4, 2, 4, 3, 2, 4};
    int frequency[11] = {0};
    for (int index = 0; index < 6; index++) frequency[values[index]]++;
    for (int value = 0; value <= 10; value++)
        if (frequency[value] > 0) printf("%d occurs %d time(s)\\n", value, frequency[value]);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "2 occurs 2 time(s)\n3 occurs 1 time(s)\n4 occurs 3 time(s)",
    time: "O(n + range)",
    method: "Use each bounded integer as an array index and increment its counter."
  }),
  advanced({
    slug: "dsa-disjoint-set-union",
    title: "Implement Disjoint-Set Union with Path Compression",
    concepts: ["DSU", "Path compression", "Union by rank"],
    source: cMain(`    int parent[6], rank[6] = {0};
    for (int index = 0; index < 6; index++) parent[index] = index;
    unite(parent, rank, 0, 1); unite(parent, rank, 1, 2); unite(parent, rank, 3, 4);
    printf("0 and 2 connected: %s\\n", find(parent, 0) == find(parent, 2) ? "yes" : "no");
    printf("0 and 4 connected: %s\\n", find(parent, 0) == find(parent, 4) ? "yes" : "no");
    return 0;`, ["stdio.h"], `int find(int parent[], int value)
{
    if (parent[value] != value) parent[value] = find(parent, parent[value]);
    return parent[value];
}
void unite(int parent[], int rank[], int first, int second)
{
    int left = find(parent, first), right = find(parent, second);
    if (left == right) return;
    if (rank[left] < rank[right]) parent[left] = right;
    else if (rank[left] > rank[right]) parent[right] = left;
    else { parent[right] = left; rank[left]++; }
}`),
    sampleInput: "No input required",
    sampleOutput: "0 and 2 connected: yes\n0 and 4 connected: no",
    time: "Almost O(1) amortized",
    method: "Compress find paths and attach the shallower representative tree beneath the deeper one."
  }),
  advanced({
    slug: "dsa-cycle-detection-dsu",
    title: "Detect an Undirected Graph Cycle with DSU",
    concepts: ["DSU", "Cycle detection", "Edges"],
    source: cMain(`    struct Edge edges[] = {{0, 1}, {1, 2}, {2, 0}};
    int parent[] = {0, 1, 2}, cycle = 0;
    for (int index = 0; index < 3; index++) {
        int first = find(parent, edges[index].source);
        int second = find(parent, edges[index].destination);
        if (first == second) { cycle = 1; break; }
        parent[second] = first;
    }
    puts(cycle ? "Cycle detected." : "No cycle.");
    return 0;`, ["stdio.h"], `struct Edge { int source; int destination; };
int find(int parent[], int value)
{
    while (parent[value] != value) value = parent[value];
    return value;
}`),
    sampleInput: "No input required",
    sampleOutput: "Cycle detected.",
    method: "An edge forms a cycle when both endpoints already share the same representative."
  }),
  advanced({
    slug: "dsa-kruskal-minimum-spanning-tree",
    title: "Find a Minimum Spanning Tree with Kruskal's Algorithm",
    concepts: ["Kruskal", "Minimum spanning tree", "DSU"],
    difficulty: "Advanced",
    source: cMain(`    struct Edge edges[] = {{0, 1, 10}, {0, 2, 6}, {0, 3, 5}, {1, 3, 15}, {2, 3, 4}};
    qsort(edges, 5, sizeof edges[0], compare_edges);
    int parent[] = {0, 1, 2, 3}, selected = 0, cost = 0;
    for (int index = 0; index < 5 && selected < 3; index++) {
        int first = find(parent, edges[index].source);
        int second = find(parent, edges[index].destination);
        if (first != second) {
            parent[second] = first; cost += edges[index].weight; selected++;
            printf("%d-%d(%d) ", edges[index].source, edges[index].destination, edges[index].weight);
        }
    }
    printf("\\nCost = %d\\n", cost);
    return 0;`, ["stdio.h", "stdlib.h"], `struct Edge { int source; int destination; int weight; };
int compare_edges(const void *left, const void *right)
{
    const struct Edge *first = left, *second = right;
    return (first->weight > second->weight) - (first->weight < second->weight);
}
int find(int parent[], int value)
{
    if (parent[value] != value) parent[value] = find(parent, parent[value]);
    return parent[value];
}`),
    sampleInput: "No input required",
    sampleOutput: "2-3(4) 0-3(5) 0-1(10)\nCost = 19",
    time: "O(E log E)",
    space: "O(V)",
    method: "Process edges from smallest weight upward and accept only edges joining different sets."
  })
];
