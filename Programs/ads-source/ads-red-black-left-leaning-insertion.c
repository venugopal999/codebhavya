#include <stdio.h>
#include <stdlib.h>

struct Node { int key, red; struct Node *left, *right; };
int is_red(struct Node *node) { return node && node->red; }
struct Node *make_node(int key) { struct Node *node = malloc(sizeof *node); if (!node) exit(EXIT_FAILURE); node->key = key; node->red = 1; node->left = node->right = NULL; return node; }
struct Node *rotate_left_rb(struct Node *root) { struct Node *x = root->right; root->right = x->left; x->left = root; x->red = root->red; root->red = 1; return x; }
struct Node *rotate_right_rb(struct Node *root) { struct Node *x = root->left; root->left = x->right; x->right = root; x->red = root->red; root->red = 1; return x; }
void flip(struct Node *root) { root->red = !root->red; root->left->red = !root->left->red; root->right->red = !root->right->red; }
struct Node *insert_node(struct Node *root, int key) { if (!root) return make_node(key); if (key < root->key) root->left = insert_node(root->left, key); else if (key > root->key) root->right = insert_node(root->right, key); if (is_red(root->right) && !is_red(root->left)) root = rotate_left_rb(root); if (is_red(root->left) && is_red(root->left->left)) root = rotate_right_rb(root); if (is_red(root->left) && is_red(root->right)) flip(root); return root; }
void inorder_node(struct Node *root) { if (root) { inorder_node(root->left); printf("%d ", root->key); inorder_node(root->right); } }
void free_nodes(struct Node *root) { if (root) { free_nodes(root->left); free_nodes(root->right); free(root); } }

int main(void)
{
    int keys[] = {10, 20, 30, 15, 25}; struct Node *root = NULL;
    for (int i = 0; i < 5; i++) { root = insert_node(root, keys[i]); root->red = 0; }
    inorder_node(root); printf("\nRoot = %d Black = %s\n", root->key, root->red ? "No" : "Yes"); free_nodes(root); return 0;
}
