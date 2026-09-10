#include <stdio.h>

struct Node { int keys[3], count; struct Node *child[4]; };

int main(void)
{
    struct Node left = {{5,10},2,{0}}, middle = {{25,30},2,{0}}, right = {{45,60},2,{0}};
    struct Node root = {{20,40},2,{&left,&middle,&right}}; int target = 30, child = 0;
    while (child < root.count && target > root.keys[child]) child++;
    struct Node *leaf = root.child[child]; int slot = 0; while (slot < leaf->count && leaf->keys[slot] < target) slot++;
    printf("Child = %d Slot = %d Found = %s\n", child, slot, slot < leaf->count && leaf->keys[slot] == target ? "Yes" : "No"); return 0;
}
