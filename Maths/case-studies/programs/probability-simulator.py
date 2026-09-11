"""Compare binomial theory with a reproducible Monte Carlo simulation."""

from math import comb
from random import Random


def binomial_exact(n: int, k: int, p: float) -> float:
    return comb(n, k) * (p**k) * ((1 - p) ** (n - k))


def binomial_at_least(n: int, k: int, p: float) -> float:
    return sum(binomial_exact(n, successes, p) for successes in range(k, n + 1))


def simulate(n: int, k: int, p: float, experiments: int, seed: int) -> tuple[float, float, float]:
    random = Random(seed)
    exact_count = 0
    at_least_count = 0
    total_successes = 0

    for _ in range(experiments):
        successes = sum(random.random() < p for _ in range(n))
        total_successes += successes
        exact_count += successes == k
        at_least_count += successes >= k

    return (
        exact_count / experiments,
        at_least_count / experiments,
        total_successes / experiments,
    )


def read_int(prompt: str, minimum: int, maximum: int) -> int:
    while True:
        try:
            value = int(input(prompt))
            if minimum <= value <= maximum:
                return value
        except ValueError:
            pass
        print(f"Enter a whole number from {minimum} to {maximum}.")


def read_probability() -> float:
    while True:
        try:
            value = float(input("Success probability for one trial (0-1): "))
            if 0 <= value <= 1:
                return value
        except ValueError:
            pass
        print("Enter a decimal probability from 0 to 1.")


def main() -> None:
    print("CodeBhavya Binomial Probability Simulator")
    print("Compares an exact model with a reproducible Monte Carlo experiment.\n")
    n = read_int("Independent trials per experiment (1-100): ", 1, 100)
    p = read_probability()
    k = read_int(f"Target successes (0-{n}): ", 0, n)
    experiments = read_int("Number of experiments (100-1,000,000): ", 100, 1_000_000)
    seed = read_int("Random seed (0-1,000,000): ", 0, 1_000_000)

    theoretical_exact = binomial_exact(n, k, p)
    theoretical_at_least = binomial_at_least(n, k, p)
    simulated_exact, simulated_at_least, sample_mean = simulate(n, k, p, experiments, seed)

    print("\n--- Probability Comparison ---")
    print(f"P(X = {k}) theoretical : {theoretical_exact:.6f}")
    print(f"P(X = {k}) simulated   : {simulated_exact:.6f}")
    print(f"Absolute difference    : {abs(theoretical_exact - simulated_exact):.6f}")
    print(f"P(X >= {k}) theoretical: {theoretical_at_least:.6f}")
    print(f"P(X >= {k}) simulated  : {simulated_at_least:.6f}")
    print(f"Expected successes n*p : {n * p:.4f}")
    print(f"Simulated mean         : {sample_mean:.4f}")
    print("\nRerun with the same seed for the same sample; increase experiments")
    print("to reduce typical sampling error, not to guarantee an exact match.")


if __name__ == "__main__":
    main()
