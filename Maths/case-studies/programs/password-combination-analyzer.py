"""Count password search spaces with optional category requirements."""

from itertools import combinations
from math import factorial, log2


def arrangements(alphabet_size: int, length: int, repetition: bool) -> int:
    if alphabet_size < 0 or length < 0:
        return 0
    if repetition:
        return alphabet_size**length
    if length > alphabet_size:
        return 0
    return factorial(alphabet_size) // factorial(alphabet_size - length)


def requiring_every_category(
    category_sizes: list[int], length: int, repetition: bool
) -> int:
    """Inclusion-exclusion: subtract strings missing selected categories."""
    total_alphabet = sum(category_sizes)
    answer = 0
    indexes = range(len(category_sizes))
    for omitted_count in range(len(category_sizes) + 1):
        for omitted in combinations(indexes, omitted_count):
            available = total_alphabet - sum(category_sizes[i] for i in omitted)
            term = arrangements(available, length, repetition)
            answer += term if omitted_count % 2 == 0 else -term
    return answer


def human_time(seconds: float) -> str:
    units = [
        (60, "seconds"),
        (60, "minutes"),
        (24, "hours"),
        (365.25, "days"),
    ]
    value = seconds
    label = "seconds"
    for divisor, next_label in units:
        label = next_label
        if value < divisor:
            break
        value /= divisor
    if label == "days" and value >= 365.25:
        value /= 365.25
        label = "years"
    return f"{value:,.3g} {label}"


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
    print("CodeBhavya Password Combination Analyzer")
    print("Counts mathematical search spaces; it does not rate a real password.\n")

    category_sizes = []
    for name, size in [("lowercase", 26), ("uppercase", 26), ("digits", 10), ("special symbols", 10)]:
        choice = input(f"Include {name} ({size} characters)? [y/n]: ").strip().lower()
        if choice == "y":
            category_sizes.append(size)

    if not category_sizes:
        print("Choose at least one character category.")
        return

    length = read_int("Password length (1-64): ", 1, 64)
    repetition = input("Allow a character to repeat? [y/n]: ").strip().lower() == "y"
    require_all = input("Require at least one from every selected category? [y/n]: ").strip().lower() == "y"
    guesses_per_second = read_int("Assumed guesses per second (1-1,000,000,000): ", 1, 1_000_000_000)

    alphabet = sum(category_sizes)
    unrestricted = arrangements(alphabet, length, repetition)
    valid = (
        requiring_every_category(category_sizes, length, repetition)
        if require_all
        else unrestricted
    )
    entropy = log2(valid) if valid > 0 else 0.0
    average_guesses = valid / 2

    print("\n--- Search-Space Analysis ---")
    print(f"Selected alphabet size : {alphabet}")
    print(f"Unrestricted strings   : {unrestricted:,}")
    print(f"Policy-valid strings   : {valid:,}")
    print(f"Information measure    : {entropy:.2f} bits (uniform-choice assumption)")
    print(f"Average exhaustive work: {average_guesses:,.0f} guesses")
    print(f"Average time estimate  : {human_time(average_guesses / guesses_per_second)}")
    print(f"Worst-case estimate    : {human_time(valid / guesses_per_second)}")

    if valid == 0:
        print("The selected constraints are impossible for this length.")
    print("\nSecurity note: real strength also depends on randomness, attacker model,")
    print("hashing, leaked patterns, rate limits and multi-factor authentication.")


if __name__ == "__main__":
    main()
