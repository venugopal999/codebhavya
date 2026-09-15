#include <stdio.h>

int partition(int values[], int low, int high)
{
    int pivot = values[high], smaller = low - 1;
    for (int index = low; index < high; index++) {
        if (values[index] <= pivot) {
            smaller++;
            int temporary = values[smaller]; values[smaller] = values[index]; values[index] = temporary;
        }
    }
    int temporary = values[smaller + 1]; values[smaller + 1] = values[high]; values[high] = temporary;
    return smaller + 1;
}

void quickSort(int values[], int low, int high)
{
    if (low < high) {
        int pivot = partition(values, low, high);
        quickSort(values, low, pivot - 1);
        quickSort(values, pivot + 1, high);
    }
}

int main(void)
{
    int size, values[100];

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    quickSort(values, 0, size - 1);
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\n' : ' ');
    return 0;
}
