#include <stdio.h>

int augment(int left,int graph[4][4],int seen[],int matched[]){for(int right=0;right<4;right++)if(graph[left][right]&&!seen[right]){seen[right]=1;if(matched[right]<0||augment(matched[right],graph,seen,matched)){matched[right]=left;return 1;}}return 0;}

int main(void)
{
    int graph[4][4]={{1,1,0,0},{0,1,1,0},{0,0,1,1},{1,0,0,0}},matched[4]={-1,-1,-1,-1},answer=0;
    for(int left=0;left<4;left++){int seen[4]={0};answer+=augment(left,graph,seen,matched);}printf("Matching size = %d\n",answer);return 0;
}
