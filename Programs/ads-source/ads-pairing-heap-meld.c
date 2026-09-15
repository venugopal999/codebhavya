#include <stdio.h>
#include <stdlib.h>

struct Node{int key;struct Node*child,*sibling;};struct Node*new_node(int key){struct Node*n=calloc(1,sizeof*n);if(!n)exit(EXIT_FAILURE);n->key=key;return n;}struct Node*meld(struct Node*a,struct Node*b){if(!a)return b;if(!b)return a;if(a->key>b->key){struct Node*t=a;a=b;b=t;}b->sibling=a->child;a->child=b;return a;}void free_heap(struct Node*n){if(n){free_heap(n->child);free_heap(n->sibling);free(n);}}

int main(void)
{
    int values[]={30,10,40,5,20};struct Node*root=NULL;for(int i=0;i<5;i++)root=meld(root,new_node(values[i]));printf("Minimum = %d\n",root->key);free_heap(root);return 0;
}
