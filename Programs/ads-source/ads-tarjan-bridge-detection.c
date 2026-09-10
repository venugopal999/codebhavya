#include <stdio.h>

void dfs(int node,int parent,int graph[5][5],int visited[],int tin[],int low[],int*timer){visited[node]=1;tin[node]=low[node]=(*timer)++;for(int next=0;next<5;next++)if(graph[node][next]){if(next==parent)continue;if(visited[next]){if(tin[next]<low[node])low[node]=tin[next];}else{dfs(next,node,graph,visited,tin,low,timer);if(low[next]<low[node])low[node]=low[next];if(low[next]>tin[node])printf("Bridge = %d-%d\n",node,next);}}}

int main(void)
{
    int graph[5][5]={{0,1,1,0,0},{1,0,1,1,0},{1,1,0,0,0},{0,1,0,0,1},{0,0,0,1,0}},visited[5]={0},tin[5],low[5],timer=0;dfs(0,-1,graph,visited,tin,low,&timer);return 0;
}
