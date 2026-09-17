#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define INVENTORY_FILE "inventory.txt"
#define NAME_SIZE 50

typedef struct Product {
    int id;
    char name[NAME_SIZE];
    int quantity;
    int reorderLevel;
    double unitPrice;
    struct Product *next;
} Product;

static void discardLine(void) {
    int ch;
    while ((ch = getchar()) != '\n' && ch != EOF) { }
}

static int readInt(const char *prompt, int *value) {
    printf("%s", prompt);
    if (scanf("%d", value) != 1) { discardLine(); puts("Invalid number."); return 0; }
    discardLine();
    return 1;
}

static int readDouble(const char *prompt, double *value) {
    printf("%s", prompt);
    if (scanf("%lf", value) != 1) { discardLine(); puts("Invalid price."); return 0; }
    discardLine();
    return 1;
}

static void readLine(const char *prompt, char *text, size_t size) {
    printf("%s", prompt);
    if (fgets(text, (int)size, stdin)) text[strcspn(text, "\n")] = '\0';
}

static Product *findProduct(Product *head, int id) {
    while (head != NULL && head->id != id) head = head->next;
    return head;
}

static Product *newProduct(int id, const char *name, int quantity,
                           int reorderLevel, double unitPrice) {
    Product *item = malloc(sizeof *item);
    if (item == NULL) return NULL;
    item->id = id;
    snprintf(item->name, sizeof item->name, "%s", name);
    item->quantity = quantity;
    item->reorderLevel = reorderLevel;
    item->unitPrice = unitPrice;
    item->next = NULL;
    return item;
}

static int insertSorted(Product **head, Product *item) {
    Product **current = head;
    if (findProduct(*head, item->id) != NULL) return 0;
    while (*current != NULL && (*current)->id < item->id) current = &(*current)->next;
    item->next = *current;
    *current = item;
    return 1;
}

static void addProduct(Product **head) {
    int id, quantity, reorder;
    double price;
    char name[NAME_SIZE];
    Product *item;
    if (!readInt("Product ID: ", &id)) return;
    if (findProduct(*head, id)) { puts("That product ID already exists."); return; }
    readLine("Product name: ", name, sizeof name);
    if (!readInt("Opening quantity: ", &quantity) ||
        !readInt("Reorder level: ", &reorder) ||
        !readDouble("Unit price: ", &price)) return;
    if (id <= 0 || name[0] == '\0' || quantity < 0 || reorder < 0 || price < 0) {
        puts("Rejected: values cannot be empty or negative.");
        return;
    }
    item = newProduct(id, name, quantity, reorder, price);
    if (item == NULL) { puts("Memory allocation failed."); return; }
    insertSorted(head, item);
    puts("Product added.");
}

static void changeStock(Product *head, int selling) {
    int id, units;
    Product *item;
    if (!readInt("Product ID: ", &id) || !readInt("Units: ", &units)) return;
    if (units <= 0) { puts("Units must be positive."); return; }
    item = findProduct(head, id);
    if (item == NULL) { puts("Product not found."); return; }
    if (selling) {
        if (units > item->quantity) { puts("Sale rejected: insufficient stock."); return; }
        item->quantity -= units;
        printf("Sale value: %.2f\n", units * item->unitPrice);
    } else {
        item->quantity += units;
    }
    printf("New quantity: %d%s\n", item->quantity,
           item->quantity <= item->reorderLevel ? "  [REORDER REQUIRED]" : "");
}

static void report(const Product *head, int lowOnly) {
    double totalValue = 0.0;
    int shown = 0;
    puts("ID     PRODUCT                        QTY   REORDER   PRICE      VALUE");
    puts("---------------------------------------------------------------------");
    while (head != NULL) {
        if (!lowOnly || head->quantity <= head->reorderLevel) {
            double value = head->quantity * head->unitPrice;
            printf("%-6d %-30s %-5d %-9d %9.2f %10.2f\n",
                   head->id, head->name, head->quantity, head->reorderLevel,
                   head->unitPrice, value);
            totalValue += value;
            shown++;
        }
        head = head->next;
    }
    if (!shown) puts(lowOnly ? "No products need reordering." : "Inventory is empty.");
    else printf("Displayed value: %.2f\n", totalValue);
}

static int saveInventory(const Product *head) {
    FILE *file = fopen(INVENTORY_FILE, "w");
    if (file == NULL) return 0;
    while (head != NULL) {
        fprintf(file, "%d|%s|%d|%d|%.2f\n", head->id, head->name,
                head->quantity, head->reorderLevel, head->unitPrice);
        head = head->next;
    }
    return fclose(file) == 0;
}

static void loadInventory(Product **head) {
    FILE *file = fopen(INVENTORY_FILE, "r");
    char line[160], name[NAME_SIZE];
    int id, quantity, reorder;
    double price;
    if (file == NULL) return;
    while (fgets(line, sizeof line, file)) {
        if (sscanf(line, "%d|%49[^|]|%d|%d|%lf", &id, name, &quantity, &reorder, &price) == 5) {
            Product *item = newProduct(id, name, quantity, reorder, price);
            if (item == NULL) break;
            if (!insertSorted(head, item)) free(item);
        }
    }
    fclose(file);
}

static void freeInventory(Product *head) {
    while (head != NULL) {
        Product *next = head->next;
        free(head);
        head = next;
    }
}

static void menu(void) {
    puts("\n=== INVENTORY & REORDER SYSTEM ===");
    puts("1. Add product       2. Receive stock");
    puts("3. Record sale       4. Full inventory report");
    puts("5. Reorder report    6. Save and exit");
}

int main(void) {
    Product *inventory = NULL;
    int choice;
    loadInventory(&inventory);
    for (;;) {
        menu();
        if (!readInt("Choose (1-6): ", &choice)) continue;
        switch (choice) {
            case 1: addProduct(&inventory); break;
            case 2: changeStock(inventory, 0); break;
            case 3: changeStock(inventory, 1); break;
            case 4: report(inventory, 0); break;
            case 5: report(inventory, 1); break;
            case 6:
                puts(saveInventory(inventory) ? "Inventory saved." : "Save failed.");
                freeInventory(inventory);
                return 0;
            default: puts("Choose a number from 1 to 6.");
        }
    }
}
