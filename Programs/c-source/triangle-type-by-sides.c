#include <stdio.h>

int main(void)
{
    int first, second, third;

    printf("Enter three side lengths: ");
    scanf("%d %d %d", &first, &second, &third);
    if (first <= 0 || second <= 0 || third <= 0 ||
        first + second <= third || first + third <= second || second + third <= first)
        printf("Invalid triangle\n");
    else if (first == second && second == third)
        printf("Equilateral triangle\n");
    else if (first == second || second == third || first == third)
        printf("Isosceles triangle\n");
    else
        printf("Scalene triangle\n");
    return 0;
}
