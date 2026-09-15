#include <stdio.h>

void visit(void)
{
    static int count = 0;
    count++;
    printf("Visit %d\n", count);
}

int main(void)
{
    visit();
    visit();
    visit();
    return 0;
}
