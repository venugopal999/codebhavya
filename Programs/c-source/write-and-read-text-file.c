#include <stdio.h>

int main(void)
{
    char message[300], stored[300];

    printf("Enter a message: ");
    fgets(message, sizeof message, stdin);
    FILE *file = fopen("message.txt", "w");
    if (file == NULL) { perror("message.txt"); return 1; }
    fputs(message, file);
    fclose(file);

    file = fopen("message.txt", "r");
    if (file == NULL) { perror("message.txt"); return 1; }
    if (fgets(stored, sizeof stored, file) != NULL) printf("Stored message: %s", stored);
    fclose(file);
    return 0;
}
