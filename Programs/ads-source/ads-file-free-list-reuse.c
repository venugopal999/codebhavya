#include <stdio.h>

int main(void)
{
    int next_free[]={-1,-1,-1,-1},free_head=-1;next_free[1]=free_head;free_head=1;next_free[3]=free_head;free_head=3;int reused=free_head;free_head=next_free[free_head];printf("Reused slot = %d Next free = %d\n",reused,free_head);return 0;
}
