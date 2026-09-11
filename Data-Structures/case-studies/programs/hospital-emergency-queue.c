#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define NAME_SIZE 60

typedef struct Patient {
    int token;
    char name[NAME_SIZE];
    int age;
    int priority;
    unsigned long arrivalOrder;
    struct Patient *next;
} Patient;

static unsigned long nextArrival = 1;
static int nextToken = 1001;

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

static const char *priorityName(int priority) {
    static const char *names[] = {"", "Critical", "Emergency", "Urgent", "Standard"};
    return priority >= 1 && priority <= 4 ? names[priority] : "Unknown";
}

static int comesBefore(const Patient *a, const Patient *b) {
    if (a->priority != b->priority) return a->priority < b->priority;
    return a->arrivalOrder < b->arrivalOrder;
}

static void enqueue(Patient **front, Patient *patient) {
    Patient **position = front;
    while (*position != NULL && !comesBefore(patient, *position))
        position = &(*position)->next;
    patient->next = *position;
    *position = patient;
}

static void registerPatient(Patient **front) {
    Patient *patient = malloc(sizeof *patient);
    if (patient == NULL) {
        puts("Memory allocation failed.");
        return;
    }
    patient->token = nextToken++;
    patient->arrivalOrder = nextArrival++;
    patient->next = NULL;
    readLine("Patient name: ", patient->name, sizeof patient->name);
    if (!readInt("Age: ", &patient->age) ||
        !readInt("Priority (1 Critical, 2 Emergency, 3 Urgent, 4 Standard): ",
                 &patient->priority)) {
        free(patient);
        return;
    }
    if (patient->name[0] == '\0' || patient->age < 0 || patient->age > 130 ||
        patient->priority < 1 || patient->priority > 4) {
        puts("Rejected: check name, age and priority range.");
        free(patient);
        return;
    }
    enqueue(front, patient);
    printf("Registered token %d as %s priority.\n",
           patient->token, priorityName(patient->priority));
}

static void callNext(Patient **front) {
    Patient *patient;
    if (*front == NULL) {
        puts("No patients are waiting.");
        return;
    }
    patient = *front;
    *front = patient->next;
    printf("Calling token %d: %s (%s)\n", patient->token, patient->name,
           priorityName(patient->priority));
    free(patient);
}

static void peekNext(const Patient *front) {
    if (front == NULL) puts("No patients are waiting.");
    else printf("Next: token %d, %s, age %d, %s\n", front->token,
                front->name, front->age, priorityName(front->priority));
}

static void displayQueue(const Patient *front) {
    int position = 1;
    int counts[5] = {0};
    if (front == NULL) {
        puts("No patients are waiting.");
        return;
    }
    puts("POS  TOKEN   NAME                         AGE  PRIORITY");
    puts("-----------------------------------------------------------");
    while (front != NULL) {
        printf("%-4d %-7d %-28s %-4d %s\n", position++, front->token,
               front->name, front->age, priorityName(front->priority));
        counts[front->priority]++;
        front = front->next;
    }
    printf("Waiting: Critical %d | Emergency %d | Urgent %d | Standard %d\n",
           counts[1], counts[2], counts[3], counts[4]);
}

static void freeQueue(Patient *front) {
    while (front != NULL) {
        Patient *next = front->next;
        free(front);
        front = next;
    }
}

static void menu(void) {
    puts("\n=== HOSPITAL EMERGENCY QUEUE ===");
    puts("1. Register patient");
    puts("2. Call next patient");
    puts("3. View next patient");
    puts("4. Display waiting queue");
    puts("5. Exit");
}

int main(void) {
    Patient *front = NULL;
    int choice;
    for (;;) {
        menu();
        if (!readInt("Choose (1-5): ", &choice)) continue;
        switch (choice) {
            case 1: registerPatient(&front); break;
            case 2: callNext(&front); break;
            case 3: peekNext(front); break;
            case 4: displayQueue(front); break;
            case 5: freeQueue(front); puts("Queue closed safely."); return 0;
            default: puts("Choose a number from 1 to 5.");
        }
    }
}
