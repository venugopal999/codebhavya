#include <stdio.h>

int main(void)
{
    int first[2][3] = {{1, 0, 2}, {0, 3, 0}};
    int second[3][2] = {{0, 4}, {5, 0}, {0, 6}};
    for (int row = 0; row < 2; row++) {
        for (int column = 0; column < 2; column++) {
            int sum = 0;
            for (int index = 0; index < 3; index++) if (first[row][index] && second[index][column]) sum += first[row][index] * second[index][column];
            printf("%d%c", sum, column == 1 ? '\n' : ' ');
        }
    }
    return 0;
}
