#include <stdio.h>

int main(void)
{
    double first, second, maximum;

    printf("Enter two numbers: ");
    scanf("%lf %lf", &first, &second);
    maximum = first > second ? first : second;
    printf("Maximum = %.2f\n", maximum);
    return 0;
}
