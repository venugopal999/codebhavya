#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define ALPHABET_SIZE 26
#define WORD_LENGTH 48
#define MAX_SUGGESTIONS 128
#define TOP_LIMIT 5

typedef struct TrieNode {
    struct TrieNode *child[ALPHABET_SIZE];
    int isWord;
    int frequency;
} TrieNode;

typedef struct {
    char word[WORD_LENGTH];
    int frequency;
} Suggestion;

static TrieNode *createNode(void) {
    TrieNode *node = calloc(1, sizeof(*node));
    if (node == NULL) {
        fprintf(stderr, "Unable to allocate trie node.\n");
        exit(EXIT_FAILURE);
    }
    return node;
}

static int normalizeWord(const char *source, char *destination) {
    size_t writeIndex = 0;

    for (size_t i = 0; source[i] != '\0' && source[i] != '\n'; ++i) {
        unsigned char character = (unsigned char) source[i];
        if (!isalpha(character)) {
            return 0;
        }
        if (writeIndex + 1 >= WORD_LENGTH) {
            return 0;
        }
        destination[writeIndex++] = (char) tolower(character);
    }

    destination[writeIndex] = '\0';
    return writeIndex > 0;
}

static void insertOrRecordSelection(TrieNode *root, const char *word, int increase) {
    TrieNode *current = root;

    for (size_t i = 0; word[i] != '\0'; ++i) {
        int position = word[i] - 'a';
        if (current->child[position] == NULL) {
            current->child[position] = createNode();
        }
        current = current->child[position];
    }

    current->isWord = 1;
    current->frequency += increase;
}

static TrieNode *findPrefixNode(TrieNode *root, const char *prefix) {
    TrieNode *current = root;

    for (size_t i = 0; prefix[i] != '\0'; ++i) {
        int position = prefix[i] - 'a';
        if (current->child[position] == NULL) {
            return NULL;
        }
        current = current->child[position];
    }
    return current;
}

static int containsWord(TrieNode *root, const char *word) {
    TrieNode *node = findPrefixNode(root, word);
    return node != NULL && node->isWord;
}

static void collectSuggestions(const TrieNode *node, char *buffer, size_t depth,
                               Suggestion results[], int *count) {
    if (node == NULL || *count >= MAX_SUGGESTIONS) {
        return;
    }

    if (node->isWord) {
        buffer[depth] = '\0';
        snprintf(results[*count].word, WORD_LENGTH, "%s", buffer);
        results[*count].frequency = node->frequency;
        ++(*count);
    }

    for (int i = 0; i < ALPHABET_SIZE && *count < MAX_SUGGESTIONS; ++i) {
        if (node->child[i] != NULL && depth + 1 < WORD_LENGTH) {
            buffer[depth] = (char) ('a' + i);
            collectSuggestions(node->child[i], buffer, depth + 1, results, count);
        }
    }
}

static int compareSuggestions(const void *left, const void *right) {
    const Suggestion *a = left;
    const Suggestion *b = right;

    if (a->frequency != b->frequency) {
        return b->frequency - a->frequency;
    }
    return strcmp(a->word, b->word);
}

static void showAutocomplete(TrieNode *root, const char *prefix) {
    TrieNode *prefixNode = findPrefixNode(root, prefix);
    Suggestion results[MAX_SUGGESTIONS];
    char buffer[WORD_LENGTH];
    int count = 0;

    if (prefixNode == NULL) {
        printf("No stored term begins with \"%s\".\n", prefix);
        return;
    }

    snprintf(buffer, sizeof(buffer), "%s", prefix);
    collectSuggestions(prefixNode, buffer, strlen(prefix), results, &count);
    qsort(results, (size_t) count, sizeof(results[0]), compareSuggestions);

    printf("\nBest suggestions for \"%s\":\n", prefix);
    int shown = count < TOP_LIMIT ? count : TOP_LIMIT;
    for (int i = 0; i < shown; ++i) {
        printf("%d. %-20s score: %d\n", i + 1, results[i].word,
               results[i].frequency);
    }
}

static int hasChildren(const TrieNode *node) {
    for (int i = 0; i < ALPHABET_SIZE; ++i) {
        if (node->child[i] != NULL) {
            return 1;
        }
    }
    return 0;
}

static int removeWordRecursive(TrieNode *node, const char *word, size_t depth,
                               int *removed) {
    if (word[depth] == '\0') {
        if (!node->isWord) {
            return 0;
        }
        node->isWord = 0;
        node->frequency = 0;
        *removed = 1;
        return !hasChildren(node);
    }

    int position = word[depth] - 'a';
    TrieNode *next = node->child[position];
    if (next == NULL) {
        return 0;
    }

    if (removeWordRecursive(next, word, depth + 1, removed)) {
        free(next);
        node->child[position] = NULL;
    }

    return !node->isWord && !hasChildren(node);
}

static void freeTrie(TrieNode *node) {
    if (node == NULL) {
        return;
    }
    for (int i = 0; i < ALPHABET_SIZE; ++i) {
        freeTrie(node->child[i]);
    }
    free(node);
}

static int readLine(const char *prompt, char *buffer, size_t capacity) {
    printf("%s", prompt);
    return fgets(buffer, (int) capacity, stdin) != NULL;
}

static void loadSampleTerms(TrieNode *root) {
    const Suggestion samples[] = {
        {"algorithm", 18}, {"algebra", 9}, {"array", 14},
        {"graph", 22}, {"greedy", 11}, {"heap", 15},
        {"hashing", 19}, {"trie", 17}, {"tree", 13}
    };
    size_t count = sizeof(samples) / sizeof(samples[0]);
    for (size_t i = 0; i < count; ++i) {
        insertOrRecordSelection(root, samples[i].word, samples[i].frequency);
    }
}

int main(void) {
    TrieNode *root = createNode();
    char input[WORD_LENGTH];
    char normalized[WORD_LENGTH];
    char choiceText[16];
    int running = 1;

    loadSampleTerms(root);
    puts("CodeBhavya Smart Search Autocomplete");

    while (running) {
        puts("\n1. Add a search term");
        puts("2. Show autocomplete suggestions");
        puts("3. Record a selected suggestion");
        puts("4. Remove a search term");
        puts("5. Exit");

        if (!readLine("Choose: ", choiceText, sizeof(choiceText))) {
            break;
        }

        switch ((int) strtol(choiceText, NULL, 10)) {
            case 1:
                if (readLine("New term: ", input, sizeof(input)) &&
                    normalizeWord(input, normalized)) {
                    insertOrRecordSelection(root, normalized, 1);
                    printf("Stored \"%s\".\n", normalized);
                } else {
                    puts("Use letters only and keep the term under 48 characters.");
                }
                break;
            case 2:
                if (readLine("Prefix: ", input, sizeof(input)) &&
                    normalizeWord(input, normalized)) {
                    showAutocomplete(root, normalized);
                } else {
                    puts("Enter a valid alphabetic prefix.");
                }
                break;
            case 3:
                if (readLine("Selected word: ", input, sizeof(input)) &&
                    normalizeWord(input, normalized) &&
                    containsWord(root, normalized)) {
                    insertOrRecordSelection(root, normalized, 1);
                    printf("Popularity score for \"%s\" increased.\n", normalized);
                } else {
                    puts("That word is not available in the search dictionary.");
                }
                break;
            case 4: {
                int removed = 0;
                if (readLine("Word to remove: ", input, sizeof(input)) &&
                    normalizeWord(input, normalized)) {
                    removeWordRecursive(root, normalized, 0, &removed);
                }
                puts(removed ? "Term removed; unused nodes were pruned."
                             : "Exact term not found.");
                break;
            }
            case 5:
                running = 0;
                break;
            default:
                puts("Choose a number from 1 to 5.");
        }
    }

    freeTrie(root);
    puts("Autocomplete dictionary released safely.");
    return 0;
}
