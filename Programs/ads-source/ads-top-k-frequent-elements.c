#include <stdio.h>

int main(void)
{
    int values[]={1,1,1,2,2,3},frequency[4]={0};for(int i=0;i<6;i++)frequency[values[i]]++;for(int pick=0;pick<2;pick++){int best=1;for(int value=2;value<=3;value++)if(frequency[value]>frequency[best])best=value;printf("%d%c",best,pick==1?'\n':' ');frequency[best]=-1;}return 0;
}
