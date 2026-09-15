#include <stdio.h>
#include <stddef.h>

struct Node{int key;struct Node*parent,*child,*next;};

int main(void)
{
    struct Node parent={10,NULL,NULL,NULL}, child={30,&parent,NULL,NULL};parent.child=&child;
    child.key=5;if(child.key<parent.key){parent.child=NULL;child.parent=NULL;child.next=&parent;}
    printf("New root = %d Cut = %s\n",child.key,child.parent?"No":"Yes");return 0;
}
