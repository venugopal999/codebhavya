#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define DATA_FILE "students.dat"
#define TEMP_FILE "students.tmp"
#define NAME_SIZE 60
#define BRANCH_SIZE 20

typedef struct {
    int id;
    char name[NAME_SIZE];
    char branch[BRANCH_SIZE];
    float cgpa;
} Student;

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

static int readFloat(const char *prompt, float *value) {
    printf("%s", prompt);
    if (scanf("%f", value) != 1) {
        discardLine();
        puts("Invalid decimal value.");
        return 0;
    }
    discardLine();
    return 1;
}

static void readLine(const char *prompt, char *text, size_t size) {
    printf("%s", prompt);
    if (fgets(text, (int)size, stdin) != NULL) {
        text[strcspn(text, "\n")] = '\0';
    }
}

static int validStudent(const Student *s) {
    return s->id > 0 && s->name[0] != '\0' && s->branch[0] != '\0'
           && s->cgpa >= 0.0f && s->cgpa <= 10.0f;
}

static int idExists(int id) {
    FILE *file = fopen(DATA_FILE, "rb");
    Student s;
    if (file == NULL) return 0;
    while (fread(&s, sizeof s, 1, file) == 1) {
        if (s.id == id) {
            fclose(file);
            return 1;
        }
    }
    fclose(file);
    return 0;
}

static void addStudent(void) {
    Student s;
    FILE *file;
    if (!readInt("Student ID: ", &s.id)) return;
    if (idExists(s.id)) {
        puts("That ID already exists.");
        return;
    }
    readLine("Full name: ", s.name, sizeof s.name);
    readLine("Branch: ", s.branch, sizeof s.branch);
    if (!readFloat("CGPA (0-10): ", &s.cgpa)) return;
    if (!validStudent(&s)) {
        puts("Rejected: check ID, text fields and CGPA range.");
        return;
    }
    file = fopen(DATA_FILE, "ab");
    if (file == NULL) {
        perror("Cannot open database");
        return;
    }
    if (fwrite(&s, sizeof s, 1, file) == 1)
        puts("Student added successfully.");
    else
        puts("Write failed.");
    fclose(file);
}

static void printStudent(const Student *s) {
    printf("%-6d %-28s %-12s %.2f\n", s->id, s->name, s->branch, s->cgpa);
}

static void listStudents(void) {
    FILE *file = fopen(DATA_FILE, "rb");
    Student s;
    int count = 0;
    if (file == NULL) {
        puts("No student records yet.");
        return;
    }
    puts("ID     NAME                         BRANCH       CGPA");
    puts("-----------------------------------------------------");
    while (fread(&s, sizeof s, 1, file) == 1) {
        printStudent(&s);
        count++;
    }
    printf("Total records: %d\n", count);
    fclose(file);
}

static void searchStudent(void) {
    FILE *file;
    Student s;
    int target;
    if (!readInt("ID to search: ", &target)) return;
    file = fopen(DATA_FILE, "rb");
    if (file == NULL) {
        puts("No student records yet.");
        return;
    }
    while (fread(&s, sizeof s, 1, file) == 1) {
        if (s.id == target) {
            puts("ID     NAME                         BRANCH       CGPA");
            printStudent(&s);
            fclose(file);
            return;
        }
    }
    puts("Student not found.");
    fclose(file);
}

static int replaceDatabase(FILE *source, FILE *temp) {
    if (fclose(source) != 0 || fclose(temp) != 0) return 0;
    if (remove(DATA_FILE) != 0) return 0;
    return rename(TEMP_FILE, DATA_FILE) == 0;
}

static void updateStudent(void) {
    FILE *source;
    FILE *temp;
    Student s;
    int target;
    int found = 0;
    if (!readInt("ID to update: ", &target)) return;
    source = fopen(DATA_FILE, "rb");
    if (source == NULL) {
        puts("No student records yet.");
        return;
    }
    temp = fopen(TEMP_FILE, "wb");
    if (temp == NULL) {
        fclose(source);
        perror("Cannot create temporary file");
        return;
    }
    while (fread(&s, sizeof s, 1, source) == 1) {
        if (s.id == target) {
            found = 1;
            readLine("New full name: ", s.name, sizeof s.name);
            readLine("New branch: ", s.branch, sizeof s.branch);
            if (!readFloat("New CGPA (0-10): ", &s.cgpa) || !validStudent(&s)) {
                puts("Update cancelled: invalid data.");
                fclose(source);
                fclose(temp);
                remove(TEMP_FILE);
                return;
            }
        }
        fwrite(&s, sizeof s, 1, temp);
    }
    if (!found) {
        fclose(source);
        fclose(temp);
        remove(TEMP_FILE);
        puts("Student not found.");
        return;
    }
    puts(replaceDatabase(source, temp) ? "Student updated." : "Database replacement failed.");
}

static void deleteStudent(void) {
    FILE *source;
    FILE *temp;
    Student s;
    int target;
    int found = 0;
    if (!readInt("ID to delete: ", &target)) return;
    source = fopen(DATA_FILE, "rb");
    if (source == NULL) {
        puts("No student records yet.");
        return;
    }
    temp = fopen(TEMP_FILE, "wb");
    if (temp == NULL) {
        fclose(source);
        perror("Cannot create temporary file");
        return;
    }
    while (fread(&s, sizeof s, 1, source) == 1) {
        if (s.id == target) found = 1;
        else fwrite(&s, sizeof s, 1, temp);
    }
    if (!found) {
        fclose(source);
        fclose(temp);
        remove(TEMP_FILE);
        puts("Student not found.");
        return;
    }
    puts(replaceDatabase(source, temp) ? "Student deleted." : "Database replacement failed.");
}

static void menu(void) {
    puts("\n=== STUDENT RECORD MANAGEMENT ===");
    puts("1. Add student");
    puts("2. List students");
    puts("3. Search by ID");
    puts("4. Update student");
    puts("5. Delete student");
    puts("6. Exit");
}

int main(void) {
    int choice;
    for (;;) {
        menu();
        if (!readInt("Choose (1-6): ", &choice)) continue;
        switch (choice) {
            case 1: addStudent(); break;
            case 2: listStudents(); break;
            case 3: searchStudent(); break;
            case 4: updateStudent(); break;
            case 5: deleteStudent(); break;
            case 6: puts("Goodbye!"); return 0;
            default: puts("Choose a number from 1 to 6.");
        }
    }
}
