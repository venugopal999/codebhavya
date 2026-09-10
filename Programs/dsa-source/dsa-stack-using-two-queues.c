#include <stdio.h>

void push_value(int first[], int *first_count, int second[], int *second_count, int value)
{
    second[(*second_count)++] = value;
    for (int index = 0; index < *first_count; index++) second[(*second_count)++] = first[index];
    for (int index = 0; index < *second_count; index++) first[index] = second[index];
    *first_count = *second_count;
    *second_count = 0;
}

int main(void)
{
    int first[20], second[20];
    int first_count = 0, second_count = 0;
    push_value(first, &first_count, second, &second_count, 10);
    push_value(first, &first_count, second, &second_count, 20);
    push_value(first, &first_count, second, &second_count, 30);
    printf("%d %d %d\n", first[0], first[1], first[2]);
    return 0;
}
