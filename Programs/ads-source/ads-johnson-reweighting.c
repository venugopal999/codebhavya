#include <stdio.h>

int main(void)
{
    int edges[][3]={{0,1,-2},{0,2,4},{1,2,3},{1,3,2},{2,3,-1}},potential[]={0,-2,0,-1};
    for(int i=0;i<5;i++){int from=edges[i][0],to=edges[i][1],weight=edges[i][2]+potential[from]-potential[to];printf("%d-%d:%d%c",from,to,weight,i==4?'\n':' ');}return 0;
}
