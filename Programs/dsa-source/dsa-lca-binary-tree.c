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
struct TreeNode *lca(struct TreeNode *root, int first, int second)
{
    if (root == NULL || root->data == first || root->data == second) return root;
    struct TreeNode *left = lca(root->left, first, second);
    struct TreeNode *right = lca(root->right, first, second);
    if (left != NULL && right != NULL) return root;
    return left != NULL ? left : right;
}

int main(void)
{
    struct TreeNode *root = sample_tree();
    struct TreeNode *ancestor = lca(root, 4, 5);
    printf("LCA = %d\n", ancestor->data);
    free_tree(root);
    return 0;
}
