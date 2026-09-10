#include <stdio.h>
#include <stdlib.h>

struct Node { int key, height; struct Node *left, *right; };
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
void free_tree(struct Node *root) { if (root) { free_tree(root->left); free_tree(root->right); free(root); } }

int main(void)
{
    int keys[] = {30, 20, 40, 10, 25, 35, 50}; struct Node *root = NULL, *cursor;
    for (int i = 0; i < 7; i++) root = insert(root, keys[i]);
    cursor = root; while (cursor && cursor->key != 35) cursor = 35 < cursor->key ? cursor->left : cursor->right;
    printf("Found = %s\n", cursor ? "Yes" : "No"); free_tree(root); return 0;
}
