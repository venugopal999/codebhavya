#include <stdio.h>

int main(void)
{
    int firstSize, secondSize, first[100], second[100];

    scanf("%d", &firstSize);
    if (firstSize < 0 || firstSize > 100) return 1;
    for (int index = 0; index < firstSize; index++) scanf("%d", &first[index]);
    scanf("%d", &secondSize);
    if (secondSize < 0 || secondSize > 100) return 1;
    for (int index = 0; index < secondSize; index++) scanf("%d", &second[index]);
    printf("Common: ");
    for (int index = 0; index < firstSize; index++) {
        int alreadyPrinted = 0;
        for (int previous = 0; previous < index; previous++)
            if (first[previous] == first[index]) alreadyPrinted = 1;
        if (alreadyPrinted) continue;
        for (int next = 0; next < secondSize; next++) {
            if (first[index] == second[next]) { printf("%d ", first[index]); break; }
        }
    }
    printf("\n");
    return 0;
}
