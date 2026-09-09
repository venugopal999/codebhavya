#include <stdio.h>
#include <math.h>

int main(void)
{
    double a, b, c, discriminant, firstRoot, secondRoot;

    printf("Enter coefficients a, b and c: ");
    scanf("%lf %lf %lf", &a, &b, &c);
    if (a == 0) {
        printf("The equation is not quadratic.\n");
        return 0;
    }
    discriminant = b * b - 4.0 * a * c;
    if (discriminant > 0) {
        firstRoot = (-b + sqrt(discriminant)) / (2.0 * a);
        secondRoot = (-b - sqrt(discriminant)) / (2.0 * a);
        printf("Roots = %.2f and %.2f\n", firstRoot, secondRoot);
    } else if (discriminant == 0) {
        printf("Repeated root = %.2f\n", -b / (2.0 * a));
    } else {
        printf("Complex roots: %.2f + %.2fi and %.2f - %.2fi\n",
               -b / (2.0 * a), sqrt(-discriminant) / (2.0 * a),
               -b / (2.0 * a), sqrt(-discriminant) / (2.0 * a));
    }
    return 0;
}
