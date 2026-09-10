#include <stdio.h>
#include <string.h>

int main(void)
{
    const char*names[]={"Ada","Bhavya","Ravi"};FILE*file=fopen("variable.bin","wb+");if(!file)return 1;for(int i=0;i<3;i++){int length=(int)strlen(names[i]);fwrite(&length,sizeof length,1,file);fwrite(names[i],1,(size_t)length,file);}rewind(file);for(int i=0;i<3;i++){int length;char name[20];fread(&length,sizeof length,1,file);fread(name,1,(size_t)length,file);name[length]='\0';printf("%s%c",name,i==2?'\n':' ');}fclose(file);return 0;
}
