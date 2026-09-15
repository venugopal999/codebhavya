#include <stdio.h>

int main(void)
{
    int choice;
    double balance = 1000.0, amount;
    printf("1. Deposit  2. Withdraw  3. Balance\nChoose: ");
    scanf("%d", &choice);
    switch (choice) {
        case 1:
            printf("Enter amount: "); scanf("%lf", &amount);
            if (amount > 0) balance += amount;
            else { puts("Invalid amount."); return 0; }
            break;
        case 2:
            printf("Enter amount: "); scanf("%lf", &amount);
            if (amount > 0 && amount <= balance) balance -= amount;
            else { puts("Invalid amount or insufficient balance."); return 0; }
            break;
        case 3: break;
        default: puts("Invalid choice."); return 0;
    }
    printf("Balance = %.2f\n", balance);
    return 0;
}
