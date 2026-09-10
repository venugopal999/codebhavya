#include <stdio.h>
#include <stdlib.h>

#define T 2
struct Node { int keys[2*T-1], count, leaf; struct Node *child[2*T]; };
struct Node *new_node(int leaf) { struct Node *node = calloc(1, sizeof *node); if (!node) exit(EXIT_FAILURE); node->leaf = leaf; return node; }
void split_child(struct Node *parent, int index) { struct Node *full = parent->child[index], *right = new_node(full->leaf); right->count = T - 1; for (int j = 0; j < T - 1; j++) right->keys[j] = full->keys[j + T]; if (!full->leaf) for (int j = 0; j < T; j++) right->child[j] = full->child[j + T]; full->count = T - 1; for (int j = parent->count; j >= index + 1; j--) parent->child[j + 1] = parent->child[j]; parent->child[index + 1] = right; for (int j = parent->count - 1; j >= index; j--) parent->keys[j + 1] = parent->keys[j]; parent->keys[index] = full->keys[T - 1]; parent->count++; }
void insert_nonfull(struct Node *node, int key) { int i = node->count - 1; if (node->leaf) { while (i >= 0 && key < node->keys[i]) { node->keys[i + 1] = node->keys[i]; i--; } node->keys[i + 1] = key; node->count++; } else { while (i >= 0 && key < node->keys[i]) i--; i++; if (node->child[i]->count == 2*T-1) { split_child(node, i); if (key > node->keys[i]) i++; } insert_nonfull(node->child[i], key); } }
void insert_key(struct Node **root, int key) { if ((*root)->count == 2*T-1) { struct Node *new_root = new_node(0); new_root->child[0] = *root; split_child(new_root, 0); insert_nonfull(new_root, key); *root = new_root; } else insert_nonfull(*root, key); }
void traverse(struct Node *node) { int i; for (i = 0; i < node->count; i++) { if (!node->leaf) traverse(node->child[i]); printf("%d ", node->keys[i]); } if (!node->leaf) traverse(node->child[i]); }
void free_tree(struct Node *node) { if (node) { if (!node->leaf) for (int i = 0; i <= node->count; i++) free_tree(node->child[i]); free(node); } }

int main(void)
{
    int keys[] = {10,20,5,6,12,30,7,17}; struct Node *root = new_node(1);
    for (int i = 0; i < 8; i++) { insert_key(&root, keys[i]); }
    traverse(root); putchar('\n'); free_tree(root); return 0;
}
