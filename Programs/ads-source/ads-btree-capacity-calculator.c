#include <stdio.h>

int main(void)
{
    int minimum_degree = 3, height = 3; long long minimum_keys = 1, maximum_keys = 1;
    for (int level = 0; level < height; level++) { minimum_keys *= minimum_degree; maximum_keys *= 2 * minimum_degree; }
    minimum_keys = 2 * minimum_keys - 1; maximum_keys -= 1;
    printf("Min keys = %lld Max keys = %lld\n", minimum_keys, maximum_keys); return 0;
}
