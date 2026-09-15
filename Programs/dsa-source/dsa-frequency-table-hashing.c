#include <stdio.h>

int main(void)
{
    int values[] = {4, 2, 4, 3, 2, 4};
    int frequency[11] = {0};
    for (int index = 0; index < 6; index++) frequency[values[index]]++;
    for (int value = 0; value <= 10; value++)
        if (frequency[value] > 0) printf("%d occurs %d time(s)\n", value, frequency[value]);
    return 0;
}
