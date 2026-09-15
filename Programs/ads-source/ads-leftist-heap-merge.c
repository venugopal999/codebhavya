#include <stdio.h>
#include <stdlib.h>

struct Node{int key,npl;struct Node*left,*right;};int rank_node(struct Node*n){return n?n->npl:-1;}struct Node*new_node(int key){struct Node*n=calloc(1,sizeof*n);if(!n)exit(EXIT_FAILURE);n->key=key;return n;}struct Node*merge(struct Node*a,struct Node*b){if(!a)return b;if(!b)return a;if(a->key>b->key){struct Node*t=a;a=b;b=t;}a->right=merge(a->right,b);if(rank_node(a->left)<rank_node(a->right)){struct Node*t=a->left;a->left=a->right;a->right=t;}a->npl=rank_node(a->right)+1;return a;}

int main(void)
{
    struct Node *first=NULL,*second=NULL; int a[]={10,30,50},b[]={5,20,40};
    for(int i=0;i<3;i++){first=merge(first,new_node(a[i]));}
    for(int i=0;i<3;i++){second=merge(second,new_node(b[i]));}
    struct Node *root=merge(first,second); while(root){printf("%d%c",root->key,root->left||root->right?' ':'\n');struct Node *old=root;root=merge(root->left,root->right);free(old);}return 0;
}
