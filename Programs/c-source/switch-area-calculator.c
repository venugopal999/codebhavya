#include <stdio.h>

int main(void)
{
    int choice;
    double first, second;
    printf("1. Circle  2. Rectangle  3. Triangle\nChoose: ");
    scanf("%d", &choice);
    switch (choice) {
        case 1:
            printf("Enter radius: "); scanf("%lf", &first);
            printf("Area = %.2f\n", 3.141592653589793 * first * first); break;
        case 2:
            printf("Enter length and width: "); scanf("%lf %lf", &first, &second);
            printf("Area = %.2f\n", first * second); break;
        case 3:
            printf("Enter base and height: "); scanf("%lf %lf", &first, &second);
            printf("Area = %.2f\n", 0.5 * first * second); break;
        default: puts("Invalid choice.");
    }
    return 0;
}
