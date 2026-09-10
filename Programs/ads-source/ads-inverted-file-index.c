#include <stdio.h>
#include <string.h>

int main(void)
{
    const char*records[]={"data structures","advanced data","graph structures"};const char*term="data";printf("Record IDs:");for(int i=0;i<3;i++)if(strstr(records[i],term))printf(" %d",i);putchar('\n');return 0;
}
