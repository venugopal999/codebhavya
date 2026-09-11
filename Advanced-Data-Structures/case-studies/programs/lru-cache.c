#include <stdio.h>
#include <stdlib.h>

#define BUCKET_COUNT 23
#define MAX_CAPACITY 20

typedef struct CacheNode {
    int key;
    int value;
    struct CacheNode *previous;
    struct CacheNode *next;
    struct CacheNode *hashNext;
} CacheNode;

typedef struct {
    int capacity;
    int size;
    CacheNode *mostRecent;
    CacheNode *leastRecent;
    CacheNode *buckets[BUCKET_COUNT];
    unsigned long hits;
    unsigned long misses;
} LRUCache;

static unsigned int bucketIndex(int key) {
    unsigned int value = (unsigned int)key;
    value ^= value >> 16;
    value *= 0x7feb352dU;
    value ^= value >> 15;
    return value % BUCKET_COUNT;
}

static void initializeCache(LRUCache *cache, int capacity) {
    cache->capacity = capacity;
    cache->size = 0;
    cache->mostRecent = NULL;
    cache->leastRecent = NULL;
    cache->hits = 0;
    cache->misses = 0;
    for (int i = 0; i < BUCKET_COUNT; ++i) {
        cache->buckets[i] = NULL;
    }
}

static CacheNode *findNode(const LRUCache *cache, int key) {
    CacheNode *current = cache->buckets[bucketIndex(key)];
    while (current != NULL) {
        if (current->key == key) return current;
        current = current->hashNext;
    }
    return NULL;
}

static void detachFromRecency(LRUCache *cache, CacheNode *node) {
    if (node->previous != NULL) node->previous->next = node->next;
    else cache->mostRecent = node->next;

    if (node->next != NULL) node->next->previous = node->previous;
    else cache->leastRecent = node->previous;

    node->previous = NULL;
    node->next = NULL;
}

static void attachAsMostRecent(LRUCache *cache, CacheNode *node) {
    node->previous = NULL;
    node->next = cache->mostRecent;
    if (cache->mostRecent != NULL) cache->mostRecent->previous = node;
    else cache->leastRecent = node;
    cache->mostRecent = node;
}

static void markMostRecent(LRUCache *cache, CacheNode *node) {
    if (cache->mostRecent == node) return;
    detachFromRecency(cache, node);
    attachAsMostRecent(cache, node);
}

static void addToHashTable(LRUCache *cache, CacheNode *node) {
    unsigned int index = bucketIndex(node->key);
    node->hashNext = cache->buckets[index];
    cache->buckets[index] = node;
}

static void removeFromHashTable(LRUCache *cache, CacheNode *node) {
    unsigned int index = bucketIndex(node->key);
    CacheNode **current = &cache->buckets[index];
    while (*current != NULL && *current != node) {
        current = &(*current)->hashNext;
    }
    if (*current == node) *current = node->hashNext;
    node->hashNext = NULL;
}

static int getValue(LRUCache *cache, int key, int *value) {
    CacheNode *node = findNode(cache, key);
    if (node == NULL) {
        cache->misses++;
        return 0;
    }
    cache->hits++;
    *value = node->value;
    markMostRecent(cache, node);
    return 1;
}

static void evictLeastRecent(LRUCache *cache) {
    CacheNode *victim = cache->leastRecent;
    if (victim == NULL) return;

    printf("Cache full: evicting key %d (least recently used).\n", victim->key);
    detachFromRecency(cache, victim);
    removeFromHashTable(cache, victim);
    free(victim);
    cache->size--;
}

static int putValue(LRUCache *cache, int key, int value) {
    CacheNode *node = findNode(cache, key);
    if (node != NULL) {
        node->value = value;
        markMostRecent(cache, node);
        return 1;
    }

    if (cache->size == cache->capacity) evictLeastRecent(cache);

    node = malloc(sizeof(*node));
    if (node == NULL) return 0;
    node->key = key;
    node->value = value;
    node->previous = NULL;
    node->next = NULL;
    node->hashNext = NULL;
    addToHashTable(cache, node);
    attachAsMostRecent(cache, node);
    cache->size++;
    return 1;
}

static int removeKey(LRUCache *cache, int key) {
    CacheNode *node = findNode(cache, key);
    if (node == NULL) return 0;
    detachFromRecency(cache, node);
    removeFromHashTable(cache, node);
    free(node);
    cache->size--;
    return 1;
}

static void displayCache(const LRUCache *cache) {
    CacheNode *current = cache->mostRecent;
    printf("\nRecency order [MRU -> LRU] (%d/%d): ", cache->size, cache->capacity);
    if (current == NULL) {
        puts("empty");
        return;
    }
    while (current != NULL) {
        printf("[%d:%d]", current->key, current->value);
        if (current->next != NULL) printf(" <-> ");
        current = current->next;
    }
    putchar('\n');
}

static void displayStatistics(const LRUCache *cache) {
    unsigned long requests = cache->hits + cache->misses;
    double hitRate = requests == 0 ? 0.0 : (100.0 * cache->hits / requests);
    printf("Hits: %lu | Misses: %lu | Hit rate: %.1f%%\n",
           cache->hits, cache->misses, hitRate);
}

static void clearCache(LRUCache *cache) {
    CacheNode *current = cache->mostRecent;
    while (current != NULL) {
        CacheNode *next = current->next;
        free(current);
        current = next;
    }
    initializeCache(cache, cache->capacity);
}

static int readInteger(const char *prompt, int *value) {
    char line[80];
    char extra;
    printf("%s", prompt);
    if (fgets(line, sizeof(line), stdin) == NULL) return 0;
    return sscanf(line, " %d %c", value, &extra) == 1;
}

int main(void) {
    LRUCache cache;
    int capacity;

    puts("CodeBhavya LRU Cache Simulator");
    if (!readInteger("Enter cache capacity (1-20): ", &capacity) ||
        capacity < 1 || capacity > MAX_CAPACITY) {
        puts("Capacity must be between 1 and 20.");
        return 1;
    }
    initializeCache(&cache, capacity);

    for (;;) {
        int choice, key, value;
        puts("\n1. Put key/value");
        puts("2. Get value");
        puts("3. Remove key");
        puts("4. Display cache");
        puts("5. Display statistics");
        puts("6. Exit");
        if (!readInteger("Choose: ", &choice)) {
            puts("Enter a valid menu number.");
            continue;
        }

        if (choice == 1) {
            if (!readInteger("Key: ", &key) || !readInteger("Value: ", &value)) {
                puts("Key and value must be integers.");
            } else if (!putValue(&cache, key, value)) {
                puts("Unable to allocate a cache entry.");
            } else {
                puts("Cache entry stored and marked most recent.");
                displayCache(&cache);
            }
        } else if (choice == 2) {
            if (!readInteger("Key: ", &key)) {
                puts("Key must be an integer.");
            } else if (getValue(&cache, key, &value)) {
                printf("Cache hit: key %d has value %d.\n", key, value);
                displayCache(&cache);
            } else {
                printf("Cache miss: key %d is not stored.\n", key);
            }
        } else if (choice == 3) {
            if (!readInteger("Key: ", &key)) puts("Key must be an integer.");
            else puts(removeKey(&cache, key) ? "Key removed." : "Key not found.");
        } else if (choice == 4) {
            displayCache(&cache);
        } else if (choice == 5) {
            displayStatistics(&cache);
        } else if (choice == 6) {
            clearCache(&cache);
            puts("Cache memory released.");
            break;
        } else {
            puts("Choose a number from 1 to 6.");
        }
    }
    return 0;
}
