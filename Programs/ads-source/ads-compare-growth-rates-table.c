#include <stdio.h>

int main(void)
{
    int n = 8, logarithm = 0;
    for (int value = n; value > 1; value /= 2) logarithm++;
    printf("Linear = %d Quadratic = %d Log2 = %d\n", n, n * n, logarithm);
    return 0;
}
