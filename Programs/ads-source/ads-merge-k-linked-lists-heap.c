#include <stdio.h>
#include <stddef.h>

struct Node { int value; struct Node *next; };

int main(void)
{
    struct Node a3={7,NULL},a2={4,&a3},a1={1,&a2},b3={8,NULL},b2={5,&b3},b1={2,&b2},c3={9,NULL},c2={6,&c3},c1={3,&c2};
    struct Node *heads[] = {&a1,&b1,&c1};
    for (int out = 0; out < 9; out++) { int best = -1; for (int i = 0; i < 3; i++) if (heads[i] && (best < 0 || heads[i]->value < heads[best]->value)) best = i; printf("%d%c", heads[best]->value, out == 8 ? '\n' : ' '); heads[best] = heads[best]->next; }
    return 0;
}
