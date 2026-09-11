"""CodeBhavya loan amortization calculator (educational example)."""

from dataclasses import dataclass


@dataclass
class LoanSummary:
    months: int
    scheduled_payment: float
    total_paid: float
    total_interest: float
    schedule: list[tuple[int, float, float, float, float]]


def monthly_payment(principal: float, annual_rate: float, years: int) -> float:
    months = years * 12
    monthly_rate = annual_rate / 1200
    if monthly_rate == 0:
        return principal / months
    factor = (1 + monthly_rate) ** months
    return principal * monthly_rate * factor / (factor - 1)


def amortize(
    principal: float, annual_rate: float, years: int, extra_payment: float = 0
) -> LoanSummary:
    rate = annual_rate / 1200
    scheduled = monthly_payment(principal, annual_rate, years)
    balance = principal
    total_paid = 0.0
    schedule = []
    month = 0

    while balance > 0.005:
        month += 1
        interest = balance * rate
        planned = scheduled + extra_payment
        payment = min(planned, balance + interest)
        principal_part = payment - interest
        balance = max(0.0, balance - principal_part)
        total_paid += payment
        schedule.append((month, payment, principal_part, interest, balance))

        if month > years * 12 + 1200:
            raise RuntimeError("The loan is not reducing; check the inputs.")

    return LoanSummary(
        months=month,
        scheduled_payment=scheduled,
        total_paid=total_paid,
        total_interest=total_paid - principal,
        schedule=schedule,
    )


def money(value: float) -> str:
    return f"Rs. {value:,.2f}"


def read_float(prompt: str, minimum: float, allow_equal: bool = False) -> float:
    while True:
        try:
            value = float(input(prompt))
            valid = value >= minimum if allow_equal else value > minimum
            if valid:
                return value
        except ValueError:
            pass
        relation = "at least" if allow_equal else "greater than"
        print(f"Enter a number {relation} {minimum}.")


def read_int(prompt: str, minimum: int, maximum: int) -> int:
    while True:
        try:
            value = int(input(prompt))
            if minimum <= value <= maximum:
                return value
        except ValueError:
            pass
        print(f"Enter a whole number from {minimum} to {maximum}.")


def main() -> None:
    print("CodeBhavya Loan Calculator")
    print("Educational estimate using monthly reducing-balance amortization.\n")
    principal = read_float("Loan principal: Rs. ", 0)
    annual_rate = read_float("Annual interest rate (%): ", 0, allow_equal=True)
    years = read_int("Loan term in whole years (1-50): ", 1, 50)
    extra = read_float("Optional extra monthly payment (0 for none): Rs. ", 0, True)

    regular = amortize(principal, annual_rate, years)
    chosen = amortize(principal, annual_rate, years, extra)

    print("\n--- Loan Summary ---")
    print(f"Scheduled EMI       : {money(regular.scheduled_payment)}")
    print(f"Regular payoff      : {regular.months} months")
    print(f"Regular interest    : {money(regular.total_interest)}")
    print(f"Chosen payoff       : {chosen.months} months")
    print(f"Chosen total paid   : {money(chosen.total_paid)}")
    print(f"Chosen interest     : {money(chosen.total_interest)}")
    print(f"Months saved        : {regular.months - chosen.months}")
    print(f"Interest saved      : {money(regular.total_interest - chosen.total_interest)}")

    print("\nFirst 12 payments (or complete shorter schedule):")
    print("Month | Payment       | Principal     | Interest      | Balance")
    for month, payment, principal_part, interest, balance in chosen.schedule[:12]:
        print(
            f"{month:5d} | {payment:13,.2f} | {principal_part:13,.2f} | "
            f"{interest:13,.2f} | {balance:,.2f}"
        )
    if chosen.months > 12:
        last = chosen.schedule[-1]
        print("  ... | ...")
        print(
            f"{last[0]:5d} | {last[1]:13,.2f} | {last[2]:13,.2f} | "
            f"{last[3]:13,.2f} | {last[4]:,.2f}"
        )

    print("\nActual lender charges, compounding, rounding and regulations may differ.")


if __name__ == "__main__":
    main()
