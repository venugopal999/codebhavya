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
struct TreeNode *bst_delete(struct TreeNode *root, int key)
{
    if (root == NULL) return NULL;
    if (key < root->data) root->left = bst_delete(root->left, key);
    else if (key > root->data) root->right = bst_delete(root->right, key);
    else {
        if (root->left == NULL) { struct TreeNode *right = root->right; free(root); return right; }
        if (root->right == NULL) { struct TreeNode *left = root->left; free(root); return left; }
        struct TreeNode *successor = root->right;
        while (successor->left != NULL) successor = successor->left;
        root->data = successor->data;
        root->right = bst_delete(root->right, successor->data);
    }
    return root;
}

int main(void)
{
    int values[] = {50, 30, 70, 20, 40, 60, 80};
    struct TreeNode *root = NULL;
    for (int index = 0; index < 7; index++) root = bst_insert(root, values[index]);
    root = bst_delete(root, 50);
    inorder(root); putchar('\n');
    free_tree(root);
    return 0;
}
