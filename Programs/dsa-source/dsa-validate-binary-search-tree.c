#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

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
struct TreeNode *bst_insert(struct TreeNode *root, int value)
{
    if (root == NULL) return new_node(value);
    if (value < root->data) root->left = bst_insert(root->left, value);
    else if (value > root->data) root->right = bst_insert(root->right, value);
    return root;
}
void inorder(struct TreeNode *root)
{
    if (root == NULL) return;
    inorder(root->left); printf("%d ", root->data); inorder(root->right);
}
int valid_bst(struct TreeNode *root, long long minimum, long long maximum)
{
    if (root == NULL) return 1;
    if (root->data <= minimum || root->data >= maximum) return 0;
    return valid_bst(root->left, minimum, root->data) &&
           valid_bst(root->right, root->data, maximum);
}

int main(void)
{
    struct TreeNode *root = NULL;
    int values[] = {50, 30, 70, 20, 40, 60, 80};
    for (int index = 0; index < 7; index++) root = bst_insert(root, values[index]);
    puts(valid_bst(root, LLONG_MIN, LLONG_MAX) ? "Valid BST." : "Invalid BST.");
    free_tree(root);
    return 0;
}
