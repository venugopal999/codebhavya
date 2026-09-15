#include <stdio.h>

int main(void)
{
    int terms;
    unsigned long long first = 0, second = 1;

    printf("Enter number of terms: ");
    scanf("%d", &terms);
    if (terms < 1 || terms > 94) {
        printf("Use a term count from 1 to 94.\n");
        return 0;
    }
    for (int index = 0; index < terms; index++) {
        printf("%llu%c", first, index == terms - 1 ? '\n' : ' ');
        unsigned long long next = first + second;
        first = second;
        second = next;
    }
    return 0;
}
