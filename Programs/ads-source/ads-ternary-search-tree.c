#include <stdio.h>
#include <stdlib.h>

struct Node { char value; int terminal; struct Node *left, *equal, *right; };
struct Node *insert_tst(struct Node *root, const char *word) { if (!root) { root = calloc(1, sizeof *root); if (!root) exit(EXIT_FAILURE); root->value = *word; } if (*word < root->value) root->left = insert_tst(root->left, word); else if (*word > root->value) root->right = insert_tst(root->right, word); else if (word[1]) root->equal = insert_tst(root->equal, word + 1); else root->terminal = 1; return root; }
int search_tst(struct Node *root, const char *word) { while (root) { if (*word < root->value) root = root->left; else if (*word > root->value) root = root->right; else { if (!word[1]) return root->terminal; word++; root = root->equal; } } return 0; }
void free_tst(struct Node *root) { if (root) { free_tst(root->left); free_tst(root->equal); free_tst(root->right); free(root); } }

int main(void)
{
    const char *words[] = {"cat", "cats", "up", "bug"}; struct Node *root = NULL;
    for (int i = 0; i < 4; i++) root = insert_tst(root, words[i]);
    printf("cats = %s cap = %s\n", search_tst(root, "cats") ? "Found" : "Missing", search_tst(root, "cap") ? "Found" : "Missing"); free_tst(root); return 0;
}
