#include <stdio.h>

int main(void)
{
    int firstSize, secondSize, first[50], second[50], merged[100];

    scanf("%d", &firstSize);
    if (firstSize < 0 || firstSize > 50) return 1;
    for (int index = 0; index < firstSize; index++) scanf("%d", &first[index]);
    scanf("%d", &secondSize);
    if (secondSize < 0 || secondSize > 50) return 1;
    for (int index = 0; index < secondSize; index++) scanf("%d", &second[index]);
    for (int index = 0; index < firstSize; index++) merged[index] = first[index];
    for (int index = 0; index < secondSize; index++) merged[firstSize + index] = second[index];
    for (int index = 0; index < firstSize + secondSize; index++)
        printf("%d%c", merged[index], index == firstSize + secondSize - 1 ? '\n' : ' ');
    return 0;
}
