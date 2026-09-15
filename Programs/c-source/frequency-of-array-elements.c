#include <stdio.h>

int main(void)
{
    int size, values[100], counted[100] = {0};

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int index = 0; index < size; index++) {
        if (counted[index]) continue;
        int frequency = 1;
        for (int next = index + 1; next < size; next++) {
            if (values[next] == values[index]) { frequency++; counted[next] = 1; }
        }
        printf("%d occurs %d time(s)\n", values[index], frequency);
    }
    return 0;
}
