"""Persistent CSV expense tracker for the CodeBhavya case study."""

import csv
from collections import defaultdict
from dataclasses import dataclass
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from pathlib import Path

DATA_FILE = Path("expenses.csv")
FIELDS = ["date", "category", "description", "amount"]


@dataclass(frozen=True)
class Expense:
    spent_on: date
    category: str
    description: str
    amount: Decimal


def parse_date(text: str) -> date:
    return datetime.strptime(text.strip(), "%Y-%m-%d").date()


def parse_amount(text: str) -> Decimal:
    amount = Decimal(text.strip()).quantize(Decimal("0.01"))
    if amount <= 0:
        raise ValueError("Amount must be positive.")
    return amount


def load_expenses(path: Path = DATA_FILE) -> list[Expense]:
    if not path.exists():
        return []
    expenses = []
    with path.open("r", newline="", encoding="utf-8") as file:
        for line_number, row in enumerate(csv.DictReader(file), start=2):
            try:
                expenses.append(
                    Expense(
                        parse_date(row["date"]),
                        row["category"].strip(),
                        row["description"].strip(),
                        parse_amount(row["amount"]),
                    )
                )
            except (KeyError, ValueError, InvalidOperation) as error:
                print(f"Skipping invalid row {line_number}: {error}")
    return expenses


def append_expense(expense: Expense, path: Path = DATA_FILE) -> None:
    write_header = not path.exists() or path.stat().st_size == 0
    with path.open("a", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=FIELDS)
        if write_header:
            writer.writeheader()
        writer.writerow(
            {
                "date": expense.spent_on.isoformat(),
                "category": expense.category,
                "description": expense.description,
                "amount": f"{expense.amount:.2f}",
            }
        )


def add_expense() -> None:
    try:
        spent_on = parse_date(input("Date (YYYY-MM-DD): "))
        category = input("Category: ").strip().title()
        description = input("Description: ").strip()
        amount = parse_amount(input("Amount: Rs. "))
        if not category or not description:
            raise ValueError("Category and description cannot be empty.")
        expense = Expense(spent_on, category, description, amount)
        append_expense(expense)
        print("Expense saved.")
    except (ValueError, InvalidOperation) as error:
        print(f"Expense not saved: {error}")


def show_summary(expenses: list[Expense]) -> None:
    if not expenses:
        print("No valid expenses are stored.")
        return
    totals: dict[str, Decimal] = defaultdict(lambda: Decimal("0.00"))
    for expense in expenses:
        totals[expense.category] += expense.amount
    grand_total = sum(totals.values(), Decimal("0.00"))

    print("\nCategory summary")
    for category, amount in sorted(totals.items(), key=lambda item: (-item[1], item[0])):
        percentage = amount * 100 / grand_total
        print(f"{category:<18} Rs. {amount:>10,.2f}  {percentage:6.2f}%")
    print(f"{'TOTAL':<18} Rs. {grand_total:>10,.2f}")


def check_budget(expenses: list[Expense]) -> None:
    try:
        month = input("Month to analyse (YYYY-MM): ").strip()
        datetime.strptime(month, "%Y-%m")
        budget = parse_amount(input("Monthly budget: Rs. "))
    except (ValueError, InvalidOperation) as error:
        print(f"Cannot analyse budget: {error}")
        return
    spent = sum(
        (item.amount for item in expenses if item.spent_on.strftime("%Y-%m") == month),
        Decimal("0.00"),
    )
    remaining = budget - spent
    print(f"Spent: Rs. {spent:,.2f} | Budget: Rs. {budget:,.2f}")
    print(f"Remaining: Rs. {remaining:,.2f}" if remaining >= 0 else f"Over budget: Rs. {-remaining:,.2f}")


def main() -> None:
    print("CodeBhavya Expense Tracker")
    while True:
        print("\n1. Add expense\n2. List expenses\n3. Category summary\n4. Check monthly budget\n5. Exit")
        choice = input("Choose: ").strip()
        expenses = load_expenses()
        if choice == "1":
            add_expense()
        elif choice == "2":
            if not expenses:
                print("No valid expenses are stored.")
            for item in sorted(expenses, key=lambda expense: expense.spent_on):
                print(f"{item.spent_on} | {item.category:<15} | {item.description:<24} | Rs. {item.amount:,.2f}")
        elif choice == "3":
            show_summary(expenses)
        elif choice == "4":
            check_budget(expenses)
        elif choice == "5":
            print("Tracker closed.")
            break
        else:
            print("Choose a number from 1 to 5.")


if __name__ == "__main__":
    main()
