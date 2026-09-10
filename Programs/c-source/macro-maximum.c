#include <stdio.h>

#define MAXIMUM(first, second) ((first) > (second) ? (first) : (second))

int main(void)
{
    int first, second;
    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    printf("Maximum = %d\n", MAXIMUM(first, second));
    return 0;
}
