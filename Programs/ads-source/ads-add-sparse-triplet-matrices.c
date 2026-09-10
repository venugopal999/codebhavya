#include <stdio.h>

int main(void)
{
    int first[][3] = {{0, 0, 2}, {1, 2, 4}, {2, 1, 5}};
    int second[][3] = {{0, 0, 3}, {1, 1, 7}, {2, 1, -5}};
    int i = 0, j = 0;
    while (i < 3 || j < 3) {
        if (j == 3 || (i < 3 && (first[i][0] < second[j][0] || (first[i][0] == second[j][0] && first[i][1] < second[j][1])))) {
            printf("%d %d %d\n", first[i][0], first[i][1], first[i][2]); i++;
        } else if (i == 3 || second[j][0] < first[i][0] || (second[j][0] == first[i][0] && second[j][1] < first[i][1])) {
            printf("%d %d %d\n", second[j][0], second[j][1], second[j][2]); j++;
        } else {
            int sum = first[i][2] + second[j][2]; if (sum != 0) printf("%d %d %d\n", first[i][0], first[i][1], sum); i++; j++;
        }
    }
    return 0;
}
