#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char grade;
    printf("Enter grade (A-F): ");
    scanf(" %c", &grade);
    switch (toupper((unsigned char) grade)) {
        case 'A': puts("Excellent"); break;
        case 'B': puts("Very good"); break;
        case 'C': puts("Good"); break;
        case 'D': puts("Needs improvement"); break;
        case 'E': puts("Pass"); break;
        case 'F': puts("Fail"); break;
        default: puts("Invalid grade");
    }
    return 0;
}
