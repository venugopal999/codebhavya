#include <stdio.h>

int main(void)
{
    int old[5]={0};int keys[]={1,6,11,16};for(int i=0;i<4;i++){int slot=keys[i]%5;while(old[slot])slot=(slot+1)%5;old[slot]=keys[i];}int fresh[11]={0};for(int i=0;i<5;i++)if(old[i]){int slot=old[i]%11;while(fresh[slot])slot=(slot+1)%11;fresh[slot]=old[i];}for(int i=0;i<11;i++)if(fresh[i])printf("%d:%d ",i,fresh[i]);putchar('\n');return 0;
}
