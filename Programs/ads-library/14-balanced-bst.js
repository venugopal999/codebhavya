"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 14 — Balanced Binary Search Trees";
const avl = `struct Node { int key, height; struct Node *left, *right; };
int height(struct Node *node) { return node ? node->height : 0; }
int maximum(int a, int b) { return a > b ? a : b; }
struct Node *new_node(int key) { struct Node *node = malloc(sizeof *node); if (!node) exit(EXIT_FAILURE); node->key = key; node->height = 1; node->left = node->right = NULL; return node; }
void update(struct Node *node) { node->height = 1 + maximum(height(node->left), height(node->right)); }
struct Node *rotate_right(struct Node *root) { struct Node *pivot = root->left, *middle = pivot->right; pivot->right = root; root->left = middle; update(root); update(pivot); return pivot; }
struct Node *rotate_left(struct Node *root) { struct Node *pivot = root->right, *middle = pivot->left; pivot->left = root; root->right = middle; update(root); update(pivot); return pivot; }
struct Node *balance_node(struct Node *root)
{
    update(root); int balance = height(root->left) - height(root->right);
    if (balance > 1) { if (height(root->left->left) < height(root->left->right)) root->left = rotate_left(root->left); return rotate_right(root); }
    if (balance < -1) { if (height(root->right->right) < height(root->right->left)) root->right = rotate_right(root->right); return rotate_left(root); }
    return root;
}
struct Node *insert(struct Node *root, int key) { if (!root) return new_node(key); if (key < root->key) root->left = insert(root->left, key); else if (key > root->key) root->right = insert(root->right, key); else return root; return balance_node(root); }
struct Node *minimum_node(struct Node *root) { while (root->left) root = root->left; return root; }
struct Node *delete_key(struct Node *root, int key)
{
    if (!root) return NULL;
    if (key < root->key) root->left = delete_key(root->left, key);
    else if (key > root->key) root->right = delete_key(root->right, key);
    else if (!root->left || !root->right) { struct Node *child = root->left ? root->left : root->right; free(root); return child; }
    else { struct Node *next = minimum_node(root->right); root->key = next->key; root->right = delete_key(root->right, next->key); }
    return balance_node(root);
}
void inorder(struct Node *root) { if (root) { inorder(root->left); printf("%d ", root->key); inorder(root->right); } }
void free_tree(struct Node *root) { if (root) { free_tree(root->left); free_tree(root->right); free(root); } }`;

function program(options) {
  return makeAds({ topic, concepts: ["Self-balancing BST", "Logarithmic operations"], difficulty: "Advanced", space: "O(h)", ...options });
}

module.exports = [
  program({
    slug: "ads-avl-tree-insertion",
    title: "Insert Keys into an AVL Tree",
    source: cMain(`    int keys[] = {10, 20, 30, 40, 50, 25}; struct Node *root = NULL;
    for (int i = 0; i < 6; i++) root = insert(root, keys[i]);
    inorder(root); printf("\\nRoot = %d\\n", root->key); free_tree(root); return 0;`, ["stdio.h", "stdlib.h"], avl),
    sampleOutput: "10 20 25 30 40 50\nRoot = 30",
    time: "O(log n) per insertion",
    method: "Insert as in a BST, update heights and apply the required single or double rotation."
  }),
  program({
    slug: "ads-avl-four-rotation-cases",
    title: "Demonstrate All Four AVL Rotation Cases",
    source: cMain(`    int cases[4][3] = {{30,20,10},{10,20,30},{30,10,20},{10,30,20}};
    for (int row = 0; row < 4; row++) { struct Node *root = NULL; for (int i = 0; i < 3; i++) root = insert(root, cases[row][i]); printf("%d%c", root->key, row == 3 ? '\\n' : ' '); free_tree(root); }
    return 0;`, ["stdio.h", "stdlib.h"], avl),
    sampleOutput: "20 20 20 20",
    time: "O(log n) per insertion",
    method: "Trigger LL, RR, LR and RL imbalance patterns and observe their common balanced root."
  }),
  program({
    slug: "ads-avl-tree-search",
    title: "Search an AVL Tree",
    source: cMain(`    int keys[] = {30, 20, 40, 10, 25, 35, 50}; struct Node *root = NULL, *cursor;
    for (int i = 0; i < 7; i++) root = insert(root, keys[i]);
    cursor = root; while (cursor && cursor->key != 35) cursor = 35 < cursor->key ? cursor->left : cursor->right;
    printf("Found = %s\\n", cursor ? "Yes" : "No"); free_tree(root); return 0;`, ["stdio.h", "stdlib.h"], avl),
    sampleOutput: "Found = Yes",
    time: "O(log n)",
    method: "Follow the BST ordering while AVL height guarantees keep the search path logarithmic."
  }),
  program({
    slug: "ads-avl-tree-deletion",
    title: "Delete a Key from an AVL Tree",
    source: cMain(`    int keys[] = {9, 5, 10, 0, 6, 11, -1, 1, 2}; struct Node *root = NULL;
    for (int i = 0; i < 9; i++) root = insert(root, keys[i]);
    root = delete_key(root, 10); inorder(root); putchar('\\n'); free_tree(root); return 0;`, ["stdio.h", "stdlib.h"], avl),
    sampleOutput: "-1 0 1 2 5 6 9 11",
    time: "O(log n)",
    method: "Perform ordinary BST deletion, then rebalance every ancestor on the return path."
  }),
  program({
    slug: "ads-validate-avl-balance",
    title: "Validate AVL Height Balance",
    source: cMain(`    int keys[] = {30, 20, 40, 10, 25, 35, 50}; struct Node *root = NULL;
    for (int i = 0; i < 7; i++) root = insert(root, keys[i]);
    printf("Balanced = %s\\n", check(root) >= 0 ? "Yes" : "No"); free_tree(root); return 0;`, ["stdio.h", "stdlib.h"], `${avl}
int check(struct Node *root) { if (!root) return 0; int left = check(root->left), right = check(root->right); if (left < 0 || right < 0 || left - right > 1 || right - left > 1) return -1; return 1 + maximum(left, right); }`),
    sampleOutput: "Balanced = Yes",
    time: "O(n)",
    method: "Return subtree heights bottom-up and reject any node whose two heights differ by more than one."
  }),
  program({
    slug: "ads-red-black-left-leaning-insertion",
    title: "Insert into a Left-Leaning Red–Black Tree",
    source: cMain(`    int keys[] = {10, 20, 30, 15, 25}; struct Node *root = NULL;
    for (int i = 0; i < 5; i++) { root = insert_node(root, keys[i]); root->red = 0; }
    inorder_node(root); printf("\\nRoot = %d Black = %s\\n", root->key, root->red ? "No" : "Yes"); free_nodes(root); return 0;`, ["stdio.h", "stdlib.h"], `struct Node { int key, red; struct Node *left, *right; };
int is_red(struct Node *node) { return node && node->red; }
struct Node *make_node(int key) { struct Node *node = malloc(sizeof *node); if (!node) exit(EXIT_FAILURE); node->key = key; node->red = 1; node->left = node->right = NULL; return node; }
struct Node *rotate_left_rb(struct Node *root) { struct Node *x = root->right; root->right = x->left; x->left = root; x->red = root->red; root->red = 1; return x; }
struct Node *rotate_right_rb(struct Node *root) { struct Node *x = root->left; root->left = x->right; x->right = root; x->red = root->red; root->red = 1; return x; }
void flip(struct Node *root) { root->red = !root->red; root->left->red = !root->left->red; root->right->red = !root->right->red; }
struct Node *insert_node(struct Node *root, int key) { if (!root) return make_node(key); if (key < root->key) root->left = insert_node(root->left, key); else if (key > root->key) root->right = insert_node(root->right, key); if (is_red(root->right) && !is_red(root->left)) root = rotate_left_rb(root); if (is_red(root->left) && is_red(root->left->left)) root = rotate_right_rb(root); if (is_red(root->left) && is_red(root->right)) flip(root); return root; }
void inorder_node(struct Node *root) { if (root) { inorder_node(root->left); printf("%d ", root->key); inorder_node(root->right); } }
void free_nodes(struct Node *root) { if (root) { free_nodes(root->left); free_nodes(root->right); free(root); } }`),
    sampleOutput: "10 15 20 25 30\nRoot = 20 Black = Yes",
    time: "O(log n) per insertion",
    method: "Use rotations and color flips to encode balanced 2–3 tree operations in a binary tree."
  }),
  program({
    slug: "ads-avl-kth-smallest",
    title: "Find the Kth Smallest Key in an AVL Tree",
    source: cMain(`    int keys[] = {30, 20, 40, 10, 25, 35, 50}, seen = 0, answer = 0; struct Node *root = NULL;
    for (int i = 0; i < 7; i++) root = insert(root, keys[i]);
    kth(root, 4, &seen, &answer); printf("4th smallest = %d\\n", answer); free_tree(root); return 0;`, ["stdio.h", "stdlib.h"], `${avl}
void kth(struct Node *root, int target, int *seen, int *answer) { if (!root || *seen >= target) return; kth(root->left, target, seen, answer); if (++(*seen) == target) { *answer = root->key; return; } kth(root->right, target, seen, answer); }`),
    sampleOutput: "4th smallest = 30",
    time: "O(n) without subtree sizes",
    method: "Use AVL inorder order and stop when the visit counter reaches k."
  }),
  program({
    slug: "ads-interval-tree-overlap-search",
    title: "Find an Overlap with an Interval Tree",
    source: cMain(`    int intervals[][2] = {{15,20},{10,30},{17,19},{5,20},{12,15},{30,40}}; struct Node *root = NULL;
    for (int i = 0; i < 6; i++) root = insert_interval(root, intervals[i][0], intervals[i][1]);
    struct Node *match = overlap(root, 6, 7); printf("Overlap = [%d,%d]\\n", match->low, match->high); free_intervals(root); return 0;`, ["stdio.h", "stdlib.h"], `struct Node { int low, high, maximum; struct Node *left, *right; };
struct Node *insert_interval(struct Node *root, int low, int high) { if (!root) { root = malloc(sizeof *root); if (!root) exit(EXIT_FAILURE); root->low = low; root->high = root->maximum = high; root->left = root->right = NULL; return root; } if (low < root->low) root->left = insert_interval(root->left, low, high); else root->right = insert_interval(root->right, low, high); if (high > root->maximum) root->maximum = high; return root; }
struct Node *overlap(struct Node *root, int low, int high) { while (root && (root->high < low || high < root->low)) { if (root->left && root->left->maximum >= low) root = root->left; else root = root->right; } return root; }
void free_intervals(struct Node *root) { if (root) { free_intervals(root->left); free_intervals(root->right); free(root); } }`),
    sampleOutput: "Overlap = [5,20]",
    time: "O(h)",
    method: "Use each subtree's maximum high endpoint to discard branches that cannot overlap the query."
  })
];
