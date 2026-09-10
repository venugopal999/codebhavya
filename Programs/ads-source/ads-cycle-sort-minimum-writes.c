#include <stdio.h>

void print_values(const int values[], int count) { for (int i = 0; i < count; i++) printf("%d%c", values[i], i == count - 1 ? '\n' : ' '); }

int main(void)
{
    int values[] = {1, 8, 3, 9, 10, 10, 2, 4}, writes = 0;
    for (int start = 0; start < 7; start++) {
        int item = values[start], position = start;
        for (int i = start + 1; i < 8; i++) if (values[i] < item) position++;
        if (position == start) continue;
        while (item == values[position]) position++;
        int temp = values[position]; values[position] = item; item = temp; writes++;
        while (position != start) {
            position = start;
            for (int i = start + 1; i < 8; i++) if (values[i] < item) position++;
            while (item == values[position]) position++;
            temp = values[position]; values[position] = item; item = temp; writes++;
        }
    }
    print_values(values, 8); printf("Writes = %d\n", writes); return 0;
}
