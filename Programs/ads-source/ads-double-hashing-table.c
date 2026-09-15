#include <stdio.h>

int main(void)
{
    int table[13];for(int i=0;i<13;i++)table[i]=-1;int keys[]={18,41,22,44};
    for(int k=0;k<4;k++){int h1=keys[k]%13,h2=7-keys[k]%7;for(int step=0;step<13;step++){int slot=(h1+step*h2)%13;if(table[slot]<0){table[slot]=keys[k];break;}}}
    for(int i=0;i<13;i++){if(table[i]>=0)printf("%d:%d ",i,table[i]);}
    putchar('\n');return 0;
}
