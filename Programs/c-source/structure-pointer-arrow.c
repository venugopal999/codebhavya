#include <stdio.h>

struct Book { char title[40]; double price; };

int main(void)
{
    struct Book book = {"C Fundamentals", 450.0};
    struct Book *pointer = &book;
    printf("%s costs %.2f\n", pointer->title, pointer->price);
    return 0;
}
