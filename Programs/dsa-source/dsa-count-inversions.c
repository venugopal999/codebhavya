#include <stdio.h>

long long merge_count(int values[], int temporary[], int left, int right)
{
    if (left >= right) return 0;
    int middle = left + (right - left) / 2;
    long long count = merge_count(values, temporary, left, middle)
                    + merge_count(values, temporary, middle + 1, right);
    int first = left, second = middle + 1, write = left;
    while (first <= middle && second <= right) {
        if (values[first] <= values[second]) temporary[write++] = values[first++];
        else {
            temporary[write++] = values[second++];
            count += middle - first + 1;
        }
    }
    while (first <= middle) temporary[write++] = values[first++];
    while (second <= right) temporary[write++] = values[second++];
    for (int index = left; index <= right; index++) values[index] = temporary[index];
    return count;
}

int main(void)
{
    int values[] = {2, 4, 1, 3, 5};
    int temporary[5];
    long long inversions = merge_count(values, temporary, 0, 4);
    printf("Inversions = %lld\n", inversions);
    return 0;
}
