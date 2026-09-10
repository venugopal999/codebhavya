#include <stdio.h>
#include <stddef.h>

int add(int first, int second) { return first + second; }
int subtract(int first, int second) { return first - second; }

int main(void)
{
    int choice, first, second;
    int (*operation)(int, int) = NULL;
    printf("1. Add  2. Subtract: ");
    scanf("%d", &choice);
    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    if (choice == 1) operation = add;
    else if (choice == 2) operation = subtract;
    else { puts("Invalid choice."); return 0; }
    printf("Result = %d\n", operation(first, second));
    return 0;
}
