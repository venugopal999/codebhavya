#include <stdio.h>

struct Record{int id;char name[8];};

int main(void)
{
    struct Record records[]={{10,"A"},{20,"B"},{30,"C"}};FILE*file=fopen("sequential.bin","wb");if(!file)return 1;fwrite(records,sizeof records[0],3,file);fclose(file);file=fopen("sequential.bin","rb");struct Record value;while(fread(&value,sizeof value,1,file)==1)if(value.id==20){printf("Found = %s\n",value.name);break;}fclose(file);return 0;
}
