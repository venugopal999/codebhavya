"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 18 — Advanced Hashing";

function program(options) {
  return makeAds({ topic, concepts: ["Collision resolution", "Hash-table design"], difficulty: "Advanced", space: "O(table size)", ...options });
}

module.exports = [
  program({
    slug: "ads-quadratic-probing-hash-table",
    title: "Resolve Collisions with Quadratic Probing",
    source: cMain(`    int table[11];for(int i=0;i<11;i++)table[i]=-1;int keys[]={22,33,44,55};
    for(int k=0;k<4;k++)for(int step=0;step<11;step++){int slot=(keys[k]%11+step*step)%11;if(table[slot]<0){table[slot]=keys[k];break;}}
    for(int i=0;i<11;i++){if(table[i]>=0)printf("%d:%d ",i,table[i]);}
    putchar('\\n');return 0;`),
    sampleOutput: "0:22 1:33 4:44 9:55",
    time: "Average O(1), worst O(n)",
    method: "Probe squared offsets from the home slot to reduce primary clustering."
  }),
  program({
    slug: "ads-double-hashing-table",
    title: "Resolve Collisions with Double Hashing",
    source: cMain(`    int table[13];for(int i=0;i<13;i++)table[i]=-1;int keys[]={18,41,22,44};
    for(int k=0;k<4;k++){int h1=keys[k]%13,h2=7-keys[k]%7;for(int step=0;step<13;step++){int slot=(h1+step*h2)%13;if(table[slot]<0){table[slot]=keys[k];break;}}}
    for(int i=0;i<13;i++){if(table[i]>=0)printf("%d:%d ",i,table[i]);}
    putchar('\\n');return 0;`),
    sampleOutput: "2:41 5:18 9:22 10:44",
    time: "Average O(1), worst O(n)",
    method: "Use a second hash as the probe step so colliding keys follow different sequences."
  }),
  program({
    slug: "ads-cuckoo-hashing",
    title: "Place Keys with Cuckoo Hashing",
    source: cMain(`    int first[7]={0},second[7]={0},keys[]={20,50,53,75,100,67,105};for(int i=0;i<7;i++)insert(first,second,keys[i]);
    for(int i=0;i<7;i++){if(first[i])printf("A%d:%d ",i,first[i]);}
    for(int i=0;i<7;i++){if(second[i])printf("B%d:%d ",i,second[i]);}
    putchar('\\n');return 0;`, ["stdio.h"], `void insert(int a[],int b[],int key){int table=0;for(int move=0;move<20;move++){int slot=table?((key/7)%7):(key%7);int*target=table?b:a;if(!target[slot]){target[slot]=key;return;}int displaced=target[slot];target[slot]=key;key=displaced;table^=1;}}`),
    sampleOutput: "A0:105 A1:50 A2:100 A4:67 A5:75 A6:20 B0:53",
    time: "Expected O(1) lookup and insertion",
    method: "Evict a collision victim to its alternate table until an empty slot is found."
  }),
  program({
    slug: "ads-robin-hood-hashing",
    title: "Equalize Probe Distances with Robin Hood Hashing",
    source: cMain(`    int table[7]={0},distance[7]={0},keys[]={10,17,24,31};
    for(int k=0;k<4;k++){int key=keys[k],dist=0,slot=key%7;while(table[slot]){if(distance[slot]<dist){int t=table[slot];table[slot]=key;key=t;t=distance[slot];distance[slot]=dist;dist=t;}slot=(slot+1)%7;dist++;}table[slot]=key;distance[slot]=dist;}
    for(int i=0;i<7;i++){if(table[i])printf("%d:%d(%d) ",i,table[i],distance[i]);}
    putchar('\\n');return 0;`),
    sampleOutput: "3:10(0) 4:17(1) 5:24(2) 6:31(3)",
    time: "Average O(1)",
    method: "Let a farther-travelled key steal a slot from a key with a smaller probe distance."
  }),
  program({
    slug: "ads-bloom-filter-membership",
    title: "Test Probabilistic Membership with a Bloom Filter",
    source: cMain(`    unsigned int bits=0;const char*words[]={"code","data","tree"};for(int i=0;i<3;i++){bits|=1u<<(hash1(words[i])%32);bits|=1u<<(hash2(words[i])%32);}const char*queries[]={"data","graph"};for(int i=0;i<2;i++){int maybe=(bits&(1u<<(hash1(queries[i])%32)))&&(bits&(1u<<(hash2(queries[i])%32)));printf("%s:%s%c",queries[i],maybe?"Maybe":"No",i==1?'\\n':' ');}return 0;`, ["stdio.h"], `unsigned int hash1(const char*s){unsigned int h=5381;while(*s)h=h*33u+(unsigned char)*s++;return h;}unsigned int hash2(const char*s){unsigned int h=0;while(*s)h=h*131u+(unsigned char)*s++;return h;}`),
    sampleOutput: "data:Maybe graph:No",
    time: "O(k) per operation",
    space: "O(bit-array size)",
    method: "Set several hashed bit positions; a missing bit proves absence while all set bits mean possible presence."
  }),
  program({
    slug: "ads-dynamic-hash-table-rehash",
    title: "Rehash a Table When Its Load Factor Grows",
    source: cMain(`    int old[5]={0};int keys[]={1,6,11,16};for(int i=0;i<4;i++){int slot=keys[i]%5;while(old[slot])slot=(slot+1)%5;old[slot]=keys[i];}int fresh[11]={0};for(int i=0;i<5;i++)if(old[i]){int slot=old[i]%11;while(fresh[slot])slot=(slot+1)%11;fresh[slot]=old[i];}for(int i=0;i<11;i++)if(fresh[i])printf("%d:%d ",i,fresh[i]);putchar('\\n');return 0;`),
    sampleOutput: "0:11 1:1 5:16 6:6",
    time: "O(n) rehash",
    method: "Allocate a larger table and insert every active key using the new modulus."
  }),
  program({
    slug: "ads-universal-hashing",
    title: "Map Keys with a Universal Hash Function",
    source: cMain(`    int keys[]={10,20,30,40};int prime=101,a=37,b=23,size=11;for(int i=0;i<4;i++)printf("%d->%d%c",keys[i],((a*keys[i]+b)%prime)%size,i==3?'\\n':' ');return 0;`),
    sampleOutput: "10->2 20->1 30->0 40->1",
    time: "O(1) per key",
    space: "O(1)",
    method: "Choose coefficients from a universal family before reducing the result to the table size."
  }),
  program({
    slug: "ads-lru-cache-hash-list",
    title: "Build an LRU Cache with Hashing and a List",
    source: cMain(`    struct Cache cache={{0},{0},0};put(&cache,1,10);put(&cache,2,20);printf("Get1=%d ",get(&cache,1));put(&cache,3,30);printf("Get2=%d Get3=%d\\n",get(&cache,2),get(&cache,3));return 0;`, ["stdio.h"], `struct Cache{int keys[2],values[2],count;};int find(struct Cache*c,int key){for(int i=0;i<c->count;i++)if(c->keys[i]==key)return i;return -1;}void touch(struct Cache*c,int index){int k=c->keys[index],v=c->values[index];for(int i=index;i>0;i--){c->keys[i]=c->keys[i-1];c->values[i]=c->values[i-1];}c->keys[0]=k;c->values[0]=v;}int get(struct Cache*c,int key){int i=find(c,key);if(i<0)return -1;int value=c->values[i];touch(c,i);return value;}void put(struct Cache*c,int key,int value){int i=find(c,key);if(i>=0){c->values[i]=value;touch(c,i);return;}if(c->count<2)c->count++;for(i=c->count-1;i>0;i--){c->keys[i]=c->keys[i-1];c->values[i]=c->values[i-1];}c->keys[0]=key;c->values[0]=value;}`),
    sampleOutput: "Get1=10 Get2=-1 Get3=30",
    time: "O(1) with a real hash map and doubly linked list",
    space: "O(capacity)",
    method: "Move every accessed key to the front and evict the least-recent key from the back."
  })
];
