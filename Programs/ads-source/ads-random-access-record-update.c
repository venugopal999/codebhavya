#include <stdio.h>

int main(void)
{
    int values[]={10,20,30,40};FILE*file=fopen("values.bin","wb+");if(!file)return 1;fwrite(values,sizeof values[0],4,file);int replacement=99;fseek(file,2L*(long)sizeof replacement,SEEK_SET);fwrite(&replacement,sizeof replacement,1,file);rewind(file);fread(values,sizeof values[0],4,file);fclose(file);for(int i=0;i<4;i++)printf("%d%c",values[i],i==3?'\n':' ');return 0;
}
