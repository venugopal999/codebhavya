#include <stdio.h>

int main(void)
{
    double first, second, result;
    char operator;

    printf("Enter an expression (example: 18 + 6): ");
    scanf("%lf %c %lf", &first, &operator, &second);
    switch (operator) {
        case '+': result = first + second; break;
        case '-': result = first - second; break;
        case '*': result = first * second; break;
        case '/':
            if (second == 0) { printf("Division by zero is not allowed.\n"); return 0; }
            result = first / second;
            break;
        default: printf("Invalid operator.\n"); return 0;
    }
    printf("Result = %.2f\n", result);
    return 0;
}
