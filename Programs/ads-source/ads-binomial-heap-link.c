#include <stdio.h>
#include <stddef.h>

struct Node { int key, degree; struct Node *child, *sibling; };
struct Node *link_trees(struct Node *first, struct Node *second) { if (first->key > second->key) { struct Node *t=first; first=second; second=t; } second->sibling=first->child; first->child=second; first->degree++; return first; }

int main(void)
{
    struct Node first={10,0,NULL,NULL}, second={20,0,NULL,NULL};
    struct Node *root = link_trees(&first, &second);
    printf("Root = %d Degree = %d Child = %d\n", root->key, root->degree, root->child->key); return 0;
}
