#include <stdio.h>

int main(void)
{
    FILE *first = fopen("first.txt", "w");
    FILE *second = fopen("second.txt", "w");
    if (first == NULL || second == NULL) return 1;
    fputs("CodeBhavya\n", first); fputs("CodeBhavya\n", second);
    fclose(first); fclose(second);
    first = fopen("first.txt", "r"); second = fopen("second.txt", "r");
    if (first == NULL || second == NULL) return 1;
    int left, right;
    do {
        left = fgetc(first); right = fgetc(second);
        if (left != right) break;
    } while (left != EOF);
    puts(left == right ? "Files are identical." : "Files are different.");
    fclose(first); fclose(second);
    return 0;
}
