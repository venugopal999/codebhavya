#include <stdio.h>

int main(void)
{
    int values[]={1,3,-1,-3,5,3,6,7},deque[8],front=0,back=0,k=3;for(int i=0;i<8;i++){while(front<back&&deque[front]<=i-k)front++;while(front<back&&values[deque[back-1]]<=values[i])back--;deque[back++]=i;if(i>=k-1)printf("%d%c",values[deque[front]],i==7?'\n':' ');}return 0;
}
