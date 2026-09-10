"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 15 — Digital Search Trees";
const trie = `struct Trie { struct Trie *child[26]; int terminal, pass; };
struct Trie *new_trie(void) { struct Trie *node = calloc(1, sizeof *node); if (!node) exit(EXIT_FAILURE); return node; }
void insert_word(struct Trie *root, const char *word) { for (int i = 0; word[i]; i++) { int index = word[i] - 'a'; if (!root->child[index]) root->child[index] = new_trie(); root = root->child[index]; root->pass++; } root->terminal = 1; }
struct Trie *walk(struct Trie *root, const char *word) { for (int i = 0; word[i] && root; i++) root = root->child[word[i] - 'a']; return root; }
void free_trie(struct Trie *root) { if (root) { for (int i = 0; i < 26; i++) free_trie(root->child[i]); free(root); } }`;

function program(options) {
  return makeAds({ topic, concepts: ["Trie", "Digital search"], difficulty: "Advanced", ...options });
}

module.exports = [
  program({
    slug: "ads-trie-insert-search",
    title: "Insert and Search Words in a Trie",
    source: cMain(`    struct Trie *root = new_trie(); insert_word(root, "code"); insert_word(root, "coder");
    struct Trie *node = walk(root, "code"); printf("code = %s cod = %s\\n", node && node->terminal ? "Found" : "Missing", walk(root, "cod") && walk(root, "cod")->terminal ? "Found" : "Missing");
    free_trie(root); return 0;`, ["stdio.h", "stdlib.h"], trie),
    sampleOutput: "code = Found cod = Missing",
    time: "O(word length)",
    space: "O(total characters * alphabet)",
    method: "Follow one child per lowercase character and distinguish complete words from prefixes."
  }),
  program({
    slug: "ads-trie-prefix-count",
    title: "Count Words Sharing a Trie Prefix",
    source: cMain(`    const char *words[] = {"app", "apple", "apply", "apt", "bat"}; struct Trie *root = new_trie();
    for (int i = 0; i < 5; i++) { insert_word(root, words[i]); }
    struct Trie *prefix = walk(root, "ap");
    printf("Words with ap = %d\\n", prefix ? prefix->pass : 0); free_trie(root); return 0;`, ["stdio.h", "stdlib.h"], trie),
    sampleOutput: "Words with ap = 4",
    time: "O(prefix length)",
    space: "O(total characters * alphabet)",
    method: "Store how many inserted words pass through each trie node."
  }),
  program({
    slug: "ads-trie-word-deletion",
    title: "Delete a Word from a Trie",
    source: cMain(`    struct Trie *root = new_trie(); insert_word(root, "code"); insert_word(root, "coder");
    struct Trie *node = walk(root, "code"); if (node) node->terminal = 0;
    printf("code = %s coder = %s\\n", walk(root, "code") && walk(root, "code")->terminal ? "Found" : "Missing", walk(root, "coder") && walk(root, "coder")->terminal ? "Found" : "Missing");
    free_trie(root); return 0;`, ["stdio.h", "stdlib.h"], trie),
    sampleOutput: "code = Missing coder = Found",
    time: "O(word length)",
    space: "O(total characters * alphabet)",
    method: "Clear only the terminal marker so longer words sharing the prefix remain available."
  }),
  program({
    slug: "ads-trie-autocomplete",
    title: "Generate Autocomplete Suggestions from a Trie",
    source: cMain(`    const char *words[] = {"car", "card", "care", "cat", "dog"}; struct Trie *root = new_trie(); char buffer[30] = "ca";
    for (int i = 0; i < 5; i++) { insert_word(root, words[i]); }
    struct Trie *prefix = walk(root, buffer);
    print_words(prefix, buffer, 2); free_trie(root); return 0;`, ["stdio.h", "stdlib.h"], `${trie}
void print_words(struct Trie *root, char buffer[], int length) { if (!root) return; if (root->terminal) { buffer[length] = '\\0'; puts(buffer); } for (int i = 0; i < 26; i++) if (root->child[i]) { buffer[length] = (char) ('a' + i); print_words(root->child[i], buffer, length + 1); } }`),
    sampleOutput: "car\ncard\ncare\ncat",
    time: "O(prefix + output characters)",
    space: "O(total characters * alphabet)",
    method: "Reach the prefix node once, then traverse its descendants in alphabetical child order."
  }),
  program({
    slug: "ads-trie-longest-common-prefix",
    title: "Find the Longest Common Prefix with a Trie",
    source: cMain(`    const char *words[] = {"flower", "flow", "flight"}; struct Trie *root = new_trie();
    for (int i = 0; i < 3; i++) { insert_word(root, words[i]); }
    char prefix[30]; int length = 0;
    while (root && !root->terminal) { int child = -1, count = 0; for (int i = 0; i < 26; i++) if (root->child[i]) { child = i; count++; } if (count != 1) break; prefix[length++] = (char) ('a' + child); root = root->child[child]; }
    prefix[length] = '\\0'; printf("Prefix = %s\\n", prefix); return 0;`, ["stdio.h", "stdlib.h"], trie),
    sampleOutput: "Prefix = fl",
    time: "O(total characters)",
    space: "O(total characters * alphabet)",
    method: "Continue while the current trie node has exactly one child and is not a complete word."
  }),
  program({
    slug: "ads-trie-word-break",
    title: "Solve Word Break with a Trie",
    source: cMain(`    const char *text = "codebhavya"; struct Trie *root = new_trie(); insert_word(root, "code"); insert_word(root, "bhavya");
    int length = 10, possible[11] = {1};
    for (int start = 0; start < length; start++) if (possible[start]) { struct Trie *node = root; for (int end = start; end < length && node; end++) { node = node->child[text[end] - 'a']; if (node && node->terminal) possible[end + 1] = 1; } }
    printf("Segmentable = %s\\n", possible[length] ? "Yes" : "No"); free_trie(root); return 0;`, ["stdio.h", "stdlib.h"], trie),
    sampleOutput: "Segmentable = Yes",
    time: "O(n^2)",
    space: "O(dictionary + n)",
    method: "Start trie walks only from positions already reachable by valid dictionary words."
  }),
  program({
    slug: "ads-bitwise-trie-maximum-xor",
    title: "Find Maximum XOR with a Bitwise Trie",
    source: cMain(`    int values[] = {3, 10, 5, 25, 2, 8}; struct Node *root = new_node(); int best = 0;
    for (int i = 0; i < 6; i++) insert_number(root, values[i]);
    for (int i = 0; i < 6; i++) { int current = maximum_xor(root, values[i]); if (current > best) best = current; }
    printf("Maximum XOR = %d\\n", best); free_nodes(root); return 0;`, ["stdio.h", "stdlib.h"], `struct Node { struct Node *child[2]; };
struct Node *new_node(void) { struct Node *node = calloc(1, sizeof *node); if (!node) exit(EXIT_FAILURE); return node; }
void insert_number(struct Node *root, int value) { for (int bit = 30; bit >= 0; bit--) { int digit = (value >> bit) & 1; if (!root->child[digit]) root->child[digit] = new_node(); root = root->child[digit]; } }
int maximum_xor(struct Node *root, int value) { int answer = 0; for (int bit = 30; bit >= 0; bit--) { int digit = (value >> bit) & 1, wanted = digit ^ 1; if (root->child[wanted]) { answer |= 1 << bit; root = root->child[wanted]; } else root = root->child[digit]; } return answer; }
void free_nodes(struct Node *root) { if (root) { free_nodes(root->child[0]); free_nodes(root->child[1]); free(root); } }`),
    sampleOutput: "Maximum XOR = 28",
    time: "O(n * word bits)",
    space: "O(n * word bits)",
    method: "At each bit prefer the opposite branch because it contributes one to the XOR result."
  }),
  program({
    slug: "ads-ternary-search-tree",
    title: "Store and Search Words in a Ternary Search Tree",
    source: cMain(`    const char *words[] = {"cat", "cats", "up", "bug"}; struct Node *root = NULL;
    for (int i = 0; i < 4; i++) root = insert_tst(root, words[i]);
    printf("cats = %s cap = %s\\n", search_tst(root, "cats") ? "Found" : "Missing", search_tst(root, "cap") ? "Found" : "Missing"); free_tst(root); return 0;`, ["stdio.h", "stdlib.h"], `struct Node { char value; int terminal; struct Node *left, *equal, *right; };
struct Node *insert_tst(struct Node *root, const char *word) { if (!root) { root = calloc(1, sizeof *root); if (!root) exit(EXIT_FAILURE); root->value = *word; } if (*word < root->value) root->left = insert_tst(root->left, word); else if (*word > root->value) root->right = insert_tst(root->right, word); else if (word[1]) root->equal = insert_tst(root->equal, word + 1); else root->terminal = 1; return root; }
int search_tst(struct Node *root, const char *word) { while (root) { if (*word < root->value) root = root->left; else if (*word > root->value) root = root->right; else { if (!word[1]) return root->terminal; word++; root = root->equal; } } return 0; }
void free_tst(struct Node *root) { if (root) { free_tst(root->left); free_tst(root->equal); free_tst(root->right); free(root); } }`),
    sampleOutput: "cats = Found cap = Missing",
    time: "O(word length + tree height)",
    space: "O(total characters)",
    method: "Use left/right character comparisons and an equal link to advance through a word."
  })
];
