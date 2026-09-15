"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 16 — Multiway Search Trees";

function program(options) {
  return makeAds({ topic, concepts: ["B-tree", "Multiway search"], difficulty: "Advanced", ...options });
}

module.exports = [
  program({
    slug: "ads-search-btree-node",
    title: "Search Within a B-Tree Node",
    source: cMain(`    int keys[] = {10, 20, 35, 50, 70}, target = 35, position = 0;
    while (position < 5 && keys[position] < target) position++;
    printf("Found at slot = %d\\n", position); return 0;`),
    sampleOutput: "Found at slot = 2",
    time: "O(node keys)",
    method: "Scan sorted separator keys to locate either the key or the child interval to follow."
  }),
  program({
    slug: "ads-btree-search-path",
    title: "Follow a Search Path in a B-Tree",
    source: cMain(`    struct Node left = {{5,10},2,{0}}, middle = {{25,30},2,{0}}, right = {{45,60},2,{0}};
    struct Node root = {{20,40},2,{&left,&middle,&right}}; int target = 30, child = 0;
    while (child < root.count && target > root.keys[child]) child++;
    struct Node *leaf = root.child[child]; int slot = 0; while (slot < leaf->count && leaf->keys[slot] < target) slot++;
    printf("Child = %d Slot = %d Found = %s\\n", child, slot, slot < leaf->count && leaf->keys[slot] == target ? "Yes" : "No"); return 0;`, ["stdio.h"], `struct Node { int keys[3], count; struct Node *child[4]; };`),
    sampleOutput: "Child = 1 Slot = 1 Found = Yes",
    time: "O(height * node keys)",
    space: "O(1)",
    method: "Choose a child using root separators and repeat the ordered search inside the selected leaf."
  }),
  program({
    slug: "ads-split-full-btree-root",
    title: "Split a Full B-Tree Root",
    source: cMain(`    int full[] = {10, 20, 30}; int promoted = full[1], left = full[0], right = full[2];
    printf("Root = %d Left = %d Right = %d\\n", promoted, left, right); return 0;`),
    sampleOutput: "Root = 20 Left = 10 Right = 30",
    time: "O(t)",
    space: "O(t)",
    method: "Promote the median key and distribute smaller and larger keys into two children."
  }),
  program({
    slug: "ads-btree-insert-traverse",
    title: "Insert and Traverse a Minimum-Degree-2 B-Tree",
    source: cMain(`    int keys[] = {10,20,5,6,12,30,7,17}; struct Node *root = new_node(1);
    for (int i = 0; i < 8; i++) { insert_key(&root, keys[i]); }
    traverse(root); putchar('\\n'); free_tree(root); return 0;`, ["stdio.h", "stdlib.h"], `#define T 2
struct Node { int keys[2*T-1], count, leaf; struct Node *child[2*T]; };
struct Node *new_node(int leaf) { struct Node *node = calloc(1, sizeof *node); if (!node) exit(EXIT_FAILURE); node->leaf = leaf; return node; }
void split_child(struct Node *parent, int index) { struct Node *full = parent->child[index], *right = new_node(full->leaf); right->count = T - 1; for (int j = 0; j < T - 1; j++) right->keys[j] = full->keys[j + T]; if (!full->leaf) for (int j = 0; j < T; j++) right->child[j] = full->child[j + T]; full->count = T - 1; for (int j = parent->count; j >= index + 1; j--) parent->child[j + 1] = parent->child[j]; parent->child[index + 1] = right; for (int j = parent->count - 1; j >= index; j--) parent->keys[j + 1] = parent->keys[j]; parent->keys[index] = full->keys[T - 1]; parent->count++; }
void insert_nonfull(struct Node *node, int key) { int i = node->count - 1; if (node->leaf) { while (i >= 0 && key < node->keys[i]) { node->keys[i + 1] = node->keys[i]; i--; } node->keys[i + 1] = key; node->count++; } else { while (i >= 0 && key < node->keys[i]) i--; i++; if (node->child[i]->count == 2*T-1) { split_child(node, i); if (key > node->keys[i]) i++; } insert_nonfull(node->child[i], key); } }
void insert_key(struct Node **root, int key) { if ((*root)->count == 2*T-1) { struct Node *new_root = new_node(0); new_root->child[0] = *root; split_child(new_root, 0); insert_nonfull(new_root, key); *root = new_root; } else insert_nonfull(*root, key); }
void traverse(struct Node *node) { int i; for (i = 0; i < node->count; i++) { if (!node->leaf) traverse(node->child[i]); printf("%d ", node->keys[i]); } if (!node->leaf) traverse(node->child[i]); }
void free_tree(struct Node *node) { if (node) { if (!node->leaf) for (int i = 0; i <= node->count; i++) free_tree(node->child[i]); free(node); } }`),
    sampleOutput: "5 6 7 10 12 17 20 30",
    time: "O(t log_t n)",
    space: "O(log_t n)",
    method: "Split full children before descent so insertion always reaches a non-full leaf."
  }),
  program({
    slug: "ads-btree-minimum-maximum",
    title: "Find Minimum and Maximum Keys in a B-Tree",
    source: cMain(`    int left_leaf[] = {2, 5, 8}, right_leaf[] = {42, 50, 60};
    printf("Minimum = %d Maximum = %d\\n", left_leaf[0], right_leaf[2]); return 0;`),
    sampleOutput: "Minimum = 2 Maximum = 60",
    time: "O(height)",
    method: "Descend through the leftmost child for minimum and rightmost child for maximum."
  }),
  program({
    slug: "ads-two-three-tree-promotion",
    title: "Promote the Median in a 2–3 Tree",
    source: cMain(`    int keys[] = {30, 10, 20};
    for (int i = 1; i < 3; i++) { int value = keys[i], j = i - 1; while (j >= 0 && keys[j] > value) { keys[j + 1] = keys[j]; j--; } keys[j + 1] = value; }
    printf("Promote = %d Left = %d Right = %d\\n", keys[1], keys[0], keys[2]); return 0;`),
    sampleOutput: "Promote = 20 Left = 10 Right = 30",
    time: "O(1) for a 3-key overflow",
    method: "Sort the overflowing node's three keys, promote the middle and retain one key per child."
  }),
  program({
    slug: "ads-bplus-tree-leaf-range-scan",
    title: "Scan a Key Range Across B+ Tree Leaves",
    source: cMain(`    struct Leaf third = {{40,50,60},3,NULL}, second = {{20,25,30},3,&third}, first = {{5,10,15},3,&second};
    int low = 12, high = 45; struct Leaf *leaf = &first; printf("Range:");
    while (leaf) { for (int i = 0; i < leaf->count; i++) if (leaf->keys[i] >= low && leaf->keys[i] <= high) printf(" %d", leaf->keys[i]); leaf = leaf->next; }
    putchar('\\n'); return 0;`, ["stdio.h", "stddef.h"], `struct Leaf { int keys[3], count; struct Leaf *next; };`),
    sampleOutput: "Range: 15 20 25 30 40",
    time: "O(log n + output)",
    space: "O(1)",
    method: "Reach the first relevant leaf, then follow sibling links until keys exceed the upper bound."
  }),
  program({
    slug: "ads-btree-capacity-calculator",
    title: "Calculate B-Tree Key Capacity by Height",
    source: cMain(`    int minimum_degree = 3, height = 3; long long minimum_keys = 1, maximum_keys = 1;
    for (int level = 0; level < height; level++) { minimum_keys *= minimum_degree; maximum_keys *= 2 * minimum_degree; }
    minimum_keys = 2 * minimum_keys - 1; maximum_keys -= 1;
    printf("Min keys = %lld Max keys = %lld\\n", minimum_keys, maximum_keys); return 0;`),
    sampleOutput: "Min keys = 53 Max keys = 215",
    time: "O(height)",
    method: "Apply B-tree branching limits to derive minimum and maximum keys at a chosen height."
  })
];
