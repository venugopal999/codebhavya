#include <stdio.h>

int main(void)
{
    int size, values[100], rank;

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    scanf("%d", &rank);
    if (rank < 1 || rank > size) return 1;
    for (int start = 0; start < size - 1; start++) {
        int maximum = start;
        for (int index = start + 1; index < size; index++)
            if (values[index] > values[maximum]) maximum = index;
        int temporary = values[start]; values[start] = values[maximum]; values[maximum] = temporary;
    }
    printf("%dth largest = %d\n", rank, values[rank - 1]);
    return 0;
}
