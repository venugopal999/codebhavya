#include <stdio.h>
#include <stddef.h>

struct Leaf { int keys[3], count; struct Leaf *next; };

int main(void)
{
    struct Leaf third = {{40,50,60},3,NULL}, second = {{20,25,30},3,&third}, first = {{5,10,15},3,&second};
    int low = 12, high = 45; struct Leaf *leaf = &first; printf("Range:");
    while (leaf) { for (int i = 0; i < leaf->count; i++) if (leaf->keys[i] >= low && leaf->keys[i] <= high) printf(" %d", leaf->keys[i]); leaf = leaf->next; }
    putchar('\n'); return 0;
}
