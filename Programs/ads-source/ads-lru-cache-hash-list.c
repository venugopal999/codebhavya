#include <stdio.h>

struct Cache{int keys[2],values[2],count;};int find(struct Cache*c,int key){for(int i=0;i<c->count;i++)if(c->keys[i]==key)return i;return -1;}void touch(struct Cache*c,int index){int k=c->keys[index],v=c->values[index];for(int i=index;i>0;i--){c->keys[i]=c->keys[i-1];c->values[i]=c->values[i-1];}c->keys[0]=k;c->values[0]=v;}int get(struct Cache*c,int key){int i=find(c,key);if(i<0)return -1;int value=c->values[i];touch(c,i);return value;}void put(struct Cache*c,int key,int value){int i=find(c,key);if(i>=0){c->values[i]=value;touch(c,i);return;}if(c->count<2)c->count++;for(i=c->count-1;i>0;i--){c->keys[i]=c->keys[i-1];c->values[i]=c->values[i-1];}c->keys[0]=key;c->values[0]=value;}

int main(void)
{
    struct Cache cache={{0},{0},0};put(&cache,1,10);put(&cache,2,20);printf("Get1=%d ",get(&cache,1));put(&cache,3,30);printf("Get2=%d Get3=%d\n",get(&cache,2),get(&cache,3));return 0;
}
