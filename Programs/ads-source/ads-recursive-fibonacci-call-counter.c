#include <stdio.h>

int fibonacci(int number, int *calls)
{
    (*calls)++;
    if (number < 2) return number;
    return fibonacci(number - 1, calls) + fibonacci(number - 2, calls);
}

int main(void)
{
    int calls = 0;
    int value = fibonacci(5, &calls);
    printf("Fibonacci = %d Calls = %d\n", value, calls);
    return 0;
}
