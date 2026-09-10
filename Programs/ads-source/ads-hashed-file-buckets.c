#include <stdio.h>

int main(void)
{
    int buckets[5][4]={{0}},count[5]={0},keys[]={12,7,22,19,17};for(int i=0;i<5;i++){int b=keys[i]%5;buckets[b][count[b]++]=keys[i];}for(int b=0;b<5;b++)if(count[b]){printf("B%d:",b);for(int i=0;i<count[b];i++)printf(" %d",buckets[b][i]);putchar('\n');}return 0;
}
