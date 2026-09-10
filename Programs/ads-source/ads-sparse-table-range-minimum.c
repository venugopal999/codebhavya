#include <stdio.h>

int main(void)
{
    int values[]={7,2,3,0,5,10,3,12,18},table[4][9],logs[10]={0};for(int i=2;i<=9;i++)logs[i]=logs[i/2]+1;for(int i=0;i<9;i++)table[0][i]=values[i];for(int level=1;(1<<level)<=9;level++)for(int i=0;i+(1<<level)<=9;i++){int a=table[level-1][i],b=table[level-1][i+(1<<(level-1))];table[level][i]=a<b?a:b;}int left=2,right=6,level=logs[right-left+1],a=table[level][left],b=table[level][right-(1<<level)+1];printf("Minimum = %d\n",a<b?a:b);return 0;
}
