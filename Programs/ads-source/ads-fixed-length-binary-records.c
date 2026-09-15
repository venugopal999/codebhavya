#include <stdio.h>

struct Record{int id;char name[16];int mark;};

int main(void)
{
    struct Record records[]={{101,"Asha",88},{102,"Ravi",91},{103,"Neha",85}};FILE*file=fopen("records.bin","wb");if(!file)return 1;fwrite(records,sizeof records[0],3,file);fclose(file);file=fopen("records.bin","rb");struct Record value;fseek(file,(long)sizeof value,SEEK_SET);fread(&value,sizeof value,1,file);fclose(file);printf("%d %s %d\n",value.id,value.name,value.mark);return 0;
}
