#include <stdio.h>

int main(void)
{
    int first_key[]={10,40,70},records[][3]={{10,20,30},{40,50,60},{70,80,90}},target=50,block=0;while(block+1<3&&first_key[block+1]<=target)block++;int slot=-1;for(int i=0;i<3;i++)if(records[block][i]==target)slot=i;printf("Block = %d Slot = %d\n",block,slot);return 0;
}
