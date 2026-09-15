#include <stdio.h>

int main(void)
{
    double kilometres;

    printf("Enter distance in kilometres: ");
    scanf("%lf", &kilometres);
    printf("Miles = %.3f\n", kilometres * 0.621371);
    return 0;
}
