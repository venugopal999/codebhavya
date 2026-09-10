"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 19 — Files and File Organization";

function program(options) {
  return makeAds({ topic, concepts: ["Record organization", "Secondary storage"], difficulty: "Advanced", ...options });
}

module.exports = [
  program({
    slug: "ads-fixed-length-binary-records",
    title: "Store Fixed-Length Records in a Binary File",
    source: cMain(`    struct Record records[]={{101,"Asha",88},{102,"Ravi",91},{103,"Neha",85}};FILE*file=fopen("records.bin","wb");if(!file)return 1;fwrite(records,sizeof records[0],3,file);fclose(file);file=fopen("records.bin","rb");struct Record value;fseek(file,(long)sizeof value,SEEK_SET);fread(&value,sizeof value,1,file);fclose(file);printf("%d %s %d\\n",value.id,value.name,value.mark);return 0;`, ["stdio.h"], `struct Record{int id;char name[16];int mark;};`),
    sampleOutput: "102 Ravi 91",
    time: "O(1) random access",
    space: "O(1)",
    method: "Use equal-size binary records so byte offset equals record index times record size."
  }),
  program({
    slug: "ads-random-access-record-update",
    title: "Update a Record In Place with fseek",
    source: cMain(`    int values[]={10,20,30,40};FILE*file=fopen("values.bin","wb+");if(!file)return 1;fwrite(values,sizeof values[0],4,file);int replacement=99;fseek(file,2L*(long)sizeof replacement,SEEK_SET);fwrite(&replacement,sizeof replacement,1,file);rewind(file);fread(values,sizeof values[0],4,file);fclose(file);for(int i=0;i<4;i++)printf("%d%c",values[i],i==3?'\\n':' ');return 0;`),
    sampleOutput: "10 20 99 40",
    time: "O(1) update",
    space: "O(1)",
    method: "Seek directly to the fixed record offset and overwrite only that record."
  }),
  program({
    slug: "ads-sequential-file-search",
    title: "Search a Sequential Record File",
    source: cMain(`    struct Record records[]={{10,"A"},{20,"B"},{30,"C"}};FILE*file=fopen("sequential.bin","wb");if(!file)return 1;fwrite(records,sizeof records[0],3,file);fclose(file);file=fopen("sequential.bin","rb");struct Record value;while(fread(&value,sizeof value,1,file)==1)if(value.id==20){printf("Found = %s\\n",value.name);break;}fclose(file);return 0;`, ["stdio.h"], `struct Record{int id;char name[8];};`),
    sampleOutput: "Found = B",
    time: "O(n)",
    space: "O(1)",
    method: "Read records in storage order until the requested key is encountered."
  }),
  program({
    slug: "ads-primary-index-block-search",
    title: "Search File Blocks with a Primary Index",
    source: cMain(`    int first_key[]={10,40,70},records[][3]={{10,20,30},{40,50,60},{70,80,90}},target=50,block=0;while(block+1<3&&first_key[block+1]<=target)block++;int slot=-1;for(int i=0;i<3;i++)if(records[block][i]==target)slot=i;printf("Block = %d Slot = %d\\n",block,slot);return 0;`),
    sampleOutput: "Block = 1 Slot = 1",
    time: "O(log blocks + block size)",
    space: "O(block count)",
    method: "Use one index entry per sorted block, then scan only the selected data block."
  }),
  program({
    slug: "ads-inverted-file-index",
    title: "Build an Inverted Index for Text Records",
    source: cMain(`    const char*records[]={"data structures","advanced data","graph structures"};const char*term="data";printf("Record IDs:");for(int i=0;i<3;i++)if(strstr(records[i],term))printf(" %d",i);putchar('\\n');return 0;`, ["stdio.h", "string.h"]),
    sampleOutput: "Record IDs: 0 1",
    time: "O(total text) to build",
    space: "O(postings)",
    method: "Associate each term with a postings list of record identifiers containing it."
  }),
  program({
    slug: "ads-hashed-file-buckets",
    title: "Organize Records into Hashed File Buckets",
    source: cMain(`    int buckets[5][4]={{0}},count[5]={0},keys[]={12,7,22,19,17};for(int i=0;i<5;i++){int b=keys[i]%5;buckets[b][count[b]++]=keys[i];}for(int b=0;b<5;b++)if(count[b]){printf("B%d:",b);for(int i=0;i<count[b];i++)printf(" %d",buckets[b][i]);putchar('\\n');}return 0;`),
    sampleOutput: "B2: 12 7 22 17\nB4: 19",
    time: "Average O(1) access",
    space: "O(records + buckets)",
    method: "Map a record key to a bucket and keep colliding records in that bucket's overflow area."
  }),
  program({
    slug: "ads-file-free-list-reuse",
    title: "Reuse Deleted Record Slots with a Free List",
    source: cMain(`    int next_free[]={-1,-1,-1,-1},free_head=-1;next_free[1]=free_head;free_head=1;next_free[3]=free_head;free_head=3;int reused=free_head;free_head=next_free[free_head];printf("Reused slot = %d Next free = %d\\n",reused,free_head);return 0;`),
    sampleOutput: "Reused slot = 3 Next free = 1",
    time: "O(1) deletion and reuse",
    space: "O(deleted slots)",
    method: "Chain deleted slots and allocate the free-list head before appending new storage."
  }),
  program({
    slug: "ads-variable-length-record-packing",
    title: "Pack Variable-Length Records with Length Prefixes",
    source: cMain(`    const char*names[]={"Ada","Bhavya","Ravi"};FILE*file=fopen("variable.bin","wb+");if(!file)return 1;for(int i=0;i<3;i++){int length=(int)strlen(names[i]);fwrite(&length,sizeof length,1,file);fwrite(names[i],1,(size_t)length,file);}rewind(file);for(int i=0;i<3;i++){int length;char name[20];fread(&length,sizeof length,1,file);fread(name,1,(size_t)length,file);name[length]='\\0';printf("%s%c",name,i==2?'\\n':' ');}fclose(file);return 0;`, ["stdio.h", "string.h"]),
    sampleOutput: "Ada Bhavya Ravi",
    time: "O(total record bytes)",
    space: "O(maximum record length)",
    method: "Write each payload after its length so a reader can locate the following record safely."
  })
];
