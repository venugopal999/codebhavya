#include <stdio.h>

void insert(int a[],int b[],int key){int table=0;for(int move=0;move<20;move++){int slot=table?((key/7)%7):(key%7);int*target=table?b:a;if(!target[slot]){target[slot]=key;return;}int displaced=target[slot];target[slot]=key;key=displaced;table^=1;}}

int main(void)
{
    int first[7]={0},second[7]={0},keys[]={20,50,53,75,100,67,105};for(int i=0;i<7;i++)insert(first,second,keys[i]);
    for(int i=0;i<7;i++){if(first[i])printf("A%d:%d ",i,first[i]);}
    for(int i=0;i<7;i++){if(second[i])printf("B%d:%d ",i,second[i]);}
    putchar('\n');return 0;
}
