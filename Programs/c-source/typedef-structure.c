#include <stdio.h>

typedef struct {
    int id;
    char name[30];
    double price;
} Product;

int main(void)
{
    Product item = {501, "Keyboard", 899.0};
    printf("%d %s %.2f\n", item.id, item.name, item.price);
    return 0;
}
