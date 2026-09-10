#include <stdio.h>
#include <string.h>

union Value { int integer; double decimal; char text[20]; };

int main(void)
{
    union Value value;
    value.integer = 42;
    printf("Integer = %d\n", value.integer);
    strcpy(value.text, "C language");
    printf("Text = %s\n", value.text);
    return 0;
}
