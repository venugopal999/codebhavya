#include <stdio.h>

int main(void)
{
    int shape, operation;
    double value;
    printf("Shape: 1. Square  2. Circle: ");
    scanf("%d", &shape);
    printf("Operation: 1. Area  2. Perimeter: ");
    scanf("%d", &operation);
    printf("Enter side or radius: ");
    scanf("%lf", &value);
    switch (shape) {
        case 1:
            switch (operation) {
                case 1: printf("Result = %.2f\n", value * value); break;
                case 2: printf("Result = %.2f\n", 4.0 * value); break;
                default: puts("Invalid operation.");
            }
            break;
        case 2:
            switch (operation) {
                case 1: printf("Result = %.2f\n", 3.141592653589793 * value * value); break;
                case 2: printf("Result = %.2f\n", 2.0 * 3.141592653589793 * value); break;
                default: puts("Invalid operation.");
            }
            break;
        default: puts("Invalid shape.");
    }
    return 0;
}
