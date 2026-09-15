#include <stdio.h>

void merge(int values[], int left, int middle, int right)
{
    int temporary[100], first = left, second = middle + 1, count = 0;
    while (first <= middle && second <= right)
        temporary[count++] = values[first] <= values[second] ? values[first++] : values[second++];
    while (first <= middle) temporary[count++] = values[first++];
    while (second <= right) temporary[count++] = values[second++];
    for (int index = 0; index < count; index++) values[left + index] = temporary[index];
}

void mergeSort(int values[], int left, int right)
{
    if (left < right) {
        int middle = left + (right - left) / 2;
        mergeSort(values, left, middle);
        mergeSort(values, middle + 1, right);
        merge(values, left, middle, right);
    }
}

int main(void)
{
    int size, values[100];

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    mergeSort(values, 0, size - 1);
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\n' : ' ');
    return 0;
}
