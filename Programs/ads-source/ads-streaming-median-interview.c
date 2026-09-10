#include <stdio.h>

int main(void)
{
    int values[]={2,1,5,7,2,0,5},sorted[7],count=0;for(int i=0;i<7;i++){int position=count;while(position>0&&sorted[position-1]>values[i]){sorted[position]=sorted[position-1];position--;}sorted[position]=values[i];count++;if(count%2)printf("%.1f",sorted[count/2]*1.0);else printf("%.1f",(sorted[count/2-1]+sorted[count/2])/2.0);printf("%c",i==6?'\n':' ');}return 0;
}
