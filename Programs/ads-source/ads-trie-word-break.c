#include <stdio.h>
#include <stdlib.h>

struct Trie { struct Trie *child[26]; int terminal, pass; };
struct Trie *new_trie(void) { struct Trie *node = calloc(1, sizeof *node); if (!node) exit(EXIT_FAILURE); return node; }
void insert_word(struct Trie *root, const char *word) { for (int i = 0; word[i]; i++) { int index = word[i] - 'a'; if (!root->child[index]) root->child[index] = new_trie(); root = root->child[index]; root->pass++; } root->terminal = 1; }
struct Trie *walk(struct Trie *root, const char *word) { for (int i = 0; word[i] && root; i++) root = root->child[word[i] - 'a']; return root; }
void free_trie(struct Trie *root) { if (root) { for (int i = 0; i < 26; i++) free_trie(root->child[i]); free(root); } }

int main(void)
{
    const char *text = "codebhavya"; struct Trie *root = new_trie(); insert_word(root, "code"); insert_word(root, "bhavya");
    int length = 10, possible[11] = {1};
    for (int start = 0; start < length; start++) if (possible[start]) { struct Trie *node = root; for (int end = start; end < length && node; end++) { node = node->child[text[end] - 'a']; if (node && node->terminal) possible[end + 1] = 1; } }
    printf("Segmentable = %s\n", possible[length] ? "Yes" : "No"); free_trie(root); return 0;
}
