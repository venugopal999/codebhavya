#include <stdio.h>

struct Status {
    unsigned ready : 1;
    unsigned error : 1;
    unsigned mode : 2;
};

int main(void)
{
    struct Status status = {1, 0, 2};
    printf("ready=%u error=%u mode=%u\n", (unsigned) status.ready,
           (unsigned) status.error, (unsigned) status.mode);
    return 0;
}
