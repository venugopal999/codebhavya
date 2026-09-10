#include <stdio.h>

int main(void)
{
    int keys[]={10,20,30,40};int prime=101,a=37,b=23,size=11;for(int i=0;i<4;i++)printf("%d->%d%c",keys[i],((a*keys[i]+b)%prime)%size,i==3?'\n':' ');return 0;
}
