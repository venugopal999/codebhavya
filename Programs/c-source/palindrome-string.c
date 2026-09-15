#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[200];
    int palindrome = 1;

    fgets(text, sizeof text, stdin);
    text[strcspn(text, "\n")] = '\0';
    int left = 0, right = (int) strlen(text) - 1;
    while (left < right) {
        if (text[left] != text[right]) { palindrome = 0; break; }
        left++; right--;
    }
    printf(palindrome ? "Palindrome\n" : "Not a palindrome\n");
    return 0;
}
