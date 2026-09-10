"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 21 — Placement-Oriented Structures";

function program(options) {
  return makeAds({ topic, concepts: ["Interview pattern", "Range and stream queries"], difficulty: "Advanced", ...options });
}

module.exports = [
  program({
    slug: "ads-fenwick-tree-range-sum",
    title: "Answer Range Sums with a Fenwick Tree",
    source: cMain(`    int values[]={1,2,3,4,5,6},tree[7]={0};for(int i=0;i<6;i++)update(tree,6,i+1,values[i]);printf("Sum[1,4] = %d\\n",query(tree,5)-query(tree,1));return 0;`, ["stdio.h"], `void update(int tree[],int count,int index,int delta){for(;index<=count;index+=index&-index)tree[index]+=delta;}int query(const int tree[],int index){int sum=0;for(;index>0;index-=index&-index)sum+=tree[index];return sum;}`),
    sampleOutput: "Sum[1,4] = 14",
    time: "O(log n) update/query",
    space: "O(n)",
    method: "Store partial sums indexed by the least significant set bit and subtract two prefixes."
  }),
  program({
    slug: "ads-segment-tree-range-sum",
    title: "Answer Range Sums with a Segment Tree",
    source: cMain(`    int values[]={1,3,5,7,9,11},tree[24]={0};build(values,tree,1,0,5);printf("Sum[1,3] = %d\\n",query(tree,1,0,5,1,3));return 0;`, ["stdio.h"], `void build(const int a[],int t[],int node,int left,int right){if(left==right){t[node]=a[left];return;}int middle=(left+right)/2;build(a,t,node*2,left,middle);build(a,t,node*2+1,middle+1,right);t[node]=t[node*2]+t[node*2+1];}int query(const int t[],int node,int left,int right,int ql,int qr){if(qr<left||right<ql)return 0;if(ql<=left&&right<=qr)return t[node];int middle=(left+right)/2;return query(t,node*2,left,middle,ql,qr)+query(t,node*2+1,middle+1,right,ql,qr);}`),
    sampleOutput: "Sum[1,3] = 15",
    time: "O(log n) query",
    space: "O(n)",
    method: "Decompose a query interval into fully covered segment-tree nodes."
  }),
  program({
    slug: "ads-lazy-segment-tree-range-update",
    title: "Apply Range Updates with Lazy Propagation",
    source: cMain(`    int tree[40]={0},lazy[40]={0};update(tree,lazy,1,0,4,1,3,5);update(tree,lazy,1,0,4,2,4,2);printf("Point 2 = %d Point 4 = %d\\n",query(tree,lazy,1,0,4,2),query(tree,lazy,1,0,4,4));return 0;`, ["stdio.h"], `void push(int tree[],int lazy[],int node,int left,int right){if(lazy[node]){tree[node]+=(right-left+1)*lazy[node];if(left!=right){lazy[node*2]+=lazy[node];lazy[node*2+1]+=lazy[node];}lazy[node]=0;}}void update(int tree[],int lazy[],int node,int left,int right,int ql,int qr,int value){push(tree,lazy,node,left,right);if(qr<left||right<ql)return;if(ql<=left&&right<=qr){lazy[node]+=value;push(tree,lazy,node,left,right);return;}int middle=(left+right)/2;update(tree,lazy,node*2,left,middle,ql,qr,value);update(tree,lazy,node*2+1,middle+1,right,ql,qr,value);tree[node]=tree[node*2]+tree[node*2+1];}int query(int tree[],int lazy[],int node,int left,int right,int index){push(tree,lazy,node,left,right);if(left==right)return tree[node];int middle=(left+right)/2;return index<=middle?query(tree,lazy,node*2,left,middle,index):query(tree,lazy,node*2+1,middle+1,right,index);}`),
    sampleOutput: "Point 2 = 7 Point 4 = 2",
    time: "O(log n) update/query",
    space: "O(n)",
    method: "Delay a fully covered range update at its node and push it only when descendants are needed."
  }),
  program({
    slug: "ads-sparse-table-range-minimum",
    title: "Answer Static Range Minimum Queries with a Sparse Table",
    source: cMain(`    int values[]={7,2,3,0,5,10,3,12,18},table[4][9],logs[10]={0};for(int i=2;i<=9;i++)logs[i]=logs[i/2]+1;for(int i=0;i<9;i++)table[0][i]=values[i];for(int level=1;(1<<level)<=9;level++)for(int i=0;i+(1<<level)<=9;i++){int a=table[level-1][i],b=table[level-1][i+(1<<(level-1))];table[level][i]=a<b?a:b;}int left=2,right=6,level=logs[right-left+1],a=table[level][left],b=table[level][right-(1<<level)+1];printf("Minimum = %d\\n",a<b?a:b);return 0;`),
    sampleOutput: "Minimum = 0",
    time: "O(n log n) build, O(1) query",
    space: "O(n log n)",
    method: "Precompute minima for power-of-two blocks and cover a query with two overlapping blocks."
  }),
  program({
    slug: "ads-sliding-window-maximum-deque",
    title: "Find Sliding-Window Maximums with a Deque",
    source: cMain(`    int values[]={1,3,-1,-3,5,3,6,7},deque[8],front=0,back=0,k=3;for(int i=0;i<8;i++){while(front<back&&deque[front]<=i-k)front++;while(front<back&&values[deque[back-1]]<=values[i])back--;deque[back++]=i;if(i>=k-1)printf("%d%c",values[deque[front]],i==7?'\\n':' ');}return 0;`),
    sampleOutput: "3 3 5 5 6 7",
    time: "O(n)",
    space: "O(k)",
    method: "Keep only useful indices in decreasing value order while removing indices outside the window."
  }),
  program({
    slug: "ads-top-k-frequent-elements",
    title: "Select the Top-K Frequent Elements",
    source: cMain(`    int values[]={1,1,1,2,2,3},frequency[4]={0};for(int i=0;i<6;i++)frequency[values[i]]++;for(int pick=0;pick<2;pick++){int best=1;for(int value=2;value<=3;value++)if(frequency[value]>frequency[best])best=value;printf("%d%c",best,pick==1?'\\n':' ');frequency[best]=-1;}return 0;`),
    sampleOutput: "1 2",
    time: "O(n + uk) demonstration",
    space: "O(u)",
    method: "Count each value, then repeatedly select the highest remaining frequency."
  }),
  program({
    slug: "ads-merge-k-placement-streams",
    title: "Merge K Sorted Streams for an Interview",
    source: cMain(`    int streams[3][3]={{1,4,7},{2,5,8},{3,6,9}},position[3]={0};for(int out=0;out<9;out++){int best=-1;for(int i=0;i<3;i++)if(position[i]<3&&(best<0||streams[i][position[i]]<streams[best][position[best]]))best=i;printf("%d%c",streams[best][position[best]++],out==8?'\\n':' ');}return 0;`),
    sampleOutput: "1 2 3 4 5 6 7 8 9",
    time: "O(total log k) with a heap",
    space: "O(k)",
    method: "Maintain one current candidate per stream and advance only the stream whose value is emitted."
  }),
  program({
    slug: "ads-streaming-median-interview",
    title: "Answer a Streaming Median Interview Query",
    source: cMain(`    int values[]={2,1,5,7,2,0,5},sorted[7],count=0;for(int i=0;i<7;i++){int position=count;while(position>0&&sorted[position-1]>values[i]){sorted[position]=sorted[position-1];position--;}sorted[position]=values[i];count++;if(count%2)printf("%.1f",sorted[count/2]*1.0);else printf("%.1f",(sorted[count/2-1]+sorted[count/2])/2.0);printf("%c",i==6?'\\n':' ');}return 0;`),
    sampleOutput: "2.0 1.5 2.0 3.5 2.0 2.0 2.0",
    time: "O(n^2) demonstration; O(n log n) with two heaps",
    space: "O(n)",
    method: "Insert each arrival into sorted order and report the middle one or average of the middle pair."
  })
];
