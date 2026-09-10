#include <stdio.h>

int main(void)
{
    int graph[5][5]={{0,0,-1,-1,1},{0,0,1,-1,-1},{-1,1,0,0,-1},{-1,-1,0,0,1},{1,-1,-1,1,0}};
    int distance[5]={0,99,99,99,99},deque[20],front=10,back=10;deque[back++]=0;
    while(front<back){int node=deque[front++];for(int next=0;next<5;next++)if(graph[node][next]>=0&&node!=next){int weight=graph[node][next];if(distance[node]+weight<distance[next]){distance[next]=distance[node]+weight;if(weight==0)deque[--front]=next;else deque[back++]=next;}}}
    for(int i=0;i<5;i++){printf("%d%c",distance[i],i==4?'\n':' ');}
    return 0;
}
