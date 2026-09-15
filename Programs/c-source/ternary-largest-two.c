#include <stdio.h>

int main(void)
{
    int first, second;
    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    int largest = first > second ? first : second;
    printf("Largest = %d\n", largest);
    return 0;
}
