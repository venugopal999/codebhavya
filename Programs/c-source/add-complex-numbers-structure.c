#include <stdio.h>

struct Complex
{
    double real;
    double imaginary;
};

struct Complex add(struct Complex first, struct Complex second)
{
    struct Complex result = {first.real + second.real, first.imaginary + second.imaginary};
    return result;
}

int main(void)
{
    struct Complex first, second, result;

    printf("Enter real and imaginary parts of first number: ");
    scanf("%lf %lf", &first.real, &first.imaginary);
    printf("Enter real and imaginary parts of second number: ");
    scanf("%lf %lf", &second.real, &second.imaginary);
    result = add(first, second);
    printf("Sum = %.2f %c %.2fi\n", result.real,
           result.imaginary < 0 ? '-' : '+', result.imaginary < 0 ? -result.imaginary : result.imaginary);
    return 0;
}
