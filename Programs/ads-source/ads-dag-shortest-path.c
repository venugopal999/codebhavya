#include <stdio.h>

int main(void)
{
    int weight[6][6]={{0,5,3,0,0,0},{0,0,2,6,0,0},{0,0,0,7,4,2},{0,0,0,0,-1,1},{0,0,0,0,0,-2},{0,0,0,0,0,0}},order[]={0,1,2,3,4,5},distance[]={0,99,99,99,99,99};
    for(int p=0;p<6;p++){int node=order[p];for(int next=0;next<6;next++)if(weight[node][next]&&distance[node]+weight[node][next]<distance[next])distance[next]=distance[node]+weight[node][next];}
    for(int i=0;i<6;i++){printf("%d%c",distance[i],i==5?'\n':' ');}
    return 0;
}
