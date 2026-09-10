#include <stdio.h>

int main(void)
{
    int values[] = {2, 2, 1, 1, 1, 2, 2};
    int candidate = 0, votes = 0;
    for (int index = 0; index < 7; index++) {
        if (votes == 0) candidate = values[index];
        votes += values[index] == candidate ? 1 : -1;
    }
    int frequency = 0;
    for (int index = 0; index < 7; index++) if (values[index] == candidate) frequency++;
    if (frequency > 7 / 2) printf("Majority = %d\n", candidate);
    else puts("No majority element.");
    return 0;
}
