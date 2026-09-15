#include <stdio.h>

unsigned int hash1(const char*s){unsigned int h=5381;while(*s)h=h*33u+(unsigned char)*s++;return h;}unsigned int hash2(const char*s){unsigned int h=0;while(*s)h=h*131u+(unsigned char)*s++;return h;}

int main(void)
{
    unsigned int bits=0;const char*words[]={"code","data","tree"};for(int i=0;i<3;i++){bits|=1u<<(hash1(words[i])%32);bits|=1u<<(hash2(words[i])%32);}const char*queries[]={"data","graph"};for(int i=0;i<2;i++){int maybe=(bits&(1u<<(hash1(queries[i])%32)))&&(bits&(1u<<(hash2(queries[i])%32)));printf("%s:%s%c",queries[i],maybe?"Maybe":"No",i==1?'\n':' ');}return 0;
}
