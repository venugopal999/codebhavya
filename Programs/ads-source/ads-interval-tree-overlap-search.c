#include <stdio.h>
#include <stdlib.h>

struct Node { int low, high, maximum; struct Node *left, *right; };
struct Node *insert_interval(struct Node *root, int low, int high) { if (!root) { root = malloc(sizeof *root); if (!root) exit(EXIT_FAILURE); root->low = low; root->high = root->maximum = high; root->left = root->right = NULL; return root; } if (low < root->low) root->left = insert_interval(root->left, low, high); else root->right = insert_interval(root->right, low, high); if (high > root->maximum) root->maximum = high; return root; }
struct Node *overlap(struct Node *root, int low, int high) { while (root && (root->high < low || high < root->low)) { if (root->left && root->left->maximum >= low) root = root->left; else root = root->right; } return root; }
void free_intervals(struct Node *root) { if (root) { free_intervals(root->left); free_intervals(root->right); free(root); } }

int main(void)
{
    int intervals[][2] = {{15,20},{10,30},{17,19},{5,20},{12,15},{30,40}}; struct Node *root = NULL;
    for (int i = 0; i < 6; i++) root = insert_interval(root, intervals[i][0], intervals[i][1]);
    struct Node *match = overlap(root, 6, 7); printf("Overlap = [%d,%d]\n", match->low, match->high); free_intervals(root); return 0;
}
