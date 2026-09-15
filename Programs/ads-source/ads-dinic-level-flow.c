#include <stdio.h>

struct Edge{int to,capacity,next;};void add(struct Edge e[],int head[],int*c,int from,int to,int cap){e[*c]=(struct Edge){to,cap,head[from]};head[from]=(*c)++;e[*c]=(struct Edge){from,0,head[to]};head[to]=(*c)++;}int send(struct Edge e[],int head[],int level[],int work[],int node,int sink,int flow){if(node==sink)return flow;for(int*i=&work[node];*i>=0;*i=e[*i].next){int id=*i;if(e[id].capacity&&level[e[id].to]==level[node]+1){int pushed=send(e,head,level,work,e[id].to,sink,flow<e[id].capacity?flow:e[id].capacity);if(pushed){e[id].capacity-=pushed;e[id^1].capacity+=pushed;return pushed;}}}return 0;}int dinic(struct Edge e[],int head[],int count,int source,int sink){(void)count;int total=0;for(;;){int level[6],q[6],f=0,b=0;for(int i=0;i<6;i++)level[i]=-1;level[source]=0;q[b++]=source;while(f<b){int n=q[f++];for(int id=head[n];id>=0;id=e[id].next)if(e[id].capacity&&level[e[id].to]<0){level[e[id].to]=level[n]+1;q[b++]=e[id].to;}}if(level[sink]<0)return total;int work[6];for(int i=0;i<6;i++)work[i]=head[i];int pushed;while((pushed=send(e,head,level,work,source,sink,1000000))>0)total+=pushed;}}

int main(void)
{
    struct Edge edges[40];int head[6],count=0;for(int i=0;i<6;i++)head[i]=-1;add(edges,head,&count,0,1,10);add(edges,head,&count,0,2,10);add(edges,head,&count,1,3,4);add(edges,head,&count,1,4,8);add(edges,head,&count,1,2,2);add(edges,head,&count,2,4,9);add(edges,head,&count,4,3,6);add(edges,head,&count,3,5,10);add(edges,head,&count,4,5,10);printf("Maximum flow = %d\n",dinic(edges,head,count,0,5));return 0;
}
