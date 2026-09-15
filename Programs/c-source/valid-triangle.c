#include <stdio.h>

int main(void)
{
    double first, second, third;

    printf("Enter three side lengths: ");
    scanf("%lf %lf %lf", &first, &second, &third);
    if (first > 0 && second > 0 && third > 0 &&
        first + second > third && first + third > second && second + third > first)
        printf("Valid triangle\n");
    else
        printf("Invalid triangle\n");
    return 0;
}
