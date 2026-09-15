#include <stdio.h>
#include <stdarg.h>

int sum_values(int count, ...)
{
    va_list arguments;
    va_start(arguments, count);
    int sum = 0;
    for (int index = 0; index < count; index++) sum += va_arg(arguments, int);
    va_end(arguments);
    return sum;
}

int main(void)
{
    printf("Sum = %d\n", sum_values(5, 4, 8, 15, 16, 23));
    return 0;
}
