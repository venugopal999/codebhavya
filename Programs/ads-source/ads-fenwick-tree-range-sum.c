#include <stdio.h>

void update(int tree[],int count,int index,int delta){for(;index<=count;index+=index&-index)tree[index]+=delta;}int query(const int tree[],int index){int sum=0;for(;index>0;index-=index&-index)sum+=tree[index];return sum;}

int main(void)
{
    int values[]={1,2,3,4,5,6},tree[7]={0};for(int i=0;i<6;i++)update(tree,6,i+1,values[i]);printf("Sum[1,4] = %d\n",query(tree,5)-query(tree,1));return 0;
}
