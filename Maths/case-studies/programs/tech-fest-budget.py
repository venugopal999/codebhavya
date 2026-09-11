"""CodeBhavya mathematics case study: tech-fest budget planning."""

from decimal import Decimal, ROUND_CEILING, ROUND_HALF_UP


MONEY = Decimal("0.01")


def money(value: Decimal) -> Decimal:
    return value.quantize(MONEY, rounding=ROUND_HALF_UP)


def allocate_by_ratio(total: Decimal, parts: dict[str, int]) -> dict[str, Decimal]:
    if total < 0 or not parts or any(value <= 0 for value in parts.values()):
        raise ValueError("total and ratio parts must be positive")
    denominator = sum(parts.values())
    allocation = {
        name: money(total * Decimal(part) / Decimal(denominator))
        for name, part in parts.items()
    }
    difference = money(total) - sum(allocation.values())
    last_name = next(reversed(allocation))
    allocation[last_name] += difference
    return allocation


def successive_discount(marked_price: Decimal,
                        discounts: list[Decimal]) -> Decimal:
    price = marked_price
    for percentage in discounts:
        if not Decimal("0") <= percentage < Decimal("100"):
            raise ValueError("each discount must be from 0 to below 100")
        price *= Decimal("1") - percentage / Decimal("100")
    return money(price)


def break_even_attendees(fixed_cost: Decimal, sponsor_income: Decimal,
                         ticket_price: Decimal,
                         variable_cost: Decimal) -> int:
    contribution = ticket_price - variable_cost
    remaining_fixed = fixed_cost - sponsor_income
    if contribution <= 0:
        raise ValueError("ticket contribution must be positive")
    if remaining_fixed <= 0:
        return 0
    return int(
        (remaining_fixed / contribution).to_integral_value(
            rounding=ROUND_CEILING
        )
    )


def scenario_profit(attendees: int, fixed_cost: Decimal,
                    sponsor_income: Decimal, ticket_price: Decimal,
                    variable_cost: Decimal) -> Decimal:
    if attendees < 0:
        raise ValueError("attendees cannot be negative")
    revenue = sponsor_income + ticket_price * attendees
    cost = fixed_cost + variable_cost * attendees
    return money(revenue - cost)


def main() -> None:
    budget = Decimal("300000")
    reserve_rate = Decimal("12")
    reserve = money(budget * reserve_rate / Decimal("100"))
    usable = budget - reserve
    allocation = allocate_by_ratio(
        usable,
        {"Technical events": 5, "Infrastructure": 3, "Publicity": 2},
    )

    marked_vendor_price = Decimal("150000")
    final_vendor_price = successive_discount(
        marked_vendor_price, [Decimal("12"), Decimal("5")]
    )
    discount_equivalent = money(
        (marked_vendor_price - final_vendor_price)
        / marked_vendor_price
        * Decimal("100")
    )

    fixed_cost = Decimal("120000")
    sponsor_income = Decimal("40000")
    ticket_price = Decimal("350")
    variable_cost = Decimal("180")
    break_even = break_even_attendees(
        fixed_cost, sponsor_income, ticket_price, variable_cost
    )

    print("CodeBhavya Tech-Fest Budget & Break-Even Planner")
    print(f"Total budget              : ₹{money(budget):,.2f}")
    print(f"Emergency reserve (12%)   : ₹{reserve:,.2f}")
    print(f"Usable budget             : ₹{money(usable):,.2f}")
    print("\nUsable budget in ratio 5:3:2")
    for category, amount in allocation.items():
        print(f"{category:<24}: ₹{amount:,.2f}")
    print("\nSuccessive vendor discounts: 12% then 5%")
    print(f"Final vendor price        : ₹{final_vendor_price:,.2f}")
    print(f"Equivalent single discount: {discount_equivalent}%")
    print(f"\nBreak-even attendance     : {break_even}")
    for attendees in (200, break_even, 300, 450):
        result = scenario_profit(
            attendees, fixed_cost, sponsor_income, ticket_price, variable_cost
        )
        status = "profit" if result > 0 else "loss" if result < 0 else "break-even"
        print(f"{attendees:>3} attendees → {status:<10} ₹{abs(result):,.2f}")


if __name__ == "__main__":
    main()
