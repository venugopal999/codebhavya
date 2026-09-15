#include <stdio.h>

int main(void)
{
    int triplets[][3] = {{0, 1, 5}, {1, 0, 2}, {1, 3, 7}, {2, 2, 3}};
    int sums[3] = {0};
    for (int index = 0; index < 4; index++) sums[triplets[index][0]] += triplets[index][2];
    printf("%d %d %d\n", sums[0], sums[1], sums[2]);
    return 0;
}
