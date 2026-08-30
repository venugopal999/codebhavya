(function () {
    "use strict";

    const C_STARTER = String.raw`#include <stdio.h>

int main(void)
{
    /* Write your solution here */

    return 0;
}`;

    function problem(level, number, data) {
        return Object.assign({
            key: "ads-l" + level + "-p" + number,
            number: number
        }, data);
    }

    function avlProgram(outputMode) {
        const output = outputMode === "preorder"
            ? String.raw`preorder(root);`
            : outputMode === "height"
                ? String.raw`printf("%d", height(root));`
                : String.raw`printf("%d", root->key);`;

        return String.raw`#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int key, height;
    struct Node *left, *right;
} Node;

int height(Node *node) { return node ? node->height : 0; }
int maximum(int a, int b) { return a > b ? a : b; }

Node *newNode(int key) {
    Node *node = malloc(sizeof(Node));
    node->key = key;
    node->height = 1;
    node->left = node->right = NULL;
    return node;
}

Node *rotateRight(Node *y) {
    Node *x = y->left;
    Node *middle = x->right;
    x->right = y;
    y->left = middle;
    y->height = 1 + maximum(height(y->left), height(y->right));
    x->height = 1 + maximum(height(x->left), height(x->right));
    return x;
}

Node *rotateLeft(Node *x) {
    Node *y = x->right;
    Node *middle = y->left;
    y->left = x;
    x->right = middle;
    x->height = 1 + maximum(height(x->left), height(x->right));
    y->height = 1 + maximum(height(y->left), height(y->right));
    return y;
}

Node *insert(Node *node, int key) {
    if (!node) return newNode(key);
    if (key < node->key) node->left = insert(node->left, key);
    else if (key > node->key) node->right = insert(node->right, key);
    else return node;

    node->height = 1 + maximum(height(node->left), height(node->right));
    int balance = height(node->left) - height(node->right);

    if (balance > 1 && key < node->left->key) return rotateRight(node);
    if (balance < -1 && key > node->right->key) return rotateLeft(node);
    if (balance > 1 && key > node->left->key) {
        node->left = rotateLeft(node->left);
        return rotateRight(node);
    }
    if (balance < -1 && key < node->right->key) {
        node->right = rotateRight(node->right);
        return rotateLeft(node);
    }
    return node;
}

void preorder(Node *root) {
    if (!root) return;
    printf("%d ", root->key);
    preorder(root->left);
    preorder(root->right);
}

int main(void) {
    int n, key;
    Node *root = NULL;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &key);
        root = insert(root, key);
    }
    ${output}
    return 0;
}`;
    }

    function trieProgram(mode) {
        if (mode === "xor") {
            return String.raw`#include <stdio.h>
#include <stdlib.h>

typedef struct BitNode {
    struct BitNode *child[2];
} BitNode;

BitNode *makeNode(void) {
    return calloc(1, sizeof(BitNode));
}

void insert(BitNode *root, int value) {
    for (int bit = 30; bit >= 0; bit--) {
        int digit = (value >> bit) & 1;
        if (!root->child[digit]) root->child[digit] = makeNode();
        root = root->child[digit];
    }
}

int bestXor(BitNode *root, int value) {
    int answer = 0;
    for (int bit = 30; bit >= 0; bit--) {
        int digit = (value >> bit) & 1;
        int wanted = digit ^ 1;
        if (root->child[wanted]) {
            answer |= 1 << bit;
            root = root->child[wanted];
        } else {
            root = root->child[digit];
        }
    }
    return answer;
}

int main(void) {
    int n, value, query;
    BitNode *root = makeNode();
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &value);
        insert(root, value);
    }
    scanf("%d", &query);
    printf("%d", bestXor(root, query));
    return 0;
}`;
        }

        const finalOutput = mode === "prefix"
            ? String.raw`printf("%d", prefixCount(root, query));`
            : String.raw`printf("%s", search(root, query) ? "FOUND" : "NOT FOUND");`;

        return String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Trie {
    struct Trie *child[26];
    int terminal, pass;
} Trie;

Trie *makeNode(void) {
    return calloc(1, sizeof(Trie));
}

void insert(Trie *root, const char *word) {
    for (int i = 0; word[i]; i++) {
        int index = word[i] - 'a';
        if (!root->child[index]) root->child[index] = makeNode();
        root = root->child[index];
        root->pass++;
    }
    root->terminal = 1;
}

int search(Trie *root, const char *word) {
    for (int i = 0; word[i]; i++) {
        int index = word[i] - 'a';
        if (!root->child[index]) return 0;
        root = root->child[index];
    }
    return root->terminal;
}

int prefixCount(Trie *root, const char *prefix) {
    for (int i = 0; prefix[i]; i++) {
        int index = prefix[i] - 'a';
        if (!root->child[index]) return 0;
        root = root->child[index];
    }
    return root->pass;
}

int main(void) {
    int n;
    char word[101], query[101];
    Trie *root = makeNode();

    scanf("%d", &n);

    for (int i = 0; i < n; i++) {
        scanf("%100s", word);
        insert(root, word);
    }

    scanf("%100s", query);
    ${finalOutput}

    return 0;
}`;
    }

    const LEVELS = [
        {
            level: 8,
            host: "adsPracticeLevel8Challenges",
            challenges: [
                problem(8, 1, {
                    title: "Linear Scan Counter",
                    difficulty: "Starter",
                    points: 30,
                    coreSkill: "Exact operation counting",
                    concepts: [
                        "Time Complexity",
                        "Linear Loop"
                    ],
                    story:
                        "A profiler executes one comparison for every item in a dataset and must report the exact comparison count.",
                    task:
                        "Read N and print the number of comparisons made by a complete linear scan.",
                    inputSpec: "One positive integer N.",
                    outputSpec: "Print N.",
                    constraints: "1 ≤ N ≤ 10^9.",
                    sampleInput: "8",
                    sampleOutput: "8",
                    explanation:
                        "A complete scan checks all eight items.",
                    hint:
                        "The loop executes once for every element.",
                    solution: String.raw`#include <stdio.h>

int main(void)
{
    long long n;

    scanf("%lld", &n);
    printf("%lld", n);

    return 0;
}`,
                    tests: [
                        { input: "8", expected: "8" },
                        { input: "1", expected: "1" },
                        { input: "25", expected: "25" },
                        { input: "1000", expected: "1000" },
                        {
                            input: "999999999",
                            expected: "999999999"
                        }
                    ]
                }),

                problem(8, 2, {
                    title: "Binary Search Height",
                    difficulty: "Easy",
                    points: 40,
                    coreSkill: "Logarithmic growth",
                    concepts: [
                        "Binary Search",
                        "Logarithm"
                    ],
                    story:
                        "A search tree halves its remaining candidates after every comparison. The dashboard needs its worst-case comparison height.",
                    task:
                        "For N sorted elements, print floor(log2(N)) + 1.",
                    inputSpec: "One positive integer N.",
                    outputSpec:
                        "Print the worst-case comparison count.",
                    constraints: "1 ≤ N ≤ 10^18.",
                    sampleInput: "8",
                    sampleOutput: "4",
                    explanation:
                        "Candidate sizes can be 8, 4, 2 and 1.",
                    hint:
                        "Repeatedly divide N by two until it becomes zero.",
                    solution: String.raw`#include <stdio.h>

int main(void)
{
    unsigned long long n;
    int count = 0;

    scanf("%llu", &n);

    while (n) {
        count++;
        n /= 2;
    }

    printf("%d", count);
    return 0;
}`,
                    tests: [
                        { input: "8", expected: "4" },
                        { input: "1", expected: "1" },
                        { input: "7", expected: "3" },
                        { input: "16", expected: "5" },
                        { input: "1000", expected: "10" }
                    ]
                }),

                problem(8, 3, {
                    title: "Merge Recurrence Work",
                    difficulty: "Medium",
                    points: 55,
                    coreSkill: "Recurrence evaluation",
                    concepts: [
                        "Recurrence",
                        "N log N"
                    ],
                    story:
                        "A divide-and-conquer audit splits a power-of-two workload in half and performs N merge operations at every level.",
                    task:
                        "Given power-of-two N, print N × log2(N).",
                    inputSpec:
                        "One power-of-two integer N.",
                    outputSpec:
                        "Print the total merge work.",
                    constraints: "1 ≤ N ≤ 2^30.",
                    sampleInput: "8",
                    sampleOutput: "24",
                    explanation:
                        "There are three merge levels, each performing eight units.",
                    hint:
                        "Count how many times N can be divided by two.",
                    solution: String.raw`#include <stdio.h>

int main(void)
{
    long long n, value, levels = 0;

    scanf("%lld", &n);
    value = n;

    while (value > 1) {
        value /= 2;
        levels++;
    }

    printf("%lld", n * levels);
    return 0;
}`,
                    tests: [
                        { input: "8", expected: "24" },
                        { input: "1", expected: "0" },
                        { input: "2", expected: "2" },
                        { input: "16", expected: "64" },
                        { input: "1024", expected: "10240" }
                    ]
                })
            ]
        },

        {
            level: 9,
            host: "adsPracticeLevel9Challenges",
            challenges: [
                problem(9, 1, {
                    title: "Campus Network Components",
                    difficulty: "Easy",
                    points: 50,
                    coreSkill: "Union and component count",
                    concepts: [
                        "DSU",
                        "Union by Size"
                    ],
                    story:
                        "Departments become connected whenever a new private link is installed. The administrator needs the number of independent networks.",
                    task:
                        "Process M undirected unions among N vertices and print the final component count.",
                    inputSpec:
                        "N M followed by M pairs u v, using vertices 0 to N−1.",
                    outputSpec:
                        "Print the number of components.",
                    constraints: "1 ≤ N ≤ 100000.",
                    sampleInput:
                        "5 3\n0 1\n1 2\n3 4",
                    sampleOutput: "2",
                    explanation:
                        "The sets are {0,1,2} and {3,4}.",
                    hint:
                        "Begin with N components and decrement only after a successful union.",
                    solution: String.raw`#include <stdio.h>

#define MAX 100005

int parent[MAX];
int size[MAX];

int find(int vertex)
{
    if (parent[vertex] == vertex)
        return vertex;

    return parent[vertex] =
        find(parent[vertex]);
}

int main(void)
{
    int n, m;
    int first, second;
    int components;

    scanf("%d%d", &n, &m);
    components = n;

    for (int i = 0; i < n; i++) {
        parent[i] = i;
        size[i] = 1;
    }

    while (m--) {
        scanf("%d%d", &first, &second);

        first = find(first);
        second = find(second);

        if (first != second) {
            if (size[first] < size[second]) {
                int temporary = first;
                first = second;
                second = temporary;
            }

            parent[second] = first;
            size[first] += size[second];
            components--;
        }
    }

    printf("%d", components);
    return 0;
}`,
                    tests: [
                        {
                            input: "5 3\n0 1\n1 2\n3 4",
                            expected: "2"
                        },
                        {
                            input: "4 0",
                            expected: "4"
                        },
                        {
                            input: "4 3\n0 1\n1 2\n2 3",
                            expected: "1"
                        },
                        {
                            input: "6 2\n0 5\n2 3",
                            expected: "4"
                        },
                        {
                            input: "3 3\n0 1\n1 2\n0 2",
                            expected: "1"
                        }
                    ]
                }),

                problem(9, 2, {
                    title: "Live Connectivity Desk",
                    difficulty: "Medium",
                    points: 65,
                    coreSkill: "Connectivity queries",
                    concepts: [
                        "DSU",
                        "Path Compression"
                    ],
                    story:
                        "After permanent links are registered, a help desk answers whether selected pairs belong to the same network.",
                    task:
                        "Build the unions and answer Q connectivity queries with YES or NO.",
                    inputSpec:
                        "N M Q, M union pairs, then Q query pairs.",
                    outputSpec:
                        "One YES or NO per query.",
                    constraints:
                        "1 ≤ N,M,Q ≤ 100000.",
                    sampleInput:
                        "5 2 3\n0 1\n3 4\n0 1\n1 4\n3 4",
                    sampleOutput:
                        "YES\nNO\nYES",
                    explanation:
                        "Only the registered components are connected.",
                    hint:
                        "Two vertices are connected when their compressed roots are equal.",
                    solution: String.raw`#include <stdio.h>

#define MAX 100005

int parent[MAX];
int size[MAX];

int find(int vertex)
{
    if (parent[vertex] == vertex)
        return vertex;

    return parent[vertex] =
        find(parent[vertex]);
}

void unite(int first, int second)
{
    first = find(first);
    second = find(second);

    if (first == second)
        return;

    if (size[first] < size[second]) {
        int temporary = first;
        first = second;
        second = temporary;
    }

    parent[second] = first;
    size[first] += size[second];
}

int main(void)
{
    int n, m, q;
    int first, second;

    scanf("%d%d%d", &n, &m, &q);

    for (int i = 0; i < n; i++) {
        parent[i] = i;
        size[i] = 1;
    }

    while (m--) {
        scanf("%d%d", &first, &second);
        unite(first, second);
    }

    while (q--) {
        scanf("%d%d", &first, &second);

        puts(
            find(first) == find(second)
                ? "YES"
                : "NO"
        );
    }

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "5 2 3\n0 1\n3 4\n0 1\n1 4\n3 4",
                            expected:
                                "YES\nNO\nYES"
                        },
                        {
                            input:
                                "3 0 2\n0 0\n0 1",
                            expected:
                                "YES\nNO"
                        },
                        {
                            input:
                                "4 3 2\n0 1\n1 2\n2 3\n0 3\n1 3",
                            expected:
                                "YES\nYES"
                        },
                        {
                            input:
                                "6 2 2\n1 2\n4 5\n1 5\n4 5",
                            expected:
                                "NO\nYES"
                        },
                        {
                            input:
                                "2 1 1\n0 1\n0 1",
                            expected:
                                "YES"
                        }
                    ]
                }),

                problem(9, 3, {
                    title: "Redundant Cable Detector",
                    difficulty: "Medium",
                    points: 70,
                    coreSkill:
                        "Cycle detection with DSU",
                    concepts: [
                        "DSU",
                        "Undirected Cycle"
                    ],
                    story:
                        "A cable is redundant when its endpoints are already joined through earlier cables.",
                    task:
                        "Print YES if the edge stream creates any undirected cycle; otherwise print NO.",
                    inputSpec:
                        "N M followed by M undirected edges.",
                    outputSpec: "YES or NO.",
                    constraints:
                        "1 ≤ N,M ≤ 100000.",
                    sampleInput:
                        "4 4\n0 1\n1 2\n2 0\n2 3",
                    sampleOutput: "YES",
                    explanation:
                        "Edge 2–0 closes a cycle.",
                    hint:
                        "A cycle appears when both endpoints already have the same root.",
                    solution: String.raw`#include <stdio.h>

#define MAX 100005

int parent[MAX];
int size[MAX];

int find(int vertex)
{
    if (parent[vertex] == vertex)
        return vertex;

    return parent[vertex] =
        find(parent[vertex]);
}

int main(void)
{
    int n, m;
    int first, second;
    int cycle = 0;

    scanf("%d%d", &n, &m);

    for (int i = 0; i < n; i++) {
        parent[i] = i;
        size[i] = 1;
    }

    while (m--) {
        scanf("%d%d", &first, &second);

        first = find(first);
        second = find(second);

        if (first == second) {
            cycle = 1;
        } else {
            if (size[first] < size[second]) {
                int temporary = first;
                first = second;
                second = temporary;
            }

            parent[second] = first;
            size[first] += size[second];
        }
    }

    puts(cycle ? "YES" : "NO");
    return 0;
}`,
                    tests: [
                        {
                            input:
                                "4 4\n0 1\n1 2\n2 0\n2 3",
                            expected: "YES"
                        },
                        {
                            input:
                                "4 3\n0 1\n1 2\n2 3",
                            expected: "NO"
                        },
                        {
                            input: "1 0",
                            expected: "NO"
                        },
                        {
                            input:
                                "3 3\n0 1\n1 2\n0 2",
                            expected: "YES"
                        },
                        {
                            input:
                                "5 2\n0 1\n3 4",
                            expected: "NO"
                        }
                    ]
                })
            ]
        },

        {
            level: 10,
            host: "adsPracticeLevel10Challenges",
            challenges: [
                problem(10, 1, {
                    title: "Sparse Sensor Counter",
                    difficulty: "Starter",
                    points: 35,
                    coreSkill:
                        "Detect non-zero entries",
                    concepts: [
                        "Sparse Matrix",
                        "Traversal"
                    ],
                    story:
                        "A sensor grid contains mostly zero readings. The storage planner needs the number of values that would enter triple form.",
                    task:
                        "Count non-zero values in an R × C dense matrix.",
                    inputSpec:
                        "R C followed by R×C integers.",
                    outputSpec:
                        "Print the non-zero count.",
                    constraints:
                        "1 ≤ R,C ≤ 200.",
                    sampleInput:
                        "3 3\n0 5 0\n0 0 2\n7 0 0",
                    sampleOutput: "3",
                    explanation:
                        "Only 5, 2 and 7 are stored.",
                    hint:
                        "Increment the count whenever the current value is not zero.",
                    solution: String.raw`#include <stdio.h>

int main(void)
{
    int rows, columns;
    int value;
    int count = 0;

    scanf("%d%d", &rows, &columns);

    for (int i = 0; i < rows * columns; i++) {
        scanf("%d", &value);

        if (value != 0)
            count++;
    }

    printf("%d", count);
    return 0;
}`,
                    tests: [
                        {
                            input:
                                "3 3\n0 5 0\n0 0 2\n7 0 0",
                            expected: "3"
                        },
                        {
                            input:
                                "1 1\n0",
                            expected: "0"
                        },
                        {
                            input:
                                "2 2\n1 2\n3 4",
                            expected: "4"
                        },
                        {
                            input:
                                "2 3\n0 -1 0\n4 0 5",
                            expected: "3"
                        },
                        {
                            input:
                                "3 1\n0\n8\n0",
                            expected: "1"
                        }
                    ]
                }),

                problem(10, 2, {
                    title: "Coordinate Transpose",
                    difficulty: "Easy",
                    points: 50,
                    coreSkill:
                        "Triple transposition",
                    concepts: [
                        "Sparse Matrix",
                        "Coordinate List"
                    ],
                    story:
                        "A sparse image is stored as row, column and value triples. Rotating its coordinate system requires a transpose.",
                    task:
                        "Swap row and column in every supplied triple and print the transformed triples in the same order.",
                    inputSpec:
                        "R C NZ followed by NZ triples row column value.",
                    outputSpec:
                        "Print column row value for every triple.",
                    constraints:
                        "0 ≤ NZ ≤ 10000.",
                    sampleInput:
                        "3 4 3\n0 1 5\n1 3 7\n2 0 9",
                    sampleOutput:
                        "1 0 5\n3 1 7\n0 2 9",
                    explanation:
                        "Each coordinate (r,c) becomes (c,r).",
                    hint:
                        "The value does not change.",
                    solution: String.raw`#include <stdio.h>

int main(void)
{
    int rows, columns, nonZero;
    int row, column, value;

    scanf(
        "%d%d%d",
        &rows,
        &columns,
        &nonZero
    );

    for (int i = 0; i < nonZero; i++) {
        scanf(
            "%d%d%d",
            &row,
            &column,
            &value
        );

        printf(
            "%d %d %d",
            column,
            row,
            value
        );

        if (i + 1 < nonZero)
            printf("\n");
    }

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "3 4 3\n0 1 5\n1 3 7\n2 0 9",
                            expected:
                                "1 0 5\n3 1 7\n0 2 9"
                        },
                        {
                            input:
                                "1 1 1\n0 0 6",
                            expected:
                                "0 0 6"
                        },
                        {
                            input: "2 3 0",
                            expected: ""
                        },
                        {
                            input:
                                "2 2 2\n0 1 -3\n1 0 4",
                            expected:
                                "1 0 -3\n0 1 4"
                        },
                        {
                            input:
                                "5 4 1\n4 3 10",
                            expected:
                                "3 4 10"
                        }
                    ]
                }),

                problem(10, 3, {
                    title: "Sparse Row Totals",
                    difficulty: "Medium",
                    points: 60,
                    coreSkill:
                        "Aggregate coordinate triples",
                    concepts: [
                        "Sparse Matrix",
                        "Row Sum"
                    ],
                    story:
                        "A sparse accounting table stores only non-zero transactions. The report needs the total for every original row.",
                    task:
                        "Given R rows and NZ triples, print the sum of each row.",
                    inputSpec:
                        "R C NZ followed by row column value triples.",
                    outputSpec:
                        "Print R row sums separated by spaces.",
                    constraints:
                        "1 ≤ R,C ≤ 100000; NZ ≤ 100000.",
                    sampleInput:
                        "3 4 4\n0 1 5\n1 3 7\n2 0 9\n1 0 -2",
                    sampleOutput: "5 5 9",
                    explanation:
                        "Row one contains 7 and −2, giving 5.",
                    hint:
                        "Add every triple value to sum[row].",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int rows, columns, nonZero;
    int row, column;
    long long value;

    scanf(
        "%d%d%d",
        &rows,
        &columns,
        &nonZero
    );

    long long *sum = calloc(
        (size_t) rows,
        sizeof(long long)
    );

    for (int i = 0; i < nonZero; i++) {
        scanf(
            "%d%d%lld",
            &row,
            &column,
            &value
        );

        sum[row] += value;
    }

    for (int i = 0; i < rows; i++) {
        if (i)
            printf(" ");

        printf("%lld", sum[i]);
    }

    free(sum);
    return 0;
}`,
                    tests: [
                        {
                            input:
                                "3 4 4\n0 1 5\n1 3 7\n2 0 9\n1 0 -2",
                            expected: "5 5 9"
                        },
                        {
                            input: "1 5 0",
                            expected: "0"
                        },
                        {
                            input:
                                "2 2 2\n0 0 3\n0 1 4",
                            expected: "7 0"
                        },
                        {
                            input:
                                "4 4 3\n3 0 -1\n1 2 8\n3 3 6",
                            expected: "0 8 0 5"
                        },
                        {
                            input:
                                "2 3 3\n0 0 10\n1 1 -5\n1 2 5",
                            expected: "10 0"
                        }
                    ]
                })
            ]
        },

        {
            level: 11,
            host: "adsPracticeLevel11Challenges",
            challenges: [
                problem(11, 1, {
                    title:
                        "Overlapping Pattern Count",
                    difficulty: "Easy",
                    points: 50,
                    coreSkill:
                        "Naive pattern matching",
                    concepts: [
                        "Strings",
                        "Overlapping Matches"
                    ],
                    story:
                        "A log analyzer must count every occurrence of a signature, including occurrences that overlap.",
                    task:
                        "Count all occurrences of pattern P in text T.",
                    inputSpec:
                        "Line 1: lowercase text T. Line 2: lowercase pattern P.",
                    outputSpec:
                        "Print the occurrence count.",
                    constraints:
                        "1 ≤ |P| ≤ |T| ≤ 2000.",
                    sampleInput:
                        "aaaaa\naa",
                    sampleOutput: "4",
                    explanation:
                        "The pattern starts at positions 0, 1, 2 and 3.",
                    hint:
                        "Test every legal starting position.",
                    solution: String.raw`#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[2005];
    char pattern[2005];
    int count = 0;

    scanf("%2000s%2000s", text, pattern);

    int n = strlen(text);
    int m = strlen(pattern);

    for (int i = 0; i + m <= n; i++) {
        if (strncmp(text + i, pattern, m) == 0)
            count++;
    }

    printf("%d", count);
    return 0;
}`,
                    tests: [
                        {
                            input: "aaaaa\naa",
                            expected: "4"
                        },
                        {
                            input: "banana\nana",
                            expected: "2"
                        },
                        {
                            input: "abcabcabc\nabc",
                            expected: "3"
                        },
                        {
                            input: "abcdef\ngh",
                            expected: "0"
                        },
                        {
                            input: "aaaa\naaaa",
                            expected: "1"
                        }
                    ]
                }),

                problem(11, 2, {
                    title: "Prefix Table Builder",
                    difficulty: "Medium",
                    points: 65,
                    coreSkill:
                        "KMP prefix function",
                    concepts: [
                        "KMP",
                        "LPS Array"
                    ],
                    story:
                        "Before streaming searches begin, an engine precomputes how much of a pattern can be reused after a mismatch.",
                    task:
                        "Build and print the KMP LPS array for a pattern.",
                    inputSpec:
                        "One lowercase pattern.",
                    outputSpec:
                        "Print all LPS values separated by spaces.",
                    constraints:
                        "1 ≤ length ≤ 100000.",
                    sampleInput: "ababaca",
                    sampleOutput:
                        "0 0 1 2 3 0 1",
                    explanation:
                        "Each value is the longest proper prefix that is also a suffix.",
                    hint:
                        "On mismatch, fall back to lps[length−1].",
                    solution: String.raw`#include <stdio.h>
#include <string.h>

#define MAX 100005

int main(void)
{
    char pattern[MAX];
    int lps[MAX] = {0};
    int length = 0;

    scanf("%100000s", pattern);

    int n = strlen(pattern);

    for (int i = 1; i < n;) {
        if (pattern[i] == pattern[length]) {
            lps[i] = ++length;
            i++;
        } else if (length) {
            length = lps[length - 1];
        } else {
            lps[i] = 0;
            i++;
        }
    }

    for (int i = 0; i < n; i++) {
        if (i)
            printf(" ");

        printf("%d", lps[i]);
    }

    return 0;
}`,
                    tests: [
                        {
                            input: "ababaca",
                            expected:
                                "0 0 1 2 3 0 1"
                        },
                        {
                            input: "a",
                            expected: "0"
                        },
                        {
                            input: "aaaa",
                            expected: "0 1 2 3"
                        },
                        {
                            input: "abcd",
                            expected: "0 0 0 0"
                        },
                        {
                            input: "aabaacaabaa",
                            expected:
                                "0 1 0 1 2 0 1 2 3 4 5"
                        }
                    ]
                }),

                problem(11, 3, {
                    title: "First KMP Match",
                    difficulty: "Advanced",
                    points: 80,
                    coreSkill:
                        "Linear-time string search",
                    concepts: [
                        "KMP",
                        "Failure Function"
                    ],
                    story:
                        "A monitoring service needs the earliest exact signature match without moving backward in the text.",
                    task:
                        "Print the zero-based index of the first occurrence of P in T, or −1.",
                    inputSpec:
                        "Line 1: text. Line 2: pattern.",
                    outputSpec:
                        "First matching index or −1.",
                    constraints:
                        "1 ≤ |T|,|P| ≤ 100000.",
                    sampleInput:
                        "abxabcabcaby\nabcaby",
                    sampleOutput: "6",
                    explanation:
                        "The first full match starts at index 6.",
                    hint:
                        "Build LPS, then preserve the matched prefix length after a mismatch.",
                    solution: String.raw`#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(void)
{
    char text[100005];
    char pattern[100005];

    scanf("%100000s%100000s", text, pattern);

    int n = strlen(text);
    int m = strlen(pattern);
    int *lps = calloc(
        (size_t) m,
        sizeof(int)
    );

    for (int i = 1, length = 0; i < m;) {
        if (pattern[i] == pattern[length]) {
            lps[i++] = ++length;
        } else if (length) {
            length = lps[length - 1];
        } else {
            lps[i++] = 0;
        }
    }

    int i = 0;
    int j = 0;
    int answer = -1;

    while (i < n) {
        if (text[i] == pattern[j]) {
            i++;
            j++;

            if (j == m) {
                answer = i - m;
                break;
            }
        } else if (j) {
            j = lps[j - 1];
        } else {
            i++;
        }
    }

    printf("%d", answer);
    free(lps);

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "abxabcabcaby\nabcaby",
                            expected: "6"
                        },
                        {
                            input:
                                "aaaaa\naa",
                            expected: "0"
                        },
                        {
                            input:
                                "abcdef\ndef",
                            expected: "3"
                        },
                        {
                            input:
                                "abcdef\ngh",
                            expected: "-1"
                        },
                        {
                            input:
                                "same\nsame",
                            expected: "0"
                        }
                    ]
                })
            ]
        },

        {
            level: 12,
            host: "adsPracticeLevel12Challenges",
            challenges: [
                problem(12, 1, {
                    title: "Stable Merge Ordering",
                    difficulty: "Easy",
                    points: 55,
                    coreSkill: "Merge sort",
                    concepts: [
                        "Divide and Conquer",
                        "Stable Sort"
                    ],
                    story:
                        "A reporting engine must order large batches predictably using merge-based processing.",
                    task:
                        "Sort N integers in nondecreasing order using merge sort.",
                    inputSpec:
                        "N followed by N integers.",
                    outputSpec:
                        "Sorted integers separated by spaces.",
                    constraints:
                        "1 ≤ N ≤ 100000.",
                    sampleInput:
                        "6\n8 3 5 3 9 1",
                    sampleOutput:
                        "1 3 3 5 8 9",
                    explanation:
                        "All values are ordered and duplicates are preserved.",
                    hint:
                        "Sort both halves, then merge with two pointers.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

void mergeSort(
    int *array,
    int *temporary,
    int left,
    int right
)
{
    if (left >= right)
        return;

    int middle = (left + right) / 2;

    mergeSort(
        array,
        temporary,
        left,
        middle
    );

    mergeSort(
        array,
        temporary,
        middle + 1,
        right
    );

    int first = left;
    int second = middle + 1;
    int position = left;

    while (
        first <= middle &&
        second <= right
    ) {
        if (array[first] <= array[second])
            temporary[position++] =
                array[first++];
        else
            temporary[position++] =
                array[second++];
    }

    while (first <= middle)
        temporary[position++] =
            array[first++];

    while (second <= right)
        temporary[position++] =
            array[second++];

    for (int i = left; i <= right; i++)
        array[i] = temporary[i];
}

int main(void)
{
    int n;

    scanf("%d", &n);

    int *array = malloc(
        (size_t) n * sizeof(int)
    );

    int *temporary = malloc(
        (size_t) n * sizeof(int)
    );

    for (int i = 0; i < n; i++)
        scanf("%d", &array[i]);

    mergeSort(
        array,
        temporary,
        0,
        n - 1
    );

    for (int i = 0; i < n; i++) {
        if (i)
            printf(" ");

        printf("%d", array[i]);
    }

    free(array);
    free(temporary);

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "6\n8 3 5 3 9 1",
                            expected:
                                "1 3 3 5 8 9"
                        },
                        {
                            input:
                                "1\n7",
                            expected: "7"
                        },
                        {
                            input:
                                "5\n5 4 3 2 1",
                            expected:
                                "1 2 3 4 5"
                        },
                        {
                            input:
                                "4\n-1 8 0 -3",
                            expected:
                                "-3 -1 0 8"
                        },
                        {
                            input:
                                "5\n2 2 2 1 1",
                            expected:
                                "1 1 2 2 2"
                        }
                    ]
                }),

                problem(12, 2, {
                    title: "Inversion Audit",
                    difficulty: "Advanced",
                    points: 85,
                    coreSkill:
                        "Count inversions during merge",
                    concepts: [
                        "Merge Sort",
                        "Inversions"
                    ],
                    story:
                        "An ordering audit measures how far a sequence is from sorted order by counting reversed pairs.",
                    task:
                        "Count pairs (i,j) where i<j and a[i]>a[j].",
                    inputSpec:
                        "N followed by N integers.",
                    outputSpec:
                        "Print the inversion count.",
                    constraints:
                        "1 ≤ N ≤ 200000.",
                    sampleInput:
                        "5\n2 4 1 3 5",
                    sampleOutput: "3",
                    explanation:
                        "The inversions are (2,1), (4,1) and (4,3).",
                    hint:
                        "When the right value wins during merge, add the unmerged left count.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

long long countInversions(
    int *array,
    int *temporary,
    int left,
    int right
)
{
    if (left >= right)
        return 0;

    int middle = (left + right) / 2;

    long long answer =
        countInversions(
            array,
            temporary,
            left,
            middle
        ) +
        countInversions(
            array,
            temporary,
            middle + 1,
            right
        );

    int first = left;
    int second = middle + 1;
    int position = left;

    while (
        first <= middle &&
        second <= right
    ) {
        if (array[first] <= array[second]) {
            temporary[position++] =
                array[first++];
        } else {
            temporary[position++] =
                array[second++];

            answer +=
                middle - first + 1;
        }
    }

    while (first <= middle)
        temporary[position++] =
            array[first++];

    while (second <= right)
        temporary[position++] =
            array[second++];

    for (int i = left; i <= right; i++)
        array[i] = temporary[i];

    return answer;
}

int main(void)
{
    int n;

    scanf("%d", &n);

    int *array = malloc(
        (size_t) n * sizeof(int)
    );

    int *temporary = malloc(
        (size_t) n * sizeof(int)
    );

    for (int i = 0; i < n; i++)
        scanf("%d", &array[i]);

    printf(
        "%lld",
        countInversions(
            array,
            temporary,
            0,
            n - 1
        )
    );

    free(array);
    free(temporary);

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "5\n2 4 1 3 5",
                            expected: "3"
                        },
                        {
                            input:
                                "5\n1 2 3 4 5",
                            expected: "0"
                        },
                        {
                            input:
                                "5\n5 4 3 2 1",
                            expected: "10"
                        },
                        {
                            input:
                                "3\n2 2 1",
                            expected: "2"
                        },
                        {
                            input:
                                "1\n9",
                            expected: "0"
                        }
                    ]
                }),

                problem(12, 3, {
                    title:
                        "Bounded Counting Sort",
                    difficulty: "Medium",
                    points: 65,
                    coreSkill:
                        "Frequency-based sorting",
                    concepts: [
                        "Counting Sort",
                        "Frequency Array"
                    ],
                    story:
                        "Exam ratings lie in a known small range, so comparison sorting is unnecessary.",
                    task:
                        "Sort non-negative integers whose values do not exceed 1000.",
                    inputSpec:
                        "N followed by N integers.",
                    outputSpec:
                        "Sorted sequence.",
                    constraints:
                        "1 ≤ N ≤ 100000; 0 ≤ value ≤ 1000.",
                    sampleInput:
                        "7\n4 2 2 8 3 3 1",
                    sampleOutput:
                        "1 2 2 3 3 4 8",
                    explanation:
                        "Frequencies reproduce the values in order.",
                    hint:
                        "Count every value, then print each index frequency times.",
                    solution: String.raw`#include <stdio.h>

int main(void)
{
    int n;
    int value;
    int count[1001] = {0};
    int first = 1;

    scanf("%d", &n);

    for (int i = 0; i < n; i++) {
        scanf("%d", &value);
        count[value]++;
    }

    for (int value = 0; value <= 1000; value++) {
        while (count[value]--) {
            if (!first)
                printf(" ");

            printf("%d", value);
            first = 0;
        }
    }

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "7\n4 2 2 8 3 3 1",
                            expected:
                                "1 2 2 3 3 4 8"
                        },
                        {
                            input:
                                "1\n0",
                            expected: "0"
                        },
                        {
                            input:
                                "5\n5 5 5 5 5",
                            expected:
                                "5 5 5 5 5"
                        },
                        {
                            input:
                                "6\n1000 0 10 1 0 999",
                            expected:
                                "0 0 1 10 999 1000"
                        },
                        {
                            input:
                                "4\n3 2 1 0",
                            expected:
                                "0 1 2 3"
                        }
                    ]
                })
            ]
        },

        {
            level: 13,
            host: "adsPracticeLevel13Challenges",
            challenges: [
                problem(13, 1, {
                    title:
                        "First Boundary Search",
                    difficulty: "Easy",
                    points: 50,
                    coreSkill: "First occurrence",
                    concepts: [
                        "Binary Search",
                        "Lower Bound"
                    ],
                    story:
                        "A sorted event log may repeat a code. The dashboard needs its earliest position.",
                    task:
                        "Print the zero-based first occurrence of target, or −1.",
                    inputSpec:
                        "N, N sorted integers, then target.",
                    outputSpec:
                        "First index or −1.",
                    constraints:
                        "1 ≤ N ≤ 100000.",
                    sampleInput:
                        "7\n1 2 2 2 5 8 9\n2",
                    sampleOutput: "1",
                    explanation:
                        "The first 2 occurs at index 1.",
                    hint:
                        "After finding target, save the index and continue left.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int n;
    int target;
    int answer = -1;

    scanf("%d", &n);

    int *array = malloc(
        (size_t) n * sizeof(int)
    );

    for (int i = 0; i < n; i++)
        scanf("%d", &array[i]);

    scanf("%d", &target);

    int left = 0;
    int right = n - 1;

    while (left <= right) {
        int middle =
            left + (right - left) / 2;

        if (array[middle] >= target) {
            if (array[middle] == target)
                answer = middle;

            right = middle - 1;
        } else {
            left = middle + 1;
        }
    }

    printf("%d", answer);
    free(array);

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "7\n1 2 2 2 5 8 9\n2",
                            expected: "1"
                        },
                        {
                            input:
                                "1\n5\n5",
                            expected: "0"
                        },
                        {
                            input:
                                "4\n1 3 5 7\n2",
                            expected: "-1"
                        },
                        {
                            input:
                                "5\n4 4 4 4 4\n4",
                            expected: "0"
                        },
                        {
                            input:
                                "6\n-3 -1 -1 0 2 2\n-1",
                            expected: "1"
                        }
                    ]
                }),

                problem(13, 2, {
                    title:
                        "Rotated Array Lookup",
                    difficulty: "Medium",
                    points: 70,
                    coreSkill:
                        "Search rotated sorted data",
                    concepts: [
                        "Binary Search",
                        "Rotation"
                    ],
                    story:
                        "A circular catalog preserves sorted order except for one rotation point. A direct linear scan is too slow.",
                    task:
                        "Find target in a rotated sorted array of distinct integers.",
                    inputSpec:
                        "N, N rotated sorted integers, then target.",
                    outputSpec:
                        "Zero-based index or −1.",
                    constraints:
                        "1 ≤ N ≤ 100000.",
                    sampleInput:
                        "7\n4 5 6 7 0 1 2\n0",
                    sampleOutput: "4",
                    explanation:
                        "Target 0 is at index 4.",
                    hint:
                        "At least one half around the middle is sorted.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int n;
    int target;
    int answer = -1;

    scanf("%d", &n);

    int *array = malloc(
        (size_t) n * sizeof(int)
    );

    for (int i = 0; i < n; i++)
        scanf("%d", &array[i]);

    scanf("%d", &target);

    int left = 0;
    int right = n - 1;

    while (left <= right) {
        int middle =
            left + (right - left) / 2;

        if (array[middle] == target) {
            answer = middle;
            break;
        }

        if (array[left] <= array[middle]) {
            if (
                array[left] <= target &&
                target < array[middle]
            ) {
                right = middle - 1;
            } else {
                left = middle + 1;
            }
        } else {
            if (
                array[middle] < target &&
                target <= array[right]
            ) {
                left = middle + 1;
            } else {
                right = middle - 1;
            }
        }
    }

    printf("%d", answer);
    free(array);

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "7\n4 5 6 7 0 1 2\n0",
                            expected: "4"
                        },
                        {
                            input:
                                "1\n5\n5",
                            expected: "0"
                        },
                        {
                            input:
                                "5\n3 4 5 1 2\n4",
                            expected: "1"
                        },
                        {
                            input:
                                "5\n3 4 5 1 2\n9",
                            expected: "-1"
                        },
                        {
                            input:
                                "6\n1 2 3 4 5 6\n6",
                            expected: "5"
                        }
                    ]
                }),

                problem(13, 3, {
                    title:
                        "Integer Square-Root Search",
                    difficulty: "Medium",
                    points: 65,
                    coreSkill:
                        "Binary search on answer",
                    concepts: [
                        "Monotonic Predicate",
                        "Overflow Safety"
                    ],
                    story:
                        "A firmware module needs floor(sqrt(N)) without floating-point operations.",
                    task:
                        "Print the largest integer x such that x² ≤ N.",
                    inputSpec:
                        "One integer N.",
                    outputSpec:
                        "floor(sqrt(N)).",
                    constraints:
                        "0 ≤ N ≤ 10^18.",
                    sampleInput: "27",
                    sampleOutput: "5",
                    explanation:
                        "5²≤27 while 6²>27.",
                    hint:
                        "Compare middle with N/middle to avoid overflow.",
                    solution: String.raw`#include <stdio.h>

int main(void)
{
    unsigned long long n;

    scanf("%llu", &n);

    unsigned long long left = 0;
    unsigned long long right =
        n < 1000000000ULL
            ? n
            : 1000000000ULL;

    unsigned long long answer = 0;

    while (left <= right) {
        unsigned long long middle =
            left + (right - left) / 2;

        if (
            middle == 0 ||
            middle <= n / middle
        ) {
            answer = middle;
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    printf("%llu", answer);
    return 0;
}`,
                    tests: [
                        {
                            input: "27",
                            expected: "5"
                        },
                        {
                            input: "0",
                            expected: "0"
                        },
                        {
                            input: "1",
                            expected: "1"
                        },
                        {
                            input: "16",
                            expected: "4"
                        },
                        {
                            input:
                                "1000000000000000000",
                            expected:
                                "1000000000"
                        }
                    ]
                })
            ]
        },

        {
                      level: 14,
            host: "adsPracticeLevel14Challenges",
            challenges: [
                problem(14, 1, {
                    title: "AVL Root Monitor",
                    difficulty: "Medium",
                    points: 75,
                    coreSkill: "AVL insertion and rotations",
                    concepts: ["AVL Tree", "Rotations"],
                    story:
                        "A balanced index receives distinct keys and reports the root after all automatic rotations.",
                    task:
                        "Insert keys into an AVL tree and print the final root key.",
                    inputSpec:
                        "N followed by N distinct keys.",
                    outputSpec: "Final root key.",
                    constraints: "1 ≤ N ≤ 1000.",
                    sampleInput: "3\n30 20 10",
                    sampleOutput: "20",
                    explanation:
                        "An LL imbalance causes a right rotation at 30.",
                    hint:
                        "Update height before checking the four rotation cases.",
                    solution: avlProgram("root"),
                    tests: [
                        {
                            input: "3\n30 20 10",
                            expected: "20"
                        },
                        {
                            input: "3\n10 20 30",
                            expected: "20"
                        },
                        {
                            input: "3\n30 10 20",
                            expected: "20"
                        },
                        {
                            input: "3\n10 30 20",
                            expected: "20"
                        },
                        {
                            input:
                                "6\n10 20 30 40 50 25",
                            expected: "30"
                        }
                    ]
                }),

                problem(14, 2, {
                    title:
                        "Balanced Preorder Report",
                    difficulty: "Advanced",
                    points: 90,
                    coreSkill:
                        "Observe AVL structure",
                    concepts: [
                        "AVL Tree",
                        "Preorder"
                    ],
                    story:
                        "After balancing a search index, an audit exports its preorder sequence.",
                    task:
                        "Insert distinct keys into an AVL tree and print preorder traversal.",
                    inputSpec:
                        "N followed by N keys.",
                    outputSpec:
                        "Preorder keys separated by spaces.",
                    constraints: "1 ≤ N ≤ 1000.",
                    sampleInput:
                        "6\n10 20 30 40 50 25",
                    sampleOutput:
                        "30 20 10 25 40 50",
                    explanation:
                        "Rotations place 30 at the balanced root.",
                    hint:
                        "Visit root, left subtree, then right subtree after all insertions.",
                    solution: avlProgram("preorder"),
                    tests: [
                        {
                            input:
                                "6\n10 20 30 40 50 25",
                            expected:
                                "30 20 10 25 40 50"
                        },
                        {
                            input: "3\n30 20 10",
                            expected: "20 10 30"
                        },
                        {
                            input: "3\n10 30 20",
                            expected: "20 10 30"
                        },
                        {
                            input: "1\n7",
                            expected: "7"
                        },
                        {
                            input:
                                "5\n50 40 30 20 10",
                            expected:
                                "40 20 10 30 50"
                        }
                    ]
                }),

                problem(14, 3, {
                    title:
                        "AVL Height Certificate",
                    difficulty: "Advanced",
                    points: 85,
                    coreSkill:
                        "Maintain subtree heights",
                    concepts: [
                        "AVL Tree",
                        "Height Invariant"
                    ],
                    story:
                        "A database index verifies that its root stores the correct one-based height after every balancing operation.",
                    task:
                        "Insert distinct keys and print the final AVL height, where a leaf has height 1.",
                    inputSpec:
                        "N followed by N keys.",
                    outputSpec: "Tree height.",
                    constraints: "1 ≤ N ≤ 100000.",
                    sampleInput:
                        "6\n10 20 30 40 50 25",
                    sampleOutput: "3",
                    explanation:
                        "The balanced tree has three levels.",
                    hint:
                        "Each node height is 1 + max(left height, right height).",
                    solution: avlProgram("height"),
                    tests: [
                        {
                            input:
                                "6\n10 20 30 40 50 25",
                            expected: "3"
                        },
                        {
                            input: "1\n8",
                            expected: "1"
                        },
                        {
                            input: "3\n1 2 3",
                            expected: "2"
                        },
                        {
                            input:
                                "7\n4 2 6 1 3 5 7",
                            expected: "3"
                        },
                        {
                            input:
                                "5\n50 40 30 20 10",
                            expected: "3"
                        }
                    ]
                })
            ]
        },

        {
            level: 15,
            host: "adsPracticeLevel15Challenges",
            challenges: [
                problem(15, 1, {
                    title:
                        "Trie Word Verification",
                    difficulty: "Easy",
                    points: 55,
                    coreSkill: "Exact trie search",
                    concepts: [
                        "Trie",
                        "Terminal Node"
                    ],
                    story:
                        "A dictionary service distinguishes complete stored words from prefixes.",
                    task:
                        "Insert N lowercase words and print FOUND if the query is a complete stored word.",
                    inputSpec:
                        "N, N words, then query.",
                    outputSpec:
                        "FOUND or NOT FOUND.",
                    constraints:
                        "Total characters ≤ 100000.",
                    sampleInput:
                        "4\napp apple bat ball\napp",
                    sampleOutput: "FOUND",
                    explanation:
                        "app ends at a terminal node.",
                    hint:
                        "A path alone is insufficient; check the terminal flag.",
                    solution: trieProgram("search"),
                    tests: [
                        {
                            input:
                                "4\napp apple bat ball\napp",
                            expected: "FOUND"
                        },
                        {
                            input:
                                "4\napp apple bat ball\nap",
                            expected: "NOT FOUND"
                        },
                        {
                            input:
                                "2\ncat dog\ndog",
                            expected: "FOUND"
                        },
                        {
                            input:
                                "2\ncat dog\ncow",
                            expected: "NOT FOUND"
                        },
                        {
                            input:
                                "1\na\na",
                            expected: "FOUND"
                        }
                    ]
                }),

                problem(15, 2, {
                    title: "Prefix Popularity",
                    difficulty: "Medium",
                    points: 70,
                    coreSkill:
                        "Count words by prefix",
                    concepts: [
                        "Trie",
                        "Prefix Count"
                    ],
                    story:
                        "An autocomplete service ranks a prefix by how many stored words begin with it.",
                    task:
                        "Insert N lowercase words and print how many begin with the query prefix.",
                    inputSpec:
                        "N, N words, then prefix.",
                    outputSpec: "Prefix count.",
                    constraints:
                        "Total characters ≤ 100000.",
                    sampleInput:
                        "5\napp apple apply bat ball\napp",
                    sampleOutput: "3",
                    explanation:
                        "app, apple and apply share the prefix.",
                    hint:
                        "Increment a pass counter after moving into each character node.",
                    solution: trieProgram("prefix"),
                    tests: [
                        {
                            input:
                                "5\napp apple apply bat ball\napp",
                            expected: "3"
                        },
                        {
                            input:
                                "3\ncat car dog\nca",
                            expected: "2"
                        },
                        {
                            input:
                                "3\ncat car dog\nz",
                            expected: "0"
                        },
                        {
                            input:
                                "1\na\na",
                            expected: "1"
                        },
                        {
                            input:
                                "4\ntest team tea ten\nte",
                            expected: "4"
                        }
                    ]
                }),

                problem(15, 3, {
                    title:
                        "Maximum XOR Partner",
                    difficulty: "Advanced",
                    points: 90,
                    coreSkill:
                        "Binary trie greedy search",
                    concepts: [
                        "Binary Trie",
                        "Maximum XOR"
                    ],
                    story:
                        "A bitwise analytics engine pairs a query with the stored number producing the largest XOR value.",
                    task:
                        "Insert N non-negative integers and print the maximum XOR obtainable with query Q.",
                    inputSpec:
                        "N, N integers, then Q.",
                    outputSpec:
                        "Maximum XOR value.",
                    constraints:
                        "1 ≤ N ≤ 100000; values < 2^30.",
                    sampleInput:
                        "5\n5 25 10 2 8\n5",
                    sampleOutput: "28",
                    explanation:
                        "5 XOR 25 equals 28.",
                    hint:
                        "At each bit prefer the branch opposite to the query bit.",
                    solution: trieProgram("xor"),
                    tests: [
                        {
                            input:
                                "5\n5 25 10 2 8\n5",
                            expected: "28"
                        },
                        {
                            input:
                                "1\n7\n7",
                            expected: "0"
                        },
                        {
                            input:
                                "3\n0 1 2\n3",
                            expected: "3"
                        },
                        {
                            input:
                                "4\n8 1 2 15\n5",
                            expected: "13"
                        },
                        {
                            input:
                                "3\n10 20 30\n7",
                            expected: "25"
                        }
                    ]
                })
            ]
        },

        {
            level: 16,
            host: "adsPracticeLevel16Challenges",
            challenges: [
                problem(16, 1, {
                    title:
                        "B-Tree Capacity Sheet",
                    difficulty: "Starter",
                    points: 35,
                    coreSkill:
                        "Minimum-degree rules",
                    concepts: [
                        "B-Tree",
                        "Node Capacity"
                    ],
                    story:
                        "A storage designer chooses minimum degree t and needs the maximum keys and children of one B-tree node.",
                    task:
                        "Print maximum keys and maximum children for degree t.",
                    inputSpec: "One integer t.",
                    outputSpec:
                        "Print 2t−1 and 2t.",
                    constraints: "2 ≤ t ≤ 10^9.",
                    sampleInput: "2",
                    sampleOutput: "3 4",
                    explanation:
                        "A degree-2 B-tree is a 2–3–4 tree.",
                    hint:
                        "Use the defining B-tree degree formulas.",
                    solution: String.raw`#include <stdio.h>

int main(void)
{
    long long degree;

    scanf("%lld", &degree);

    printf(
        "%lld %lld",
        2 * degree - 1,
        2 * degree
    );

    return 0;
}`,
                    tests: [
                        {
                            input: "2",
                            expected: "3 4"
                        },
                        {
                            input: "3",
                            expected: "5 6"
                        },
                        {
                            input: "10",
                            expected: "19 20"
                        },
                        {
                            input: "100",
                            expected: "199 200"
                        },
                        {
                            input: "1000000000",
                            expected:
                                "1999999999 2000000000"
                        }
                    ]
                }),

                problem(16, 2, {
                    title: "Multiway Node Scan",
                    difficulty: "Easy",
                    points: 50,
                    coreSkill:
                        "Search inside a B-tree node",
                    concepts: [
                        "B-Tree",
                        "Node Search"
                    ],
                    story:
                        "A B-tree node stores sorted separator keys. The search routine must find the exact slot before choosing a child.",
                    task:
                        "Print the zero-based index of target in a sorted node, or −1.",
                    inputSpec:
                        "K, K sorted keys, then target.",
                    outputSpec: "Index or −1.",
                    constraints: "1 ≤ K ≤ 1000.",
                    sampleInput:
                        "4\n10 20 35 50\n35",
                    sampleOutput: "2",
                    explanation:
                        "35 occupies slot 2.",
                    hint:
                        "Scan until key[i] is not smaller than target.",
                    solution: String.raw`#include <stdio.h>

int main(void)
{
    int count;
    int keys[1000];
    int target;
    int index = -1;

    scanf("%d", &count);

    for (int i = 0; i < count; i++)
        scanf("%d", &keys[i]);

    scanf("%d", &target);

    int position = 0;

    while (
        position < count &&
        keys[position] < target
    ) {
        position++;
    }

    if (
        position < count &&
        keys[position] == target
    ) {
        index = position;
    }

    printf("%d", index);
    return 0;
}`,
                    tests: [
                        {
                            input:
                                "4\n10 20 35 50\n35",
                            expected: "2"
                        },
                        {
                            input:
                                "1\n9\n9",
                            expected: "0"
                        },
                        {
                            input:
                                "3\n1 4 7\n5",
                            expected: "-1"
                        },
                        {
                            input:
                                "5\n-5 -1 0 8 10\n-5",
                            expected: "0"
                        },
                        {
                            input:
                                "4\n2 4 6 8\n8",
                            expected: "3"
                        }
                    ]
                }),

                problem(16, 3, {
                    title:
                        "2–3–4 Split Promotion",
                    difficulty: "Medium",
                    points: 65,
                    coreSkill:
                        "Promote a median",
                    concepts: [
                        "B-Tree",
                        "Split"
                    ],
                    story:
                        "A full 2–3–4 tree node contains three keys. Splitting keeps the smallest left, promotes the median and keeps the largest right.",
                    task:
                        "Read three distinct keys in any order, sort them and print left | promoted | right.",
                    inputSpec:
                        "Three distinct integers.",
                    outputSpec:
                        "a | b | c after sorting.",
                    constraints: "Keys fit in int.",
                    sampleInput: "30 10 20",
                    sampleOutput:
                        "10 | 20 | 30",
                    explanation:
                        "20 is promoted to the parent.",
                    hint:
                        "Sort the three values before choosing the median.",
                    solution: String.raw`#include <stdio.h>

int main(void)
{
    int keys[3];

    scanf(
        "%d%d%d",
        &keys[0],
        &keys[1],
        &keys[2]
    );

    for (int i = 0; i < 2; i++) {
        for (int j = i + 1; j < 3; j++) {
            if (keys[i] > keys[j]) {
                int temporary = keys[i];
                keys[i] = keys[j];
                keys[j] = temporary;
            }
        }
    }

    printf(
        "%d | %d | %d",
        keys[0],
        keys[1],
        keys[2]
    );

    return 0;
}`,
                    tests: [
                        {
                            input: "30 10 20",
                            expected:
                                "10 | 20 | 30"
                        },
                        {
                            input: "1 2 3",
                            expected:
                                "1 | 2 | 3"
                        },
                        {
                            input: "9 -1 5",
                            expected:
                                "-1 | 5 | 9"
                        },
                        {
                            input: "100 0 50",
                            expected:
                                "0 | 50 | 100"
                        },
                        {
                            input: "-3 -9 -1",
                            expected:
                                "-9 | -3 | -1"
                        }
                    ]
                })
            ]
        },

        {
            level: 17,
            host: "adsPracticeLevel17Challenges",
            challenges: [
                problem(17, 1, {
                    title: "Bottom-Up Max Heap",
                    difficulty: "Medium",
                    points: 70,
                    coreSkill:
                        "Heap construction",
                    concepts: [
                        "Max Heap",
                        "Heapify"
                    ],
                    story:
                        "A priority service receives an unsorted batch and converts it into a max heap in linear time.",
                    task:
                        "Build a max heap using bottom-up heapify and print its array representation.",
                    inputSpec:
                        "N followed by N integers.",
                    outputSpec: "Heap array.",
                    constraints: "1 ≤ N ≤ 100000.",
                    sampleInput:
                        "6\n3 1 6 5 2 4",
                    sampleOutput:
                        "6 5 4 1 2 3",
                    explanation:
                        "Every parent is at least as large as its children.",
                    hint:
                        "Heapify from the last internal node down to the root.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

void heapifyDown(
    int *array,
    int count,
    int position
)
{
    while (1) {
        int largest = position;
        int left = 2 * position + 1;
        int right = 2 * position + 2;

        if (
            left < count &&
            array[left] > array[largest]
        ) {
            largest = left;
        }

        if (
            right < count &&
            array[right] > array[largest]
        ) {
            largest = right;
        }

        if (largest == position)
            break;

        int temporary = array[position];
        array[position] = array[largest];
        array[largest] = temporary;
        position = largest;
    }
}

int main(void)
{
    int n;

    scanf("%d", &n);

    int *array = malloc(
        (size_t) n * sizeof(int)
    );

    for (int i = 0; i < n; i++)
        scanf("%d", &array[i]);

    for (int i = n / 2 - 1; i >= 0; i--)
        heapifyDown(array, n, i);

    for (int i = 0; i < n; i++) {
        if (i)
            printf(" ");

        printf("%d", array[i]);
    }

    free(array);
    return 0;
}`,
                    tests: [
                        {
                            input:
                                "6\n3 1 6 5 2 4",
                            expected:
                                "6 5 4 1 2 3"
                        },
                        {
                            input: "1\n7",
                            expected: "7"
                        },
                        {
                            input:
                                "5\n5 4 3 2 1",
                            expected:
                                "5 4 3 2 1"
                        },
                        {
                            input:
                                "4\n1 2 3 4",
                            expected:
                                "4 2 3 1"
                        },
                        {
                            input:
                                "7\n2 9 7 6 5 8 1",
                            expected:
                                "9 6 8 2 5 7 1"
                        }
                    ]
                }),

                problem(17, 2, {
                    title:
                        "Kth Largest Stream",
                    difficulty: "Advanced",
                    points: 85,
                    coreSkill:
                        "Fixed-size min heap",
                    concepts: [
                        "Heap",
                        "Top K"
                    ],
                    story:
                        "A live leaderboard retains only the K largest scores; its smallest retained score is the answer.",
                    task:
                        "Print the Kth largest of N integers.",
                    inputSpec:
                        "N K followed by N integers.",
                    outputSpec:
                        "Kth largest value.",
                    constraints:
                        "1 ≤ K ≤ N ≤ 100000.",
                    sampleInput:
                        "6 3\n4 5 8 2 10 9",
                    sampleOutput: "8",
                    explanation:
                        "The three largest values are 10, 9 and 8.",
                    hint:
                        "Keep a min heap of at most K values.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

void moveUp(int *heap, int position)
{
    while (position) {
        int parent = (position - 1) / 2;

        if (heap[parent] <= heap[position])
            break;

        int temporary = heap[parent];
        heap[parent] = heap[position];
        heap[position] = temporary;
        position = parent;
    }
}

void moveDown(
    int *heap,
    int count,
    int position
)
{
    while (1) {
        int smallest = position;
        int left = 2 * position + 1;
        int right = 2 * position + 2;

        if (
            left < count &&
            heap[left] < heap[smallest]
        ) {
            smallest = left;
        }

        if (
            right < count &&
            heap[right] < heap[smallest]
        ) {
            smallest = right;
        }

        if (smallest == position)
            break;

        int temporary = heap[position];
        heap[position] = heap[smallest];
        heap[smallest] = temporary;
        position = smallest;
    }
}

int main(void)
{
    int n, k;
    int value;
    int size = 0;

    scanf("%d%d", &n, &k);

    int *heap = malloc(
        (size_t) k * sizeof(int)
    );

    for (int i = 0; i < n; i++) {
        scanf("%d", &value);

        if (size < k) {
            heap[size] = value;
            moveUp(heap, size);
            size++;
        } else if (value > heap[0]) {
            heap[0] = value;
            moveDown(heap, size, 0);
        }
    }

    printf("%d", heap[0]);
    free(heap);

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "6 3\n4 5 8 2 10 9",
                            expected: "8"
                        },
                        {
                            input:
                                "1 1\n7",
                            expected: "7"
                        },
                        {
                            input:
                                "5 2\n5 5 4 3 2",
                            expected: "5"
                        },
                        {
                            input:
                                "6 6\n9 1 8 2 7 3",
                            expected: "1"
                        },
                        {
                            input:
                                "5 1\n-3 -8 -1 -5 -2",
                            expected: "-1"
                        }
                    ]
                }),

                problem(17, 3, {
                    title:
                        "Running Median Console",
                    difficulty: "Advanced",
                    points: 95,
                    coreSkill:
                        "Two-heap balancing",
                    concepts: [
                        "Max Heap",
                        "Min Heap",
                        "Median"
                    ],
                    story:
                        "A telemetry console displays the median after every incoming reading.",
                    task:
                        "Print each running median with one digit after the decimal point.",
                    inputSpec:
                        "N followed by N integers.",
                    outputSpec:
                        "N medians separated by spaces.",
                    constraints: "1 ≤ N ≤ 10000.",
                    sampleInput:
                        "5\n5 15 1 3 8",
                    sampleOutput:
                        "5.0 10.0 5.0 4.0 5.0",
                    explanation:
                        "The two halves stay balanced after every insertion.",
                    hint:
                        "Max-heap stores the lower half; min-heap stores the upper half.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

void maxMoveUp(int *heap, int position)
{
    while (position) {
        int parent = (position - 1) / 2;

        if (heap[parent] >= heap[position])
            break;

        int temporary = heap[parent];
        heap[parent] = heap[position];
        heap[position] = temporary;
        position = parent;
    }
}

void minMoveUp(int *heap, int position)
{
    while (position) {
        int parent = (position - 1) / 2;

        if (heap[parent] <= heap[position])
            break;

        int temporary = heap[parent];
        heap[parent] = heap[position];
        heap[position] = temporary;
        position = parent;
    }
}

void maxMoveDown(int *heap, int count)
{
    int position = 0;

    while (1) {
        int largest = position;
        int left = 2 * position + 1;
        int right = 2 * position + 2;

        if (
            left < count &&
            heap[left] > heap[largest]
        ) {
            largest = left;
        }

        if (
            right < count &&
            heap[right] > heap[largest]
        ) {
            largest = right;
        }

        if (largest == position)
            break;

        int temporary = heap[position];
        heap[position] = heap[largest];
        heap[largest] = temporary;
        position = largest;
    }
}

void minMoveDown(int *heap, int count)
{
    int position = 0;

    while (1) {
        int smallest = position;
        int left = 2 * position + 1;
        int right = 2 * position + 2;

        if (
            left < count &&
            heap[left] < heap[smallest]
        ) {
            smallest = left;
        }

        if (
            right < count &&
            heap[right] < heap[smallest]
        ) {
            smallest = right;
        }

        if (smallest == position)
            break;

        int temporary = heap[position];
        heap[position] = heap[smallest];
        heap[smallest] = temporary;
        position = smallest;
    }
}

int popMaximum(int *heap, int *count)
{
    int value = heap[0];

    heap[0] = heap[--(*count)];
    maxMoveDown(heap, *count);

    return value;
}

int popMinimum(int *heap, int *count)
{
    int value = heap[0];

    heap[0] = heap[--(*count)];
    minMoveDown(heap, *count);

    return value;
}

int main(void)
{
    int n;
    int lowerCount = 0;
    int upperCount = 0;
    int value;

    scanf("%d", &n);

    int *lower = malloc(
        (size_t) n * sizeof(int)
    );

    int *upper = malloc(
        (size_t) n * sizeof(int)
    );

    for (int i = 0; i < n; i++) {
        scanf("%d", &value);

        if (
            !lowerCount ||
            value <= lower[0]
        ) {
            lower[lowerCount] = value;
            maxMoveUp(lower, lowerCount);
            lowerCount++;
        } else {
            upper[upperCount] = value;
            minMoveUp(upper, upperCount);
            upperCount++;
        }

        if (lowerCount > upperCount + 1) {
            int moved = popMaximum(
                lower,
                &lowerCount
            );

            upper[upperCount] = moved;
            minMoveUp(upper, upperCount);
            upperCount++;
        } else if (upperCount > lowerCount) {
            int moved = popMinimum(
                upper,
                &upperCount
            );

            lower[lowerCount] = moved;
            maxMoveUp(lower, lowerCount);
            lowerCount++;
        }

        if (i)
            printf(" ");

        if (lowerCount == upperCount) {
            printf(
                "%.1f",
                (
                    (double) lower[0] +
                    upper[0]
                ) / 2.0
            );
        } else {
            printf(
                "%.1f",
                (double) lower[0]
            );
        }
    }

    free(lower);
    free(upper);

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "5\n5 15 1 3 8",
                            expected:
                                "5.0 10.0 5.0 4.0 5.0"
                        },
                        {
                            input:
                                "1\n7",
                            expected: "7.0"
                        },
                        {
                            input:
                                "4\n1 2 3 4",
                            expected:
                                "1.0 1.5 2.0 2.5"
                        },
                        {
                            input:
                                "3\n-1 -5 -3",
                            expected:
                                "-1.0 -3.0 -3.0"
                        },
                        {
                            input:
                                "5\n2 2 2 2 2",
                            expected:
                                "2.0 2.0 2.0 2.0 2.0"
                        }
                    ]
                })
            ]
        },

        {
            level: 18,
            host: "adsPracticeLevel18Challenges",
            challenges: [
                problem(18, 1, {
                    title:
                        "Linear-Probing Table",
                    difficulty: "Medium",
                    points: 70,
                    coreSkill:
                        "Open addressing insertion",
                    concepts: [
                        "Hashing",
                        "Linear Probing"
                    ],
                    story:
                        "A compact integer table resolves collisions by moving to the next slot cyclically.",
                    task:
                        "Insert distinct non-negative keys and print the final table, using −1 for empty slots.",
                    inputSpec:
                        "Table size M, key count N, then N keys.",
                    outputSpec:
                        "M table entries.",
                    constraints:
                        "1 ≤ N < M ≤ 1000.",
                    sampleInput:
                        "7 4\n10 17 24 5",
                    sampleOutput:
                        "-1 -1 -1 10 17 24 5",
                    explanation:
                        "10, 17 and 24 collide at index 3; key 5 then continues to slot 6.",
                    hint:
                        "Start at key % M and advance (index+1)%M while occupied.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int tableSize;
    int keyCount;
    int key;

    scanf("%d%d", &tableSize, &keyCount);

    int *table = malloc(
        (size_t) tableSize * sizeof(int)
    );

    for (int i = 0; i < tableSize; i++)
        table[i] = -1;

    while (keyCount--) {
        scanf("%d", &key);

        int index = key % tableSize;

        while (table[index] != -1)
            index = (index + 1) % tableSize;

        table[index] = key;
    }

    for (int i = 0; i < tableSize; i++) {
        if (i)
            printf(" ");

        printf("%d", table[i]);
    }

    free(table);
    return 0;
}`,
                    tests: [
                        {
                            input:
                                "7 4\n10 17 24 5",
                            expected:
                                "-1 -1 -1 10 17 24 5"
                        },
                        {
                            input:
                                "5 3\n0 1 2",
                            expected:
                                "0 1 2 -1 -1"
                        },
                        {
                            input:
                                "5 4\n4 9 14 19",
                            expected:
                                "9 14 19 -1 4"
                        },
                        {
                            input:
                                "3 1\n8",
                            expected:
                                "-1 -1 8"
                        },
                        {
                            input:
                                "6 3\n6 12 18",
                            expected:
                                "6 12 18 -1 -1 -1"
                        }
                    ]
                }),

                problem(18, 2, {
                    title:
                        "Probe Count Search",
                    difficulty: "Advanced",
                    points: 80,
                    coreSkill:
                        "Measure lookup cost",
                    concepts: [
                        "Hashing",
                        "Probe Sequence"
                    ],
                    story:
                        "A diagnostics panel reports how many slots a successful or unsuccessful lookup examines.",
                    task:
                        "Build a linear-probing table, search target and print probes; print −1 if absent.",
                    inputSpec:
                        "M N, N distinct keys, then target.",
                    outputSpec:
                        "Successful probe count or −1.",
                    constraints:
                        "1 ≤ N < M ≤ 1000.",
                    sampleInput:
                        "7 4\n10 17 24 5\n24",
                    sampleOutput: "3",
                    explanation:
                        "Search examines slots 3, 4 and 5, so 24 is found after three probes.",
                    hint:
                        "Stop at the key, an empty slot, or after M probes.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int tableSize;
    int keyCount;
    int key;
    int target;

    scanf("%d%d", &tableSize, &keyCount);

    int *table = malloc(
        (size_t) tableSize * sizeof(int)
    );

    for (int i = 0; i < tableSize; i++)
        table[i] = -1;

    while (keyCount--) {
        scanf("%d", &key);

        int index = key % tableSize;

        while (table[index] != -1)
            index = (index + 1) % tableSize;

        table[index] = key;
    }

    scanf("%d", &target);

    int index = target % tableSize;
    int probes = 0;
    int answer = -1;

    while (
        probes < tableSize &&
        table[index] != -1
    ) {
        probes++;

        if (table[index] == target) {
            answer = probes;
            break;
        }

        index =
            (index + 1) % tableSize;
    }

    printf("%d", answer);
    free(table);

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "7 4\n10 17 24 5\n24",
                            expected: "3"
                        },
                        {
                            input:
                                "5 3\n0 1 2\n2",
                            expected: "1"
                        },
                        {
                            input:
                                "5 4\n4 9 14 19\n19",
                            expected: "4"
                        },
                        {
                            input:
                                "6 3\n6 12 18\n7",
                            expected: "-1"
                        },
                        {
                            input:
                                "3 1\n8\n8",
                            expected: "1"
                        }
                    ]
                }),

                problem(18, 3, {
                    title:
                        "Chaining Bucket Load",
                    difficulty: "Easy",
                    points: 50,
                    coreSkill:
                        "Separate chaining distribution",
                    concepts: [
                        "Hashing",
                        "Buckets"
                    ],
                    story:
                        "A chained hash table dashboard shows how many keys land in every bucket.",
                    task:
                        "Count keys in each bucket using key % M.",
                    inputSpec:
                        "M N followed by N non-negative keys.",
                    outputSpec:
                        "M bucket counts.",
                    constraints:
                        "1 ≤ M,N ≤ 100000.",
                    sampleInput:
                        "5 7\n1 6 11 3 8 10 15",
                    sampleOutput:
                        "2 3 0 2 0",
                    explanation:
                        "Keys 10 and 15 enter bucket 0; 1, 6 and 11 enter bucket 1.",
                    hint:
                        "No linked nodes are needed when only counts are requested.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int tableSize;
    int keyCount;
    int key;

    scanf("%d%d", &tableSize, &keyCount);

    int *count = calloc(
        (size_t) tableSize,
        sizeof(int)
    );

    while (keyCount--) {
        scanf("%d", &key);
        count[key % tableSize]++;
    }

    for (int i = 0; i < tableSize; i++) {
        if (i)
            printf(" ");

        printf("%d", count[i]);
    }

    free(count);
    return 0;
}`,
                    tests: [
                        {
                            input:
                                "5 7\n1 6 11 3 8 10 15",
                            expected:
                                "2 3 0 2 0"
                        },
                        {
                            input:
                                "1 3\n2 4 6",
                            expected: "3"
                        },
                        {
                            input:
                                "4 4\n0 1 2 3",
                            expected:
                                "1 1 1 1"
                        },
                        {
                            input:
                                "3 5\n3 6 9 1 2",
                            expected:
                                "3 1 1"
                        },
                        {
                            input:
                                "6 1\n17",
                            expected:
                                "0 0 0 0 0 1"
                        }
                    ]
                })
            ]
        },

        {
            level: 19,
            host: "adsPracticeLevel19Challenges",
            challenges: [
                problem(19, 1, {
                    title:
                        "Record Block Locator",
                    difficulty: "Easy",
                    points: 50,
                    coreSkill:
                        "Map record position to block",
                    concepts: [
                        "File Blocks",
                        "Blocking Factor"
                    ],
                    story:
                        "A fixed-length record file stores BFR records per block. A search report needs the physical block and slot of a key.",
                    task:
                        "Find target in the supplied record order and print block and slot, or −1 −1.",
                    inputSpec:
                        "BFR N, N keys, then target.",
                    outputSpec:
                        "Zero-based block and slot.",
                    constraints:
                        "1 ≤ BFR,N ≤ 100000.",
                    sampleInput:
                        "3 7\n101 103 105 107 109 111 113\n109",
                    sampleOutput: "1 1",
                    explanation:
                        "Index 4 maps to block 1, slot 1.",
                    hint:
                        "For found index i, block=i/BFR and slot=i%BFR.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int blockingFactor;
    int recordCount;
    int target;
    int index = -1;

    scanf(
        "%d%d",
        &blockingFactor,
        &recordCount
    );

    int *records = malloc(
        (size_t) recordCount * sizeof(int)
    );

    for (int i = 0; i < recordCount; i++)
        scanf("%d", &records[i]);

    scanf("%d", &target);

    for (int i = 0; i < recordCount; i++) {
        if (records[i] == target) {
            index = i;
            break;
        }
    }

    if (index < 0) {
        printf("-1 -1");
    } else {
        printf(
            "%d %d",
            index / blockingFactor,
            index % blockingFactor
        );
    }

    free(records);
    return 0;
}`,
                    tests: [
                        {
                            input:
                                "3 7\n101 103 105 107 109 111 113\n109",
                            expected: "1 1"
                        },
                        {
                            input:
                                "2 4\n1 2 3 4\n1",
                            expected: "0 0"
                        },
                        {
                            input:
                                "2 4\n1 2 3 4\n4",
                            expected: "1 1"
                        },
                        {
                            input:
                                "5 3\n7 8 9\n8",
                            expected: "0 1"
                        },
                        {
                            input:
                                "3 3\n1 2 3\n5",
                            expected: "-1 -1"
                        }
                    ]
                }),

                problem(19, 2, {
                    title:
                        "Ordered Record Insert",
                    difficulty: "Medium",
                    points: 65,
                    coreSkill:
                        "Maintain sequential order",
                    concepts: [
                        "Ordered File",
                        "Insertion"
                    ],
                    story:
                        "An ordered sequential file receives one new distinct key and rewrites records in key order.",
                    task:
                        "Insert target into a sorted array and print the resulting sequence.",
                    inputSpec:
                        "N, N sorted keys, then new key.",
                    outputSpec:
                        "N+1 sorted keys.",
                    constraints:
                        "1 ≤ N ≤ 100000.",
                    sampleInput:
                        "5\n101 103 107 109 111\n105",
                    sampleOutput:
                        "101 103 105 107 109 111",
                    explanation:
                        "105 belongs between 103 and 107.",
                    hint:
                        "Print smaller keys, then the new key, then the remainder.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int n;
    int newKey;
    int placed = 0;
    int firstOutput = 1;

    scanf("%d", &n);

    int *records = malloc(
        (size_t) n * sizeof(int)
    );

    for (int i = 0; i < n; i++)
        scanf("%d", &records[i]);

    scanf("%d", &newKey);

    for (int i = 0; i < n; i++) {
        if (
            !placed &&
            newKey < records[i]
        ) {
            if (!firstOutput)
                printf(" ");

            printf("%d", newKey);
            firstOutput = 0;
            placed = 1;
        }

        if (!firstOutput)
            printf(" ");

        printf("%d", records[i]);
        firstOutput = 0;
    }

    if (!placed) {
        if (!firstOutput)
            printf(" ");

        printf("%d", newKey);
    }

    free(records);
    return 0;
}`,
                    tests: [
                        {
                            input:
                                "5\n101 103 107 109 111\n105",
                            expected:
                                "101 103 105 107 109 111"
                        },
                        {
                            input:
                                "1\n5\n2",
                            expected: "2 5"
                        },
                        {
                            input:
                                "1\n5\n8",
                            expected: "5 8"
                        },
                        {
                            input:
                                "4\n-3 0 4 9\n2",
                            expected:
                                "-3 0 2 4 9"
                        },
                        {
                            input:
                                "3\n1 3 5\n4",
                            expected:
                                "1 3 4 5"
                        }
                    ]
                }),

                problem(19, 3, {
                    title:
                        "Sparse Primary Index",
                    difficulty: "Medium",
                    points: 70,
                    coreSkill:
                        "Create one index entry per block",
                    concepts: [
                        "Primary Index",
                        "File Blocks"
                    ],
                    story:
                        "An ordered file builds a sparse primary index containing the first key of every physical block.",
                    task:
                        "Print the first record key of each block.",
                    inputSpec:
                        "BFR N followed by N ordered keys.",
                    outputSpec:
                        "Sparse index keys.",
                    constraints:
                        "1 ≤ BFR,N ≤ 100000.",
                    sampleInput:
                        "3 8\n10 20 30 40 50 60 70 80",
                    sampleOutput:
                        "10 40 70",
                    explanation:
                        "Blocks begin at positions 0, 3 and 6.",
                    hint:
                        "Visit indexes 0, BFR, 2×BFR and so on.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int blockingFactor;
    int recordCount;

    scanf(
        "%d%d",
        &blockingFactor,
        &recordCount
    );

    int *records = malloc(
        (size_t) recordCount * sizeof(int)
    );

    for (int i = 0; i < recordCount; i++)
        scanf("%d", &records[i]);

    int firstOutput = 1;

    for (
        int i = 0;
        i < recordCount;
        i += blockingFactor
    ) {
        if (!firstOutput)
            printf(" ");

        printf("%d", records[i]);
        firstOutput = 0;
    }

    free(records);
    return 0;
}`,
                    tests: [
                        {
                            input:
                                "3 8\n10 20 30 40 50 60 70 80",
                            expected:
                                "10 40 70"
                        },
                        {
                            input:
                                "2 4\n1 2 3 4",
                            expected:
                                "1 3"
                        },
                        {
                            input:
                                "5 3\n7 8 9",
                            expected: "7"
                        },
                        {
                            input:
                                "1 4\n2 4 6 8",
                            expected:
                                "2 4 6 8"
                        },
                        {
                            input:
                                "4 9\n1 2 3 4 5 6 7 8 9",
                            expected:
                                "1 5 9"
                        }
                    ]
                })
            ]
        },

        {
            level: 20,
            host: "adsPracticeLevel20Challenges",
            challenges: [
                problem(20, 1, {
                    title:
                        "Kruskal Network Cost",
                    difficulty: "Advanced",
                    points: 100,
                    coreSkill:
                        "Minimum spanning tree",
                    concepts: [
                        "Kruskal",
                        "DSU"
                    ],
                    story:
                        "A campus wants to connect all buildings with minimum cable cost.",
                    task:
                        "Print the MST cost of a connected undirected weighted graph.",
                    inputSpec:
                        "V E followed by E lines u v weight.",
                    outputSpec:
                        "Minimum spanning-tree cost.",
                    constraints:
                        "1 ≤ V ≤ 1000; E ≤ 10000.",
                    sampleInput:
                        "4 5\n0 1 1\n0 2 4\n1 2 2\n1 3 5\n2 3 3",
                    sampleOutput: "6",
                    explanation:
                        "Edges of weights 1, 2 and 3 connect all vertices.",
                    hint:
                        "Sort edges and accept one only when its endpoints have different roots.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int from;
    int to;
    int weight;
} Edge;

int parent[1005];
int size[1005];

int compareEdges(
    const void *first,
    const void *second
)
{
    const Edge *a = first;
    const Edge *b = second;

    return
        (a->weight > b->weight) -
        (a->weight < b->weight);
}

int find(int vertex)
{
    if (parent[vertex] == vertex)
        return vertex;

    return parent[vertex] =
        find(parent[vertex]);
}

int main(void)
{
    int vertices;
    int edgeCount;

    scanf("%d%d", &vertices, &edgeCount);

    Edge *edges = malloc(
        (size_t) edgeCount * sizeof(Edge)
    );

    for (int i = 0; i < edgeCount; i++) {
        scanf(
            "%d%d%d",
            &edges[i].from,
            &edges[i].to,
            &edges[i].weight
        );
    }

    qsort(
        edges,
        edgeCount,
        sizeof(Edge),
        compareEdges
    );

    for (int i = 0; i < vertices; i++) {
        parent[i] = i;
        size[i] = 1;
    }

    long long cost = 0;
    int used = 0;

    for (
        int i = 0;
        i < edgeCount && used < vertices - 1;
        i++
    ) {
        int first = find(edges[i].from);
        int second = find(edges[i].to);

        if (first != second) {
            if (size[first] < size[second]) {
                int temporary = first;
                first = second;
                second = temporary;
            }

            parent[second] = first;
            size[first] += size[second];
            cost += edges[i].weight;
            used++;
        }
    }

    printf("%lld", cost);
    free(edges);

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "4 5\n0 1 1\n0 2 4\n1 2 2\n1 3 5\n2 3 3",
                            expected: "6"
                        },
                        {
                            input:
                                "2 1\n0 1 7",
                            expected: "7"
                        },
                        {
                            input:
                                "3 3\n0 1 5\n1 2 1\n0 2 2",
                            expected: "3"
                        },
                        {
                            input:
                                "4 6\n0 1 1\n0 2 1\n0 3 1\n1 2 2\n1 3 2\n2 3 2",
                            expected: "3"
                        },
                        {
                            input:
                                "5 4\n0 1 -2\n1 2 3\n2 3 1\n3 4 4",
                            expected: "6"
                        }
                    ]
                }),

                problem(20, 2, {
                    title:
                        "Dijkstra Distance Board",
                    difficulty: "Advanced",
                    points: 100,
                    coreSkill:
                        "Single-source shortest paths",
                    concepts: [
                        "Dijkstra",
                        "Relaxation"
                    ],
                    story:
                        "A route board displays the shortest non-negative travel cost from one source to every location.",
                    task:
                        "Print shortest distances in an undirected weighted graph; print −1 for unreachable vertices.",
                    inputSpec:
                        "V E source followed by E edges u v w.",
                    outputSpec: "V distances.",
                    constraints:
                        "V ≤ 500; weights ≥ 0.",
                    sampleInput:
                        "5 6 0\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3",
                    sampleOutput:
                        "0 3 1 4 7",
                    explanation:
                        "Relaxing through vertex 2 improves the route to 1.",
                    hint:
                        "Repeatedly select the unused vertex with minimum tentative distance.",
                    solution: String.raw`#include <stdio.h>
#include <limits.h>

#define MAX 505

long long graph[MAX][MAX];
long long distance[MAX];
int used[MAX];

int main(void)
{
    int vertices;
    int edgeCount;
    int source;
    int from, to;
    long long weight;

    scanf(
        "%d%d%d",
        &vertices,
        &edgeCount,
        &source
    );

    for (int i = 0; i < vertices; i++) {
        distance[i] = LLONG_MAX / 4;

        for (int j = 0; j < vertices; j++)
            graph[i][j] = -1;
    }

    while (edgeCount--) {
        scanf(
            "%d%d%lld",
            &from,
            &to,
            &weight
        );

        if (
            graph[from][to] < 0 ||
            weight < graph[from][to]
        ) {
            graph[from][to] = weight;
            graph[to][from] = weight;
        }
    }

    distance[source] = 0;

    for (int step = 0; step < vertices; step++) {
        int current = -1;

        for (int i = 0; i < vertices; i++) {
            if (
                !used[i] &&
                (
                    current < 0 ||
                    distance[i] < distance[current]
                )
            ) {
                current = i;
            }
        }

        if (
            current < 0 ||
            distance[current] >= LLONG_MAX / 8
        ) {
            break;
        }

        used[current] = 1;

        for (int next = 0; next < vertices; next++) {
            if (
                graph[current][next] >= 0 &&
                distance[current] +
                    graph[current][next] <
                    distance[next]
            ) {
                distance[next] =
                    distance[current] +
                    graph[current][next];
            }
        }
    }

    for (int i = 0; i < vertices; i++) {
        if (i)
            printf(" ");

        if (distance[i] >= LLONG_MAX / 8)
            printf("-1");
        else
            printf("%lld", distance[i]);
    }

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "5 6 0\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3",
                            expected:
                                "0 3 1 4 7"
                        },
                        {
                            input:
                                "1 0 0",
                            expected: "0"
                        },
                        {
                            input:
                                "3 1 0\n0 1 5",
                            expected:
                                "0 5 -1"
                        },
                        {
                            input:
                                "4 4 1\n0 1 2\n1 2 3\n0 2 10\n2 3 1",
                            expected:
                                "2 0 3 4"
                        },
                        {
                            input:
                                "3 3 0\n0 1 0\n1 2 2\n0 2 5",
                            expected:
                                "0 0 2"
                        }
                    ]
                }),

                problem(20, 3, {
                    title:
                        "Dependency Topological Order",
                    difficulty: "Advanced",
                    points: 95,
                    coreSkill:
                        "Kahn topological sorting",
                    concepts: [
                        "DAG",
                        "Indegree",
                        "Queue"
                    ],
                    story:
                        "A deployment planner must list tasks only after all prerequisites have been completed.",
                    task:
                        "Print a topological order using Kahn's algorithm, choosing the smallest available vertex; print CYCLE if impossible.",
                    inputSpec:
                        "V E followed by directed edges u v.",
                    outputSpec:
                        "Order or CYCLE.",
                    constraints: "1 ≤ V ≤ 1000.",
                    sampleInput:
                        "6 6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1",
                    sampleOutput:
                        "4 5 0 2 3 1",
                    explanation:
                        "At each step the smallest zero-indegree vertex is selected.",
                    hint:
                        "Re-scan zero-indegree vertices to enforce the smallest available choice.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int vertices;
    int edgeCount;
    int from, to;

    scanf("%d%d", &vertices, &edgeCount);

    int **graph = malloc(
        (size_t) vertices * sizeof(int *)
    );

    int *indegree = calloc(
        (size_t) vertices,
        sizeof(int)
    );

    int *count = calloc(
        (size_t) vertices,
        sizeof(int)
    );

    int *used = calloc(
        (size_t) vertices,
        sizeof(int)
    );

    int *order = malloc(
        (size_t) vertices * sizeof(int)
    );

    for (int i = 0; i < vertices; i++) {
        graph[i] = malloc(
            (size_t) vertices * sizeof(int)
        );
    }

    while (edgeCount--) {
        scanf("%d%d", &from, &to);

        graph[from][count[from]++] = to;
        indegree[to]++;
    }

    int total = 0;

    for (int step = 0; step < vertices; step++) {
        int current = -1;

        for (int i = 0; i < vertices; i++) {
            if (
                !used[i] &&
                indegree[i] == 0
            ) {
                current = i;
                break;
            }
        }

        if (current < 0)
            break;

        used[current] = 1;
        order[total++] = current;

        for (
            int i = 0;
            i < count[current];
            i++
        ) {
            indegree[
                graph[current][i]
            ]--;
        }
    }

    if (total < vertices) {
        printf("CYCLE");
    } else {
        for (int i = 0; i < vertices; i++) {
            if (i)
                printf(" ");

            printf("%d", order[i]);
        }
    }

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "6 6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1",
                            expected:
                                "4 5 0 2 3 1"
                        },
                        {
                            input:
                                "3 2\n0 1\n1 2",
                            expected:
                                "0 1 2"
                        },
                        {
                            input:
                                "3 3\n0 1\n1 2\n2 0",
                            expected: "CYCLE"
                        },
                        {
                            input: "4 0",
                            expected:
                                "0 1 2 3"
                        },
                        {
                            input:
                                "4 3\n0 2\n1 2\n2 3",
                            expected:
                                "0 1 2 3"
                        }
                    ]
                })
            ]
        },

        {
            level: 21,
            host: "adsPracticeLevel21Challenges",
            challenges: [
                problem(21, 1, {
                    title:
                        "Placement Kth Largest",
                    difficulty: "Placement",
                    points: 100,
                    coreSkill:
                        "Select top K efficiently",
                    concepts: [
                        "Min Heap",
                        "Interview Pattern"
                    ],
                    story:
                        "A placement dashboard needs the Kth highest assessment score without sorting the complete stream.",
                    task:
                        "Print the Kth largest value using a size-K min heap.",
                    inputSpec:
                        "N K followed by N integers.",
                    outputSpec:
                        "Kth largest value.",
                    constraints:
                        "1 ≤ K ≤ N ≤ 100000.",
                    sampleInput:
                        "6 2\n3 2 1 5 6 4",
                    sampleOutput: "5",
                    explanation:
                        "The two largest values are 6 and 5.",
                    hint:
                        "The root of a K-sized min heap is the Kth largest.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

void moveUp(int *heap, int position)
{
    while (position) {
        int parent = (position - 1) / 2;

        if (heap[parent] <= heap[position])
            break;

        int temporary = heap[parent];
        heap[parent] = heap[position];
        heap[position] = temporary;
        position = parent;
    }
}

void moveDown(int *heap, int count)
{
    int position = 0;

    while (1) {
        int smallest = position;
        int left = 2 * position + 1;
        int right = 2 * position + 2;

        if (
            left < count &&
            heap[left] < heap[smallest]
        ) {
            smallest = left;
        }

        if (
            right < count &&
            heap[right] < heap[smallest]
        ) {
            smallest = right;
        }

        if (smallest == position)
            break;

        int temporary = heap[position];
        heap[position] = heap[smallest];
        heap[smallest] = temporary;
        position = smallest;
    }
}

int main(void)
{
    int n, k;
    int value;
    int size = 0;

    scanf("%d%d", &n, &k);

    int *heap = malloc(
        (size_t) k * sizeof(int)
    );

    for (int i = 0; i < n; i++) {
        scanf("%d", &value);

        if (size < k) {
            heap[size] = value;
            moveUp(heap, size);
            size++;
        } else if (value > heap[0]) {
            heap[0] = value;
            moveDown(heap, size);
        }
    }

    printf("%d", heap[0]);
    free(heap);

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "6 2\n3 2 1 5 6 4",
                            expected: "5"
                        },
                        {
                            input:
                                "5 1\n7 2 9 1 4",
                            expected: "9"
                        },
                        {
                            input:
                                "5 5\n7 2 9 1 4",
                            expected: "1"
                        },
                        {
                            input:
                                "6 3\n4 4 5 5 6 6",
                            expected: "5"
                        },
                        {
                            input:
                                "4 2\n-5 -1 -3 -2",
                            expected: "-2"
                        }
                    ]
                }),

                problem(21, 2, {
                    title:
                        "Range Minimum Interview",
                    difficulty:
                        "Placement Hard",
                    points: 120,
                    coreSkill:
                        "Segment-tree range query",
                    concepts: [
                        "Segment Tree",
                        "RMQ"
                    ],
                    story:
                        "A monitoring system answers many minimum-value queries over fixed sensor data.",
                    task:
                        "Build a segment tree and answer Q inclusive range-minimum queries.",
                    inputSpec:
                        "N, N integers, Q, then Q pairs left right.",
                    outputSpec:
                        "One minimum per line.",
                    constraints:
                        "1 ≤ N,Q ≤ 100000.",
                    sampleInput:
                        "6\n5 2 6 3 1 7\n3\n0 2\n2 5\n3 3",
                    sampleOutput:
                        "2\n1\n3",
                    explanation:
                        "Each query returns the minimum in its inclusive interval.",
                    hint:
                        "Return a large sentinel for a segment outside the query.",
                    solution: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

void build(
    int *tree,
    int *array,
    int node,
    int left,
    int right
)
{
    if (left == right) {
        tree[node] = array[left];
        return;
    }

    int middle = (left + right) / 2;

    build(
        tree,
        array,
        node * 2,
        left,
        middle
    );

    build(
        tree,
        array,
        node * 2 + 1,
        middle + 1,
        right
    );

    tree[node] =
        tree[node * 2] <
        tree[node * 2 + 1]
            ? tree[node * 2]
            : tree[node * 2 + 1];
}

int query(
    int *tree,
    int node,
    int left,
    int right,
    int queryLeft,
    int queryRight
)
{
    if (
        queryRight < left ||
        right < queryLeft
    ) {
        return INT_MAX;
    }

    if (
        queryLeft <= left &&
        right <= queryRight
    ) {
        return tree[node];
    }

    int middle = (left + right) / 2;

    int first = query(
        tree,
        node * 2,
        left,
        middle,
        queryLeft,
        queryRight
    );

    int second = query(
        tree,
        node * 2 + 1,
        middle + 1,
        right,
        queryLeft,
        queryRight
    );

    return first < second
        ? first
        : second;
}

int main(void)
{
    int n;
    int queryCount;
    int left, right;

    scanf("%d", &n);

    int *array = malloc(
        (size_t) n * sizeof(int)
    );

    int *tree = malloc(
        (size_t) 4 * n * sizeof(int)
    );

    for (int i = 0; i < n; i++)
        scanf("%d", &array[i]);

    build(
        tree,
        array,
        1,
        0,
        n - 1
    );

    scanf("%d", &queryCount);

    while (queryCount--) {
        scanf("%d%d", &left, &right);

        printf(
            "%d",
            query(
                tree,
                1,
                0,
                n - 1,
                left,
                right
            )
        );

        if (queryCount)
            printf("\n");
    }

    free(array);
    free(tree);

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "6\n5 2 6 3 1 7\n3\n0 2\n2 5\n3 3",
                            expected:
                                "2\n1\n3"
                        },
                        {
                            input:
                                "1\n9\n1\n0 0",
                            expected: "9"
                        },
                        {
                            input:
                                "5\n-1 4 -3 8 0\n2\n0 4\n1 3",
                            expected:
                                "-3\n-3"
                        },
                        {
                            input:
                                "4\n7 6 5 4\n2\n0 1\n2 3",
                            expected:
                                "6\n4"
                        },
                        {
                            input:
                                "3\n2 2 2\n3\n0 0\n0 2\n1 2",
                            expected:
                                "2\n2\n2"
                        }
                    ]
                }),

                problem(21, 3, {
                    title:
                        "Dynamic Connectivity Interview",
                    difficulty:
                        "Placement Hard",
                    points: 115,
                    coreSkill:
                        "Online union and query",
                    concepts: [
                        "DSU",
                        "Dynamic Connectivity"
                    ],
                    story:
                        "A network receives union operations and connectivity questions in one live stream.",
                    task:
                        "For U a b unite the vertices; for Q a b print YES or NO.",
                    inputSpec:
                        "N K followed by K operation lines.",
                    outputSpec:
                        "One answer per Q operation.",
                    constraints:
                        "1 ≤ N,K ≤ 100000.",
                    sampleInput:
                        "5 6\nU 0 1\nQ 0 2\nU 1 2\nQ 0 2\nU 3 4\nQ 2 4",
                    sampleOutput:
                        "NO\nYES\nNO",
                    explanation:
                        "Connectivity changes only after union operations.",
                    hint:
                        "Compress paths during every query as well as every union.",
                    solution: String.raw`#include <stdio.h>

#define MAX 100005

int parent[MAX];
int size[MAX];

int find(int vertex)
{
    if (parent[vertex] == vertex)
        return vertex;

    return parent[vertex] =
        find(parent[vertex]);
}

void unite(int first, int second)
{
    first = find(first);
    second = find(second);

    if (first == second)
        return;

    if (size[first] < size[second]) {
        int temporary = first;
        first = second;
        second = temporary;
    }

    parent[second] = first;
    size[first] += size[second];
}

int main(void)
{
    int vertices;
    int operationCount;
    int first, second;
    char operation;

    scanf(
        "%d%d",
        &vertices,
        &operationCount
    );

    for (int i = 0; i < vertices; i++) {
        parent[i] = i;
        size[i] = 1;
    }

    while (operationCount--) {
        scanf(
            " %c%d%d",
            &operation,
            &first,
            &second
        );

        if (operation == 'U') {
            unite(first, second);
        } else {
            puts(
                find(first) == find(second)
                    ? "YES"
                    : "NO"
            );
        }
    }

    return 0;
}`,
                    tests: [
                        {
                            input:
                                "5 6\nU 0 1\nQ 0 2\nU 1 2\nQ 0 2\nU 3 4\nQ 2 4",
                            expected:
                                "NO\nYES\nNO"
                        },
                        {
                            input:
                                "2 2\nQ 0 1\nU 0 1",
                            expected: "NO"
                        },
                        {
                            input:
                                "3 3\nU 0 1\nU 1 2\nQ 0 2",
                            expected: "YES"
                        },
                        {
                            input:
                                "4 4\nQ 2 2\nU 0 3\nQ 0 3\nQ 1 3",
                            expected:
                                "YES\nYES\nNO"
                        },
                        {
                            input:
                                "1 1\nQ 0 0",
                            expected: "YES"
                        }
                    ]
                })
            ]
        }
    ];

    const ALL_CHALLENGES = LEVELS.reduce(
        function (items, level) {
            return items.concat(
                level.challenges
            );
        },
        []
    );

    window.CodeBhavyaADSPracticeData = LEVELS;
      window.CodeBhavyaADSPractice = (function () {
        const judge0Base = "https://ce.judge0.com";
        const cLanguageId = 103;

        function byId(id) {
            return document.getElementById(id);
        }

        function storageKey(key) {
            return "codebhavya.adspractice." + key;
        }

        function escapeHtml(value) {
            return String(
                value === null ||
                value === undefined
                    ? ""
                    : value
            )
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");
        }

        function normalize(value) {
            return String(
                value === null ||
                value === undefined
                    ? ""
                    : value
            )
                .replace(/\r/g, "")
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .join(" ");
        }

        function difficultyClass(value) {
            return String(value)
                .toLowerCase()
                .replace(/[^a-z]/g, "");
        }

        function defaultProgress() {
            return {
                attempts: 0,
                bestScore: 0,
                hintUsed: false,
                solutionViewed: false,
                solved: false,
                completed: false
            };
        }

        function readProgress(key) {
            try {
                const saved =
                    window.localStorage.getItem(
                        storageKey(key)
                    );

                return saved
                    ? Object.assign(
                        defaultProgress(),
                        JSON.parse(saved)
                    )
                    : defaultProgress();
            } catch (error) {
                return defaultProgress();
            }
        }

        function saveProgress(key, progress) {
            try {
                window.localStorage.setItem(
                    storageKey(key),
                    JSON.stringify(progress)
                );
            } catch (error) {
                /*
                 * Progress remains available for
                 * the current interaction.
                 */
            }
        }

        function getConfig(key) {
            return ALL_CHALLENGES.find(
                function (item) {
                    return item.key === key;
                }
            );
        }

        function badgeFor(solved, finished) {
            if (
                solved ===
                ALL_CHALLENGES.length
            ) {
                return "🏆 ADS Placement Champion";
            }

            if (solved >= 32) {
                return "🥇 Advanced Structure Strategist";
            }

            if (solved >= 20) {
                return "🥈 Algorithm Architect";
            }

            if (finished >= 12) {
                return "🥉 Consistent Explorer";
            }

            if (finished >= 4) {
                return "🚀 Rising Coder";
            }

            return "🌱 Starter";
        }

        function updateOverall() {
            let solved = 0;
            let completed = 0;
            let score = 0;

            const maximum =
                ALL_CHALLENGES.reduce(
                    function (
                        total,
                        challenge
                    ) {
                        return (
                            total +
                            challenge.points
                        );
                    },
                    0
                );

            ALL_CHALLENGES.forEach(
                function (challenge) {
                    const progress =
                        readProgress(
                            challenge.key
                        );

                    if (progress.solved) {
                        solved += 1;
                    } else if (
                        progress.completed
                    ) {
                        completed += 1;
                    }

                    score += Number(
                        progress.bestScore || 0
                    );
                }
            );

            const finished =
                solved + completed;

            const percent = Math.round(
                finished /
                ALL_CHALLENGES.length *
                100
            );

            if (
                byId(
                    "adsPracticeOverallSolved"
                )
            ) {
                byId(
                    "adsPracticeOverallSolved"
                ).textContent =
                    solved +
                    " / " +
                    ALL_CHALLENGES.length;
            }

            if (
                byId(
                    "adsPracticeOverallCompleted"
                )
            ) {
                byId(
                    "adsPracticeOverallCompleted"
                ).textContent =
                    String(completed);
            }

            if (
                byId(
                    "adsPracticeOverallScore"
                )
            ) {
                byId(
                    "adsPracticeOverallScore"
                ).textContent =
                    score +
                    " / " +
                    maximum;
            }

            if (
                byId(
                    "adsPracticeOverallPercent"
                )
            ) {
                byId(
                    "adsPracticeOverallPercent"
                ).textContent =
                    percent + "%";
            }

            if (
                byId(
                    "adsPracticeOverallBar"
                )
            ) {
                byId(
                    "adsPracticeOverallBar"
                ).style.width =
                    percent + "%";
            }

            if (
                byId("adsPracticeBadge")
            ) {
                byId(
                    "adsPracticeBadge"
                ).textContent =
                    badgeFor(
                        solved,
                        finished
                    );
            }

            if (
                byId(
                    "adsPracticeMaxPoints"
                )
            ) {
                byId(
                    "adsPracticeMaxPoints"
                ).textContent =
                    String(maximum);
            }
        }

        function updateChallengeUI(key) {
            const challenge =
                getConfig(key);

            if (!challenge) {
                return;
            }

            const progress =
                readProgress(key);

            const score =
                byId("adsScore-" + key);

            const attempts =
                byId("adsAttempts-" + key);

            const status =
                byId("adsStatus-" + key);

            const message =
                byId("adsMessage-" + key);

            const cardStatus =
                byId(
                    "adsCardStatus-" + key
                );

            let statusText =
                "Not Solved";

            if (progress.solved) {
                statusText = "Solved";
            } else if (
                progress.completed
            ) {
                statusText = "Completed";
            } else if (
                progress.attempts > 0
            ) {
                statusText = "In Progress";
            }

            if (score) {
                score.textContent =
                    (
                        progress.bestScore ||
                        0
                    ) +
                    " / " +
                    challenge.points;
            }

            if (attempts) {
                attempts.textContent =
                    String(
                        progress.attempts ||
                        0
                    );
            }

            if (status) {
                status.textContent =
                    statusText;
            }

            if (cardStatus) {
                cardStatus.textContent =
                    statusText;
            }

            if (!message) {
                return;
            }

            if (progress.solved) {
                message.textContent =
                    "🏆 Solved competitively. Excellent ADS reasoning!";
            } else if (
                progress.completed
            ) {
                message.textContent =
                    "✅ Completed after viewing the official C program.";
            } else if (
                progress.solutionViewed
            ) {
                message.textContent =
                    "📘 Official program viewed. Pass all tests to complete the challenge.";
            } else if (
                progress.hintUsed
            ) {
                message.textContent =
                    "💡 Hint used. Maximum competitive score is " +
                    Math.floor(
                        challenge.points *
                        0.9
                    ) +
                    " / " +
                    challenge.points +
                    ".";
            } else {
                message.textContent =
                    "Solve the challenge and verify all five tests. 💪";
            }
        }

        function challengeMarkup(
            challenge
        ) {
            const concepts =
                challenge.concepts.map(
                    function (concept) {
                        return (
                            "<span>" +
                            escapeHtml(
                                concept
                            ) +
                            "</span>"
                        );
                    }
                ).join("");

            return [
                '<details class="ads-challenge-card" id="' +
                    challenge.key +
                    '">',

                "<summary>",

                '<div class="ads-challenge-topline">',

                '<span class="ads-challenge-number">CHALLENGE ' +
                    String(
                        challenge.number
                    ).padStart(2, "0") +
                    "</span>",

                '<span class="ads-difficulty ads-diff-' +
                    difficultyClass(
                        challenge.difficulty
                    ) +
                    '">' +
                    escapeHtml(
                        challenge.difficulty
                    ) +
                    "</span>",

                "</div>",

                "<h3>" +
                    escapeHtml(
                        challenge.title
                    ) +
                    "</h3>",

                '<p class="ads-core-skill">Core Skill: ' +
                    escapeHtml(
                        challenge.coreSkill
                    ) +
                    "</p>",

                '<div class="ads-challenge-summary-meta">' +
                    concepts +
                    "<span>" +
                    challenge.points +
                    " Points</span>" +
                    '<span id="adsCardStatus-' +
                    challenge.key +
                    '">Not Solved</span>' +
                    "</div>",

                '<span class="ads-view-challenge">View Challenge →</span>',

                "</summary>",

                '<div class="ads-challenge-body">',

                '<div class="ads-challenge-hero">',

                '<span class="ads-challenge-label">CODEBHAVYA ADS C CHALLENGE</span>',

                "<h2>" +
                    escapeHtml(
                        challenge.title
                    ) +
                    "</h2>",

                "<p>" +
                    escapeHtml(
                        challenge.story
                    ) +
                    "</p>",

                "</div>",

                '<div class="ads-challenge-spec-grid">',

                '<div class="ads-challenge-spec"><h4>🎯 Your Task</h4><p>' +
                    escapeHtml(
                        challenge.task
                    ) +
                    "</p></div>",

                '<div class="ads-challenge-spec"><h4>📥 Input Format</h4><p>' +
                    escapeHtml(
                        challenge.inputSpec
                    ) +
                    "</p></div>",

                '<div class="ads-challenge-spec"><h4>📤 Output Format</h4><p>' +
                    escapeHtml(
                        challenge.outputSpec
                    ) +
                    "</p></div>",

                '<div class="ads-challenge-spec"><h4>📏 Constraints</h4><p>' +
                    escapeHtml(
                        challenge.constraints
                    ) +
                    "</p></div>",

                "</div>",

                '<div class="ads-example-grid">',

                '<div class="ads-example-box"><strong>Example Input</strong><pre>' +
                    escapeHtml(
                        challenge.sampleInput
                    ) +
                    "</pre></div>",

                '<div class="ads-example-box"><strong>Example Output</strong><pre>' +
                    escapeHtml(
                        challenge.sampleOutput
                    ) +
                    "</pre></div>",

                "</div>",

                '<div class="ads-challenge-explanation"><strong>Explanation:</strong> ' +
                    escapeHtml(
                        challenge.explanation
                    ) +
                    "</div>",

                '<div class="ads-concept-row">' +
                    concepts +
                    "<span>" +
                    escapeHtml(
                        challenge.difficulty
                    ) +
                    "</span>" +
                    "<span>" +
                    challenge.points +
                    " Points</span>" +
                    "</div>",

                '<div class="ads-challenge-actions">',

                '<button class="ads-practice-start-button" type="button" ' +
                    'onclick="CodeBhavyaADSPractice.toggleWorkspace(\'' +
                    challenge.key +
                    "')\">" +
                    "💻 Solve It Yourself" +
                    "</button>",

                '<button class="ads-practice-hint-button" type="button" ' +
                    'onclick="CodeBhavyaADSPractice.toggleHint(\'' +
                    challenge.key +
                    "')\">" +
                    "Hint" +
                    "</button>",

                '<button class="ads-practice-program-button" type="button" ' +
                    'onclick="CodeBhavyaADSPractice.toggleSolution(\'' +
                    challenge.key +
                    "')\">" +
                    "Show Program" +
                    "</button>",

                "</div>",

                '<div class="ads-practice-hint" hidden id="adsHint-' +
                    challenge.key +
                    '">' +
                    "💡 <strong>Hint:</strong> " +
                    escapeHtml(
                        challenge.hint
                    ) +
                    "</div>",

                '<div class="ads-coding-workspace" hidden id="adsWorkspace-' +
                    challenge.key +
                    '">',

                '<div class="ads-coding-workspace-title">💻 Solve It Yourself — ' +
                    escapeHtml(
                        challenge.title
                    ) +
                    "</div>",

                '<div class="ads-coding-grid">',

                '<div class="ads-coding-panel">',

                "<h4>C Code Editor</h4>",

                '<textarea class="ads-code-editor" id="adsCode-' +
                    challenge.key +
                    '" spellcheck="false">' +
                    escapeHtml(
                        C_STARTER
                    ) +
                    "</textarea>",

                '<div class="ads-coding-actions">',

                '<button class="ads-run-button" type="button" id="adsRun-' +
                    challenge.key +
                    '" onclick="CodeBhavyaADSPractice.runSample(\'' +
                    challenge.key +
                    "')\">" +
                    "▶ Run Code" +
                    "</button>",

                '<button class="ads-check-button" type="button" id="adsCheck-' +
                    challenge.key +
                    '" onclick="CodeBhavyaADSPractice.checkAnswer(\'' +
                    challenge.key +
                    "')\">" +
                    "✓ Check Answer" +
                    "</button>",

                '<button class="ads-reset-button" type="button" ' +
                    'onclick="CodeBhavyaADSPractice.resetEditor(\'' +
                    challenge.key +
                    "')\">" +
                    "↺ Reset Editor" +
                    "</button>",

                "</div>",
                "</div>",

                '<div class="ads-coding-panel">',

                "<h4>Sample Input</h4>",

                '<textarea class="ads-practice-input" id="adsInput-' +
                    challenge.key +
                    '" spellcheck="false">' +
                    escapeHtml(
                        challenge.sampleInput
                    ) +
                    "</textarea>",

                '<h4 class="ads-output-heading">Program Output</h4>',

                '<pre class="ads-practice-output" id="adsOutput-' +
                    challenge.key +
                    '">' +
                    "Run your program to see the output." +
                    "</pre>",

                '<h4 class="ads-tests-heading">Test Cases</h4>',

                '<div class="ads-test-results" id="adsTests-' +
                    challenge.key +
                    '">' +
                    '<div class="ads-test-row">' +
                    "<span>No tests checked yet.</span>" +
                    "<strong>—</strong>" +
                    "</div>" +
                    "</div>",

                "</div>",
                "</div>",

                '<div class="ads-practice-score">',

                '<div class="ads-practice-score-grid">',

                '<div class="ads-score-item">' +
                    "<strong>Best Score</strong>" +
                    '<span id="adsScore-' +
                    challenge.key +
                    '">' +
                    "0 / " +
                    challenge.points +
                    "</span>" +
                    "</div>",

                '<div class="ads-score-item">' +
                    "<strong>Attempts</strong>" +
                    '<span id="adsAttempts-' +
                    challenge.key +
                    '">0</span>' +
                    "</div>",

                '<div class="ads-score-item">' +
                    "<strong>Status</strong>" +
                    '<span id="adsStatus-' +
                    challenge.key +
                    '">Not Solved</span>' +
                    "</div>",

                "</div>",

                '<div class="ads-practice-message" id="adsMessage-' +
                    challenge.key +
                    '">' +
                    "Solve the challenge and verify all five tests. 💪" +
                    "</div>",

                "</div>",
                "</div>",

                '<div class="ads-practice-solution" hidden id="adsSolution-' +
                    challenge.key +
                    '">',

                '<div class="ads-practice-solution-title">Official C Program</div>',

                "<pre><code>" +
                    escapeHtml(
                        challenge.solution
                    ) +
                    "</code></pre>",

                "</div>",
                "</div>",
                "</details>"
            ].join("");
        }

        function renderLevel(level) {
            const host = byId(level.host);

            if (!host) {
                return;
            }

            host.innerHTML =
                level.challenges.map(
                    challengeMarkup
                ).join("");

            level.challenges.forEach(
                function (challenge) {
                    updateChallengeUI(
                        challenge.key
                    );
                }
            );
        }

        function renderLevels() {
            LEVELS.forEach(renderLevel);
            updateOverall();
        }

        function toggleWorkspace(key) {
            const box =
                byId(
                    "adsWorkspace-" + key
                );

            if (box) {
                box.hidden = !box.hidden;
            }
        }

        function toggleHint(key) {
            const box =
                byId("adsHint-" + key);

            if (!box) {
                return;
            }

            box.hidden = !box.hidden;

            if (!box.hidden) {
                const progress =
                    readProgress(key);

                if (!progress.solved) {
                    progress.hintUsed =
                        true;
                }

                saveProgress(
                    key,
                    progress
                );

                updateChallengeUI(key);
                updateOverall();
            }
        }

        function toggleSolution(key) {
            const box =
                byId(
                    "adsSolution-" + key
                );

            if (!box) {
                return;
            }

            box.hidden = !box.hidden;

            if (!box.hidden) {
                const progress =
                    readProgress(key);

                if (!progress.solved) {
                    progress.solutionViewed =
                        true;
                }

                saveProgress(
                    key,
                    progress
                );

                updateChallengeUI(key);
                updateOverall();
            }
        }

        async function judge(
            code,
            input
        ) {
            const response =
                await window.fetch(
                    judge0Base +
                    "/submissions?base64_encoded=false&wait=true",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            source_code: code,
                            language_id:
                                cLanguageId,
                            stdin: input
                        })
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Judge0 request failed (" +
                    response.status +
                    ")"
                );
            }

            return response.json();
        }

        function executionError(result) {
            if (result.compile_output) {
                return (
                    "Compilation Error:\n" +
                    result.compile_output
                );
            }

            if (result.stderr) {
                return (
                    "Runtime Error:\n" +
                    result.stderr
                );
            }

            return (
                result.message ||
                (
                    result.status &&
                    result.status.description
                ) ||
                "Execution failed."
            );
        }

        async function runSample(key) {
            const challenge =
                getConfig(key);

            if (!challenge) {
                return;
            }

            const codeBox =
                byId("adsCode-" + key);

            const inputBox =
                byId("adsInput-" + key);

            const output =
                byId("adsOutput-" + key);

            const button =
                byId("adsRun-" + key);

            const code =
                codeBox
                    ? codeBox.value
                    : "";

            const input =
                inputBox
                    ? inputBox.value
                    : "";

            if (!code.trim()) {
                if (output) {
                    output.textContent =
                        "Write your C program first.";
                }

                return;
            }

            if (button) {
                button.disabled = true;
            }

            if (output) {
                output.textContent =
                    "Running...";
            }

            try {
                const result =
                    await judge(
                        code,
                        input
                    );

                if (output) {
                    output.textContent =
                        result.status &&
                        result.status.id === 3
                            ? (
                                result.stdout ||
                                ""
                            )
                            : executionError(
                                result
                            );
                }
            } catch (error) {
                if (output) {
                    output.textContent =
                        "Could not contact the code execution service.\n" +
                        "Please check your internet connection and try again.\n\n" +
                        error.message;
                }
            } finally {
                if (button) {
                    button.disabled =
                        false;
                }
            }
        }

        async function checkAnswer(key) {
            const challenge =
                getConfig(key);

            if (!challenge) {
                return;
            }

            const codeBox =
                byId("adsCode-" + key);

            const output =
                byId("adsOutput-" + key);

            const testsHost =
                byId("adsTests-" + key);

            const button =
                byId("adsCheck-" + key);

            const code =
                codeBox
                    ? codeBox.value
                    : "";

            if (!code.trim()) {
                if (output) {
                    output.textContent =
                        "Write your C program first.";
                }

                return;
            }

            const progress =
                readProgress(key);

            progress.attempts += 1;

            saveProgress(
                key,
                progress
            );

            updateChallengeUI(key);

            if (button) {
                button.disabled = true;
            }

            if (testsHost) {
                testsHost.innerHTML = "";
            }

            if (output) {
                output.textContent =
                    "Checking five test cases...";
            }

            let passed = 0;
            let serviceFailed = false;

            for (
                let index = 0;
                index <
                    challenge.tests.length;
                index += 1
            ) {
                const test =
                    challenge.tests[index];

                try {
                    const result =
                        await judge(
                            code,
                            test.input
                        );

                    const correct =
                        Boolean(
                            result.status &&
                            result.status.id ===
                                3 &&
                            normalize(
                                result.stdout
                            ) ===
                            normalize(
                                test.expected
                            )
                        );

                    if (correct) {
                        passed += 1;
                    }

                    if (testsHost) {
                        testsHost.innerHTML +=
                            '<div class="ads-test-row ' +
                            (
                                correct
                                    ? "pass"
                                    : "fail"
                            ) +
                            '">' +
                            "<span>Test " +
                            (index + 1) +
                            ": " +
                            (
                                correct
                                    ? "Passed"
                                    : "Failed"
                            ) +
                            "</span>" +
                            "<strong>" +
                            (
                                correct
                                    ? "✓"
                                    : "✕"
                            ) +
                            "</strong>" +
                            "</div>";
                    }
                } catch (error) {
                    serviceFailed = true;

                    if (testsHost) {
                        testsHost.innerHTML +=
                            '<div class="ads-test-row fail">' +
                            "<span>Test " +
                            (index + 1) +
                            ": Judge unavailable</span>" +
                            "<strong>✕</strong>" +
                            "</div>";
                    }

                    break;
                }
            }

            const rawScore =
                Math.round(
                    challenge.points *
                    passed /
                    challenge.tests.length
                );

            const competitiveScore =
                progress.hintUsed
                    ? Math.min(
                        rawScore,
                        Math.floor(
                            challenge.points *
                            0.9
                        )
                    )
                    : rawScore;

            if (
                progress.solutionViewed
            ) {
                if (
                    passed ===
                    challenge.tests.length
                ) {
                    progress.completed =
                        true;
                }
            } else {
                progress.bestScore =
                    Math.max(
                        progress.bestScore,
                        competitiveScore
                    );

                if (
                    passed ===
                    challenge.tests.length
                ) {
                    progress.solved = true;
                    progress.completed = true;
                }
            }

            saveProgress(
                key,
                progress
            );

            if (output) {
                output.textContent =
                    serviceFailed
                        ? "The code execution service could not be reached. Please try again."
                        : (
                            passed +
                            " / " +
                            challenge.tests.length +
                            " tests passed.\n" +
                            (
                                progress.solutionViewed
                                    ? "Completion mode"
                                    : (
                                        "Score this attempt: " +
                                        competitiveScore +
                                        " / " +
                                        challenge.points
                                    )
                            )
                        );
            }

            updateChallengeUI(key);
            updateOverall();

            if (button) {
                button.disabled = false;
            }
        }

        function resetEditor(key) {
            const challenge =
                getConfig(key);

            if (!challenge) {
                return;
            }

            const code =
                byId("adsCode-" + key);

            const input =
                byId("adsInput-" + key);

            const output =
                byId("adsOutput-" + key);

            const tests =
                byId("adsTests-" + key);

            if (code) {
                code.value = C_STARTER;
            }

            if (input) {
                input.value =
                    challenge.sampleInput;
            }

            if (output) {
                output.textContent =
                    "Run your program to see the output.";
            }

            if (tests) {
                tests.innerHTML =
                    '<div class="ads-test-row">' +
                    "<span>No tests checked yet.</span>" +
                    "<strong>—</strong>" +
                    "</div>";
            }
        }

        if (
            document.readyState ===
            "loading"
        ) {
            document.addEventListener(
                "DOMContentLoaded",
                renderLevels
            );
        } else {
            renderLevels();
        }

        return {
            renderLevels: renderLevels,
            toggleWorkspace:
                toggleWorkspace,
            toggleHint: toggleHint,
            toggleSolution:
                toggleSolution,
            runSample: runSample,
            checkAnswer: checkAnswer,
            resetEditor: resetEditor,
            updateOverall: updateOverall
        };
    }());
}());
