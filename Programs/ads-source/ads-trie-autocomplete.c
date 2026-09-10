#include <stdio.h>
#include <stdlib.h>

struct Trie { struct Trie *child[26]; int terminal, pass; };
struct Trie *new_trie(void) { struct Trie *node = calloc(1, sizeof *node); if (!node) exit(EXIT_FAILURE); return node; }
void insert_word(struct Trie *root, const char *word) { for (int i = 0; word[i]; i++) { int index = word[i] - 'a'; if (!root->child[index]) root->child[index] = new_trie(); root = root->child[index]; root->pass++; } root->terminal = 1; }
struct Trie *walk(struct Trie *root, const char *word) { for (int i = 0; word[i] && root; i++) root = root->child[word[i] - 'a']; return root; }
void free_trie(struct Trie *root) { if (root) { for (int i = 0; i < 26; i++) free_trie(root->child[i]); free(root); } }
void print_words(struct Trie *root, char buffer[], int length) { if (!root) return; if (root->terminal) { buffer[length] = '\0'; puts(buffer); } for (int i = 0; i < 26; i++) if (root->child[i]) { buffer[length] = (char) ('a' + i); print_words(root->child[i], buffer, length + 1); } }

int main(void)
{
    const char *words[] = {"car", "card", "care", "cat", "dog"}; struct Trie *root = new_trie(); char buffer[30] = "ca";
    for (int i = 0; i < 5; i++) { insert_word(root, words[i]); }
    struct Trie *prefix = walk(root, buffer);
    print_words(prefix, buffer, 2); free_trie(root); return 0;
}
