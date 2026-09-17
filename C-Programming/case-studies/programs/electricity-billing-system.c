#include <stdio.h>
#include <string.h>

#define NAME_SIZE 80
#define NUMBER_SIZE 24

typedef struct {
    double upperLimit;
    double rate;
} TariffSlab;

typedef struct {
    char consumerNumber[NUMBER_SIZE];
    char consumerName[NAME_SIZE];
    int previousReading;
    int currentReading;
    int units;
    double energyCharge;
    double fixedCharge;
    double surcharge;
    double total;
} ElectricityBill;

static const TariffSlab TARIFFS[] = {
    {100.0, 1.50},
    {200.0, 2.50},
    {500.0, 4.00},
    {-1.0, 6.00}
};

static const double FIXED_CHARGE = 75.0;
static const double SURCHARGE_THRESHOLD = 1500.0;
static const double SURCHARGE_RATE = 0.05;

static void discardLine(void) {
    int ch;
    while ((ch = getchar()) != '\n' && ch != EOF) {
        /* Discard the rest of an invalid input line. */
    }
}

static int readNonEmptyLine(const char *prompt, char *buffer, size_t size) {
    for (;;) {
        printf("%s", prompt);
        if (fgets(buffer, (int)size, stdin) == NULL) {
            return 0;
        }

        buffer[strcspn(buffer, "\n")] = '\0';
        if (buffer[0] != '\0') {
            return 1;
        }

        puts("Value cannot be empty. Please try again.");
    }
}

static int readNonNegativeInt(const char *prompt, int *value) {
    for (;;) {
        printf("%s", prompt);
        if (scanf("%d", value) == 1 && *value >= 0) {
            discardLine();
            return 1;
        }

        if (feof(stdin)) {
            return 0;
        }
        puts("Enter a whole number greater than or equal to zero.");
        discardLine();
    }
}

static double calculateEnergyCharge(int units) {
    double charge = 0.0;
    double lowerLimit = 0.0;
    size_t count = sizeof(TARIFFS) / sizeof(TARIFFS[0]);

    for (size_t i = 0; i < count && units > lowerLimit; ++i) {
        double slabUnits;

        if (TARIFFS[i].upperLimit < 0.0 || units < TARIFFS[i].upperLimit) {
            slabUnits = units - lowerLimit;
        } else {
            slabUnits = TARIFFS[i].upperLimit - lowerLimit;
        }

        charge += slabUnits * TARIFFS[i].rate;

        if (TARIFFS[i].upperLimit < 0.0 || units <= TARIFFS[i].upperLimit) {
            break;
        }
        lowerLimit = TARIFFS[i].upperLimit;
    }

    return charge;
}

static int prepareBill(ElectricityBill *bill) {
    if (bill->currentReading < bill->previousReading) {
        return 0;
    }

    bill->units = bill->currentReading - bill->previousReading;
    bill->energyCharge = calculateEnergyCharge(bill->units);
    bill->fixedCharge = FIXED_CHARGE;
    bill->surcharge = bill->energyCharge > SURCHARGE_THRESHOLD
        ? bill->energyCharge * SURCHARGE_RATE
        : 0.0;
    bill->total = bill->energyCharge + bill->fixedCharge + bill->surcharge;
    return 1;
}

static void printBill(const ElectricityBill *bill) {
    puts("\n============================================");
    puts("          CODEBHAVYA ELECTRICITY BILL       ");
    puts("============================================");
    printf("Consumer number : %s\n", bill->consumerNumber);
    printf("Consumer name   : %s\n", bill->consumerName);
    printf("Previous reading: %d units\n", bill->previousReading);
    printf("Current reading : %d units\n", bill->currentReading);
    printf("Units consumed  : %d units\n", bill->units);
    puts("--------------------------------------------");
    printf("Energy charge   : Rs. %10.2f\n", bill->energyCharge);
    printf("Fixed charge    : Rs. %10.2f\n", bill->fixedCharge);
    printf("Surcharge       : Rs. %10.2f\n", bill->surcharge);
    puts("--------------------------------------------");
    printf("Amount payable  : Rs. %10.2f\n", bill->total);
    puts("============================================");
}

int main(void) {
    ElectricityBill bill = {0};

    puts("Electricity Billing System");
    puts("Educational tariff: 0-100 @ 1.50, 101-200 @ 2.50,");
    puts("201-500 @ 4.00, above 500 @ 6.00 per unit.");

    if (!readNonEmptyLine("Consumer number: ", bill.consumerNumber,
                          sizeof(bill.consumerNumber)) ||
        !readNonEmptyLine("Consumer name: ", bill.consumerName,
                          sizeof(bill.consumerName)) ||
        !readNonNegativeInt("Previous meter reading: ", &bill.previousReading) ||
        !readNonNegativeInt("Current meter reading: ", &bill.currentReading)) {
        puts("Input ended before the bill could be prepared.");
        return 1;
    }

    if (!prepareBill(&bill)) {
        puts("Error: current reading cannot be less than previous reading.");
        return 1;
    }

    printBill(&bill);
    puts("Note: tariff values are fictional and intended for learning only.");
    return 0;
}
