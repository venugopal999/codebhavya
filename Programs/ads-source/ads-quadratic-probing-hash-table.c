#include <stdio.h>

int main(void)
{
    int table[11];for(int i=0;i<11;i++)table[i]=-1;int keys[]={22,33,44,55};
    for(int k=0;k<4;k++)for(int step=0;step<11;step++){int slot=(keys[k]%11+step*step)%11;if(table[slot]<0){table[slot]=keys[k];break;}}
    for(int i=0;i<11;i++){if(table[i]>=0)printf("%d:%d ",i,table[i]);}
    putchar('\n');return 0;
}
