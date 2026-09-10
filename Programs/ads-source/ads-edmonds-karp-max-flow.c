#include <stdio.h>

int max_flow(int capacity[6][6],int source,int sink){int flow=0,parent[6],queue[6];for(;;){for(int i=0;i<6;i++)parent[i]=-1;int front=0,back=0;queue[back++]=source;parent[source]=source;while(front<back&&parent[sink]<0){int node=queue[front++];for(int next=0;next<6;next++)if(parent[next]<0&&capacity[node][next]>0){parent[next]=node;queue[back++]=next;}}if(parent[sink]<0)break;int add=1000000;for(int v=sink;v!=source;v=parent[v])if(capacity[parent[v]][v]<add)add=capacity[parent[v]][v];for(int v=sink;v!=source;v=parent[v]){capacity[parent[v]][v]-=add;capacity[v][parent[v]]+=add;}flow+=add;}return flow;}

int main(void)
{
    int capacity[6][6]={{0,16,13,0,0,0},{0,0,10,12,0,0},{0,4,0,0,14,0},{0,0,9,0,0,20},{0,0,0,7,0,4},{0,0,0,0,0,0}};printf("Maximum flow = %d\n",max_flow(capacity,0,5));return 0;
}
