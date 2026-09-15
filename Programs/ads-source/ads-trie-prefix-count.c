#include <stdio.h>
#include <stdlib.h>

struct Trie { struct Trie *child[26]; int terminal, pass; };
struct Trie *new_trie(void) { struct Trie *node = calloc(1, sizeof *node); if (!node) exit(EXIT_FAILURE); return node; }
void insert_word(struct Trie *root, const char *word) { for (int i = 0; word[i]; i++) { int index = word[i] - 'a'; if (!root->child[index]) root->child[index] = new_trie(); root = root->child[index]; root->pass++; } root->terminal = 1; }
struct Trie *walk(struct Trie *root, const char *word) { for (int i = 0; word[i] && root; i++) root = root->child[word[i] - 'a']; return root; }
void free_trie(struct Trie *root) { if (root) { for (int i = 0; i < 26; i++) free_trie(root->child[i]); free(root); } }

int main(void)
{
    const char *words[] = {"app", "apple", "apply", "apt", "bat"}; struct Trie *root = new_trie();
    for (int i = 0; i < 5; i++) { insert_word(root, words[i]); }
    struct Trie *prefix = walk(root, "ap");
    printf("Words with ap = %d\n", prefix ? prefix->pass : 0); free_trie(root); return 0;
}
