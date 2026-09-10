#include <stdio.h>

unsigned long long fibonacci(int index)
{
    if (index <= 1) return (unsigned long long) index;
    return fibonacci(index - 1) + fibonacci(index - 2);
}

int main(void)
{
    int terms;

    printf("Enter number of terms from 1 to 40: ");
    scanf("%d", &terms);
    if (terms < 1 || terms > 40) return 1;
    for (int index = 0; index < terms; index++)
        printf("%llu%c", fibonacci(index), index == terms - 1 ? '\n' : ' ');
    return 0;
}
