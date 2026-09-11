#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define TEXT_SIZE 100

typedef struct Page {
    char title[TEXT_SIZE];
    char url[TEXT_SIZE];
    struct Page *previous;
    struct Page *next;
} Page;

static void discardLine(void) {
    int ch;
    while ((ch = getchar()) != '\n' && ch != EOF) { }
}

static int readInt(const char *prompt, int *value) {
    printf("%s", prompt);
    if (scanf("%d", value) != 1) {
        discardLine();
        puts("Invalid number.");
        return 0;
    }
    discardLine();
    return 1;
}

static void readLine(const char *prompt, char *text, size_t size) {
    printf("%s", prompt);
    if (fgets(text, (int)size, stdin)) text[strcspn(text, "\n")] = '\0';
}

static Page *createPage(const char *title, const char *url) {
    Page *page = malloc(sizeof *page);
    if (page == NULL) return NULL;
    snprintf(page->title, sizeof page->title, "%s", title);
    snprintf(page->url, sizeof page->url, "%s", url);
    page->previous = NULL;
    page->next = NULL;
    return page;
}

static void deleteForwardHistory(Page *current) {
    Page *node = current ? current->next : NULL;
    while (node != NULL) {
        Page *next = node->next;
        free(node);
        node = next;
    }
    if (current) current->next = NULL;
}

static void visit(Page **first, Page **current) {
    char title[TEXT_SIZE], url[TEXT_SIZE];
    Page *page;
    readLine("Page title: ", title, sizeof title);
    readLine("URL: ", url, sizeof url);
    if (title[0] == '\0' || url[0] == '\0') {
        puts("Title and URL are required.");
        return;
    }
    page = createPage(title, url);
    if (page == NULL) {
        puts("Memory allocation failed.");
        return;
    }
    if (*current == NULL) {
        *first = *current = page;
    } else {
        deleteForwardHistory(*current);
        page->previous = *current;
        (*current)->next = page;
        *current = page;
    }
    printf("Opened: %s [%s]\n", page->title, page->url);
}

static void moveBack(Page **current) {
    if (*current == NULL || (*current)->previous == NULL) {
        puts("No previous page.");
        return;
    }
    *current = (*current)->previous;
    printf("Back to: %s [%s]\n", (*current)->title, (*current)->url);
}

static void moveForward(Page **current) {
    if (*current == NULL || (*current)->next == NULL) {
        puts("No forward page.");
        return;
    }
    *current = (*current)->next;
    printf("Forward to: %s [%s]\n", (*current)->title, (*current)->url);
}

static void showCurrent(const Page *current) {
    if (current == NULL) puts("No page is open.");
    else printf("Current: %s [%s]\n", current->title, current->url);
}

static void showHistory(const Page *first, const Page *current) {
    int position = 1;
    if (first == NULL) {
        puts("History is empty.");
        return;
    }
    puts("\nCOMPLETE HISTORY");
    while (first != NULL) {
        printf("%s %d. %s [%s]\n", first == current ? "->" : "  ",
               position++, first->title, first->url);
        first = first->next;
    }
}

static void clearHistory(Page **first, Page **current) {
    Page *node = *first;
    while (node != NULL) {
        Page *next = node->next;
        free(node);
        node = next;
    }
    *first = *current = NULL;
}

static void menu(void) {
    puts("\n=== BROWSER HISTORY ===");
    puts("1. Visit new page");
    puts("2. Back");
    puts("3. Forward");
    puts("4. Show current page");
    puts("5. Show complete history");
    puts("6. Clear history");
    puts("7. Exit");
}

int main(void) {
    Page *first = NULL;
    Page *current = NULL;
    int choice;
    for (;;) {
        menu();
        if (!readInt("Choose (1-7): ", &choice)) continue;
        switch (choice) {
            case 1: visit(&first, &current); break;
            case 2: moveBack(&current); break;
            case 3: moveForward(&current); break;
            case 4: showCurrent(current); break;
            case 5: showHistory(first, current); break;
            case 6: clearHistory(&first, &current); puts("History cleared."); break;
            case 7: clearHistory(&first, &current); puts("Browser closed."); return 0;
            default: puts("Choose a number from 1 to 7.");
        }
    }
}
