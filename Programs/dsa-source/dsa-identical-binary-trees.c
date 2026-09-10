#include <stdio.h>
#include <stdlib.h>

struct TreeNode { int data; struct TreeNode *left; struct TreeNode *right; };
struct TreeNode *new_node(int value)
{
    struct TreeNode *node = malloc(sizeof *node);
    if (node == NULL) exit(EXIT_FAILURE);
    node->data = value; node->left = NULL; node->right = NULL;
    return node;
}
struct TreeNode *sample_tree(void)
{
    struct TreeNode *root = new_node(1);
    root->left = new_node(2); root->right = new_node(3);
    root->left->left = new_node(4); root->left->right = new_node(5);
    root->right->left = new_node(6); root->right->right = new_node(7);
    return root;
}
void free_tree(struct TreeNode *root)
{
    if (root == NULL) return;
    free_tree(root->left); free_tree(root->right); free(root);
}
int identical(struct TreeNode *first, struct TreeNode *second)
{
    if (first == NULL || second == NULL) return first == second;
    return first->data == second->data &&
           identical(first->left, second->left) &&
           identical(first->right, second->right);
}

int main(void)
{
    struct TreeNode *first = sample_tree();
    struct TreeNode *second = sample_tree();
    puts(identical(first, second) ? "Trees are identical." : "Trees differ.");
    free_tree(first); free_tree(second);
    return 0;
}
