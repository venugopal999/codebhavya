#include <stdio.h>

#define DEBUG_MODE

int main(void)
{
    int result = 7 * 6;
#ifdef DEBUG_MODE
    printf("Debug: result was calculated.\n");
#endif
    printf("Result = %d\n", result);
    return 0;
}
