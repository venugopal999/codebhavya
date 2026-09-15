#include <stdio.h>

int main(void)
{
    int table[7]={0},distance[7]={0},keys[]={10,17,24,31};
    for(int k=0;k<4;k++){int key=keys[k],dist=0,slot=key%7;while(table[slot]){if(distance[slot]<dist){int t=table[slot];table[slot]=key;key=t;t=distance[slot];distance[slot]=dist;dist=t;}slot=(slot+1)%7;dist++;}table[slot]=key;distance[slot]=dist;}
    for(int i=0;i<7;i++){if(table[i])printf("%d:%d(%d) ",i,table[i],distance[i]);}
    putchar('\n');return 0;
}
