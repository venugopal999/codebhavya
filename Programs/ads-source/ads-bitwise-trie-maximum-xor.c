#include <stdio.h>
#include <stdlib.h>

struct Node { struct Node *child[2]; };
struct Node *new_node(void) { struct Node *node = calloc(1, sizeof *node); if (!node) exit(EXIT_FAILURE); return node; }
void insert_number(struct Node *root, int value) { for (int bit = 30; bit >= 0; bit--) { int digit = (value >> bit) & 1; if (!root->child[digit]) root->child[digit] = new_node(); root = root->child[digit]; } }
int maximum_xor(struct Node *root, int value) { int answer = 0; for (int bit = 30; bit >= 0; bit--) { int digit = (value >> bit) & 1, wanted = digit ^ 1; if (root->child[wanted]) { answer |= 1 << bit; root = root->child[wanted]; } else root = root->child[digit]; } return answer; }
void free_nodes(struct Node *root) { if (root) { free_nodes(root->child[0]); free_nodes(root->child[1]); free(root); } }

int main(void)
{
    int values[] = {3, 10, 5, 25, 2, 8}; struct Node *root = new_node(); int best = 0;
    for (int i = 0; i < 6; i++) insert_number(root, values[i]);
    for (int i = 0; i < 6; i++) { int current = maximum_xor(root, values[i]); if (current > best) best = current; }
    printf("Maximum XOR = %d\n", best); free_nodes(root); return 0;
}
