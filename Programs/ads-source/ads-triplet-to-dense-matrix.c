#include <stdio.h>

int main(void)
{
    int triplets[][3] = {{0, 1, 5}, {1, 0, 2}, {1, 2, 7}};
    int matrix[2][3] = {{0}};
    for (int index = 0; index < 3; index++) matrix[triplets[index][0]][triplets[index][1]] = triplets[index][2];
    for (int row = 0; row < 2; row++)
        for (int column = 0; column < 3; column++) printf("%d%c", matrix[row][column], column == 2 ? '\n' : ' ');
    return 0;
}
