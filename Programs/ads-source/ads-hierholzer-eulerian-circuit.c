#include <stdio.h>

int main(void)
{
    int graph[5][5]={{0,1,1,0,0},{1,0,1,0,0},{1,1,0,1,1},{0,0,1,0,1},{0,0,1,1,0}},stack[20],circuit[20],top=0,count=0;stack[top++]=0;
    while(top){int node=stack[top-1],next=-1;for(int i=0;i<5;i++)if(graph[node][i]){next=i;break;}if(next>=0){graph[node][next]=graph[next][node]=0;stack[top++]=next;}else circuit[count++]=stack[--top];}
    for(int i=count-1;i>=0;i--){printf("%d%c",circuit[i],i?' ':'\n');}
    return 0;
}
