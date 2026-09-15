"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 20 — Advanced Graph Algorithms";

function program(options) {
  return makeAds({ topic, concepts: ["Advanced graphs", "Graph optimization"], difficulty: "Advanced", space: "O(V + E)", ...options });
}

module.exports = [
  program({
    slug: "ads-zero-one-bfs",
    title: "Find Shortest Paths with 0–1 BFS",
    source: cMain(`    int graph[5][5]={{0,0,-1,-1,1},{0,0,1,-1,-1},{-1,1,0,0,-1},{-1,-1,0,0,1},{1,-1,-1,1,0}};
    int distance[5]={0,99,99,99,99},deque[20],front=10,back=10;deque[back++]=0;
    while(front<back){int node=deque[front++];for(int next=0;next<5;next++)if(graph[node][next]>=0&&node!=next){int weight=graph[node][next];if(distance[node]+weight<distance[next]){distance[next]=distance[node]+weight;if(weight==0)deque[--front]=next;else deque[back++]=next;}}}
    for(int i=0;i<5;i++){printf("%d%c",distance[i],i==4?'\\n':' ');}
    return 0;`),
    sampleOutput: "0 0 1 1 1",
    time: "O(V + E)",
    method: "Push zero-weight relaxations to the deque front and one-weight relaxations to its back."
  }),
  program({
    slug: "ads-dag-shortest-path",
    title: "Find Shortest Paths in a Weighted DAG",
    source: cMain(`    int weight[6][6]={{0,5,3,0,0,0},{0,0,2,6,0,0},{0,0,0,7,4,2},{0,0,0,0,-1,1},{0,0,0,0,0,-2},{0,0,0,0,0,0}},order[]={0,1,2,3,4,5},distance[]={0,99,99,99,99,99};
    for(int p=0;p<6;p++){int node=order[p];for(int next=0;next<6;next++)if(weight[node][next]&&distance[node]+weight[node][next]<distance[next])distance[next]=distance[node]+weight[node][next];}
    for(int i=0;i<6;i++){printf("%d%c",distance[i],i==5?'\\n':' ');}
    return 0;`),
    sampleOutput: "0 5 3 10 7 5",
    time: "O(V + E)",
    method: "Relax outgoing edges once in topological order, which works even with negative weights in a DAG."
  }),
  program({
    slug: "ads-johnson-reweighting",
    title: "Reweight Edges for Johnson's Algorithm",
    source: cMain(`    int edges[][3]={{0,1,-2},{0,2,4},{1,2,3},{1,3,2},{2,3,-1}},potential[]={0,-2,0,-1};
    for(int i=0;i<5;i++){int from=edges[i][0],to=edges[i][1],weight=edges[i][2]+potential[from]-potential[to];printf("%d-%d:%d%c",from,to,weight,i==4?'\\n':' ');}return 0;`),
    sampleOutput: "0-1:0 0-2:4 1-2:1 1-3:1 2-3:0",
    time: "O(VE + V(E log V)) for complete Johnson",
    space: "O(V + E)",
    method: "Use Bellman–Ford potentials to make every reweighted edge non-negative before repeated Dijkstra searches."
  }),
  program({
    slug: "ads-edmonds-karp-max-flow",
    title: "Compute Maximum Flow with Edmonds–Karp",
    source: cMain(`    int capacity[6][6]={{0,16,13,0,0,0},{0,0,10,12,0,0},{0,4,0,0,14,0},{0,0,9,0,0,20},{0,0,0,7,0,4},{0,0,0,0,0,0}};printf("Maximum flow = %d\\n",max_flow(capacity,0,5));return 0;`, ["stdio.h"], `int max_flow(int capacity[6][6],int source,int sink){int flow=0,parent[6],queue[6];for(;;){for(int i=0;i<6;i++)parent[i]=-1;int front=0,back=0;queue[back++]=source;parent[source]=source;while(front<back&&parent[sink]<0){int node=queue[front++];for(int next=0;next<6;next++)if(parent[next]<0&&capacity[node][next]>0){parent[next]=node;queue[back++]=next;}}if(parent[sink]<0)break;int add=1000000;for(int v=sink;v!=source;v=parent[v])if(capacity[parent[v]][v]<add)add=capacity[parent[v]][v];for(int v=sink;v!=source;v=parent[v]){capacity[parent[v]][v]-=add;capacity[v][parent[v]]+=add;}flow+=add;}return flow;}`),
    sampleOutput: "Maximum flow = 23",
    time: "O(VE^2)",
    method: "Use BFS to choose the shortest residual augmenting path until no path reaches the sink."
  }),
  program({
    slug: "ads-dinic-level-flow",
    title: "Compute Maximum Flow with Dinic's Algorithm",
    source: cMain(`    struct Edge edges[40];int head[6],count=0;for(int i=0;i<6;i++)head[i]=-1;add(edges,head,&count,0,1,10);add(edges,head,&count,0,2,10);add(edges,head,&count,1,3,4);add(edges,head,&count,1,4,8);add(edges,head,&count,1,2,2);add(edges,head,&count,2,4,9);add(edges,head,&count,4,3,6);add(edges,head,&count,3,5,10);add(edges,head,&count,4,5,10);printf("Maximum flow = %d\\n",dinic(edges,head,count,0,5));return 0;`, ["stdio.h"], `struct Edge{int to,capacity,next;};void add(struct Edge e[],int head[],int*c,int from,int to,int cap){e[*c]=(struct Edge){to,cap,head[from]};head[from]=(*c)++;e[*c]=(struct Edge){from,0,head[to]};head[to]=(*c)++;}int send(struct Edge e[],int head[],int level[],int work[],int node,int sink,int flow){if(node==sink)return flow;for(int*i=&work[node];*i>=0;*i=e[*i].next){int id=*i;if(e[id].capacity&&level[e[id].to]==level[node]+1){int pushed=send(e,head,level,work,e[id].to,sink,flow<e[id].capacity?flow:e[id].capacity);if(pushed){e[id].capacity-=pushed;e[id^1].capacity+=pushed;return pushed;}}}return 0;}int dinic(struct Edge e[],int head[],int count,int source,int sink){(void)count;int total=0;for(;;){int level[6],q[6],f=0,b=0;for(int i=0;i<6;i++)level[i]=-1;level[source]=0;q[b++]=source;while(f<b){int n=q[f++];for(int id=head[n];id>=0;id=e[id].next)if(e[id].capacity&&level[e[id].to]<0){level[e[id].to]=level[n]+1;q[b++]=e[id].to;}}if(level[sink]<0)return total;int work[6];for(int i=0;i<6;i++)work[i]=head[i];int pushed;while((pushed=send(e,head,level,work,source,sink,1000000))>0)total+=pushed;}}`),
    sampleOutput: "Maximum flow = 19",
    time: "O(V^2E)",
    method: "Build a residual level graph with BFS and send blocking flows along level-respecting edges."
  }),
  program({
    slug: "ads-bipartite-maximum-matching",
    title: "Find Maximum Bipartite Matching",
    source: cMain(`    int graph[4][4]={{1,1,0,0},{0,1,1,0},{0,0,1,1},{1,0,0,0}},matched[4]={-1,-1,-1,-1},answer=0;
    for(int left=0;left<4;left++){int seen[4]={0};answer+=augment(left,graph,seen,matched);}printf("Matching size = %d\\n",answer);return 0;`, ["stdio.h"], `int augment(int left,int graph[4][4],int seen[],int matched[]){for(int right=0;right<4;right++)if(graph[left][right]&&!seen[right]){seen[right]=1;if(matched[right]<0||augment(matched[right],graph,seen,matched)){matched[right]=left;return 1;}}return 0;}`),
    sampleOutput: "Matching size = 4",
    time: "O(VE)",
    method: "For every left vertex, search an augmenting path that can reroute earlier matches."
  }),
  program({
    slug: "ads-tarjan-bridge-detection",
    title: "Find Bridges with Tarjan Low-Link Values",
    source: cMain(`    int graph[5][5]={{0,1,1,0,0},{1,0,1,1,0},{1,1,0,0,0},{0,1,0,0,1},{0,0,0,1,0}},visited[5]={0},tin[5],low[5],timer=0;dfs(0,-1,graph,visited,tin,low,&timer);return 0;`, ["stdio.h"], `void dfs(int node,int parent,int graph[5][5],int visited[],int tin[],int low[],int*timer){visited[node]=1;tin[node]=low[node]=(*timer)++;for(int next=0;next<5;next++)if(graph[node][next]){if(next==parent)continue;if(visited[next]){if(tin[next]<low[node])low[node]=tin[next];}else{dfs(next,node,graph,visited,tin,low,timer);if(low[next]<low[node])low[node]=low[next];if(low[next]>tin[node])printf("Bridge = %d-%d\\n",node,next);}}}`),
    sampleOutput: "Bridge = 3-4\nBridge = 1-3",
    time: "O(V + E)",
    method: "An edge to a DFS child is a bridge when the child subtree cannot reach the parent's discovery time."
  }),
  program({
    slug: "ads-hierholzer-eulerian-circuit",
    title: "Construct an Eulerian Circuit with Hierholzer's Algorithm",
    source: cMain(`    int graph[5][5]={{0,1,1,0,0},{1,0,1,0,0},{1,1,0,1,1},{0,0,1,0,1},{0,0,1,1,0}},stack[20],circuit[20],top=0,count=0;stack[top++]=0;
    while(top){int node=stack[top-1],next=-1;for(int i=0;i<5;i++)if(graph[node][i]){next=i;break;}if(next>=0){graph[node][next]=graph[next][node]=0;stack[top++]=next;}else circuit[count++]=stack[--top];}
    for(int i=count-1;i>=0;i--){printf("%d%c",circuit[i],i?' ':'\\n');}
    return 0;`),
    sampleOutput: "0 1 2 3 4 2 0",
    time: "O(V + E)",
    method: "Follow unused edges on a stack and append a vertex only when it has no remaining edge."
  })
];
