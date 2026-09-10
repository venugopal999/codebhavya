#include <stdio.h>

void push(int tree[],int lazy[],int node,int left,int right){if(lazy[node]){tree[node]+=(right-left+1)*lazy[node];if(left!=right){lazy[node*2]+=lazy[node];lazy[node*2+1]+=lazy[node];}lazy[node]=0;}}void update(int tree[],int lazy[],int node,int left,int right,int ql,int qr,int value){push(tree,lazy,node,left,right);if(qr<left||right<ql)return;if(ql<=left&&right<=qr){lazy[node]+=value;push(tree,lazy,node,left,right);return;}int middle=(left+right)/2;update(tree,lazy,node*2,left,middle,ql,qr,value);update(tree,lazy,node*2+1,middle+1,right,ql,qr,value);tree[node]=tree[node*2]+tree[node*2+1];}int query(int tree[],int lazy[],int node,int left,int right,int index){push(tree,lazy,node,left,right);if(left==right)return tree[node];int middle=(left+right)/2;return index<=middle?query(tree,lazy,node*2,left,middle,index):query(tree,lazy,node*2+1,middle+1,right,index);}

int main(void)
{
    int tree[40]={0},lazy[40]={0};update(tree,lazy,1,0,4,1,3,5);update(tree,lazy,1,0,4,2,4,2);printf("Point 2 = %d Point 4 = %d\n",query(tree,lazy,1,0,4,2),query(tree,lazy,1,0,4,4));return 0;
}
