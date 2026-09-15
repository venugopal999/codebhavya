#include <stdio.h>

void build(const int a[],int t[],int node,int left,int right){if(left==right){t[node]=a[left];return;}int middle=(left+right)/2;build(a,t,node*2,left,middle);build(a,t,node*2+1,middle+1,right);t[node]=t[node*2]+t[node*2+1];}int query(const int t[],int node,int left,int right,int ql,int qr){if(qr<left||right<ql)return 0;if(ql<=left&&right<=qr)return t[node];int middle=(left+right)/2;return query(t,node*2,left,middle,ql,qr)+query(t,node*2+1,middle+1,right,ql,qr);}

int main(void)
{
    int values[]={1,3,5,7,9,11},tree[24]={0};build(values,tree,1,0,5);printf("Sum[1,3] = %d\n",query(tree,1,0,5,1,3));return 0;
}
