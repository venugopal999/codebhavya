#include <stdio.h>

int main(void)
{
    int streams[3][3]={{1,4,7},{2,5,8},{3,6,9}},position[3]={0};for(int out=0;out<9;out++){int best=-1;for(int i=0;i<3;i++)if(position[i]<3&&(best<0||streams[i][position[i]]<streams[best][position[best]]))best=i;printf("%d%c",streams[best][position[best]++],out==8?'\n':' ');}return 0;
}
