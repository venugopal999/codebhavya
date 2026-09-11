"""Educational placement-outcome model built for the CodeBhavya case study.

The generated records are synthetic. The program demonstrates a leakage-safe
workflow; it must not be used to make real employment decisions.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


RANDOM_STATE = 42
FEATURES = [
    "cgpa",
    "aptitude",
    "coding",
    "communication",
    "projects",
    "internships",
    "backlogs",
]


def sigmoid(value: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-value))


def generate_educational_data(rows: int = 900) -> pd.DataFrame:
    """Create reproducible synthetic records with a probabilistic target."""
    rng = np.random.default_rng(RANDOM_STATE)
    frame = pd.DataFrame(
        {
            "cgpa": np.clip(rng.normal(7.3, 0.9, rows), 4.5, 10),
            "aptitude": np.clip(rng.normal(68, 14, rows), 20, 100),
            "coding": np.clip(rng.normal(64, 18, rows), 10, 100),
            "communication": np.clip(rng.normal(70, 13, rows), 20, 100),
            "projects": rng.integers(0, 6, rows),
            "internships": rng.integers(0, 3, rows),
            "backlogs": rng.choice([0, 1, 2, 3], rows, p=[0.68, 0.20, 0.09, 0.03]),
        }
    )
    log_odds = (
        -8.5
        + 0.35 * frame["cgpa"]
        + 0.018 * frame["aptitude"]
        + 0.035 * frame["coding"]
        + 0.015 * frame["communication"]
        + 0.25 * frame["projects"]
        + 0.45 * frame["internships"]
        - 0.70 * frame["backlogs"]
        + rng.normal(0, 0.70, rows)
    )
    frame["placed"] = rng.binomial(1, sigmoid(log_odds))

    for column in ("aptitude", "coding"):
        missing_rows = rng.choice(frame.index, size=round(rows * 0.03), replace=False)
        frame.loc[missing_rows, column] = np.nan
    return frame


def build_pipeline() -> Pipeline:
    numeric_steps = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )
    preparation = ColumnTransformer(
        [("numeric", numeric_steps, FEATURES)],
        remainder="drop",
    )
    return Pipeline(
        [
            ("prepare", preparation),
            (
                "model",
                LogisticRegression(
                    class_weight="balanced",
                    max_iter=2000,
                    random_state=RANDOM_STATE,
                ),
            ),
        ]
    )


def metric_row(y_true: pd.Series, probabilities: np.ndarray,
               threshold: float) -> dict[str, float]:
    predictions = (probabilities >= threshold).astype(int)
    return {
        "threshold": threshold,
        "precision": precision_score(y_true, predictions, zero_division=0),
        "recall": recall_score(y_true, predictions, zero_division=0),
        "f1": f1_score(y_true, predictions, zero_division=0),
    }


def select_threshold(y_validation: pd.Series,
                     probabilities: np.ndarray) -> tuple[float, pd.DataFrame]:
    """Select on validation only, requiring at least 70% recall."""
    table = pd.DataFrame(
        metric_row(y_validation, probabilities, float(threshold))
        for threshold in np.arange(0.25, 0.71, 0.05)
    )
    acceptable = table[table["recall"] >= 0.70]
    candidates = acceptable if not acceptable.empty else table
    chosen = candidates.sort_values(
        ["f1", "recall", "threshold"],
        ascending=[False, False, True],
    ).iloc[0]
    return float(chosen["threshold"]), table


def show_evaluation(name: str, y_true: pd.Series,
                    probabilities: np.ndarray, threshold: float) -> None:
    predictions = (probabilities >= threshold).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_true, predictions).ravel()
    print(f"\n{name}")
    print("-" * len(name))
    print(f"Threshold : {threshold:.2f}")
    print(f"Accuracy  : {accuracy_score(y_true, predictions):.3f}")
    print(f"Precision : {precision_score(y_true, predictions, zero_division=0):.3f}")
    print(f"Recall    : {recall_score(y_true, predictions, zero_division=0):.3f}")
    print(f"F1-score  : {f1_score(y_true, predictions, zero_division=0):.3f}")
    print(f"ROC-AUC   : {roc_auc_score(y_true, probabilities):.3f}")
    print(f"Confusion : TN={tn}, FP={fp}, FN={fn}, TP={tp}")


def show_standardized_coefficients(pipeline: Pipeline) -> None:
    model = pipeline.named_steps["model"]
    ranking = sorted(
        zip(FEATURES, model.coef_[0]),
        key=lambda pair: abs(pair[1]),
        reverse=True,
    )
    print("\nStandardized logistic coefficients")
    print("----------------------------------")
    for feature, coefficient in ranking:
        direction = "raises" if coefficient > 0 else "lowers"
        print(f"{feature:<15} {coefficient:>8.3f}  {direction} model probability")
    print("Coefficients describe this synthetic dataset; they do not prove causation.")


def main() -> None:
    data = generate_educational_data()
    x = data[FEATURES]
    y = data["placed"]

    x_development, x_test, y_development, y_test = train_test_split(
        x,
        y,
        test_size=0.20,
        stratify=y,
        random_state=RANDOM_STATE,
    )
    x_train, x_validation, y_train, y_validation = train_test_split(
        x_development,
        y_development,
        test_size=0.25,
        stratify=y_development,
        random_state=RANDOM_STATE,
    )

    baseline = DummyClassifier(strategy="most_frequent")
    baseline.fit(x_train, y_train)
    baseline_probability = baseline.predict_proba(x_test)[:, 1]

    pipeline = build_pipeline()
    pipeline.fit(x_train, y_train)
    validation_probability = pipeline.predict_proba(x_validation)[:, 1]
    chosen_threshold, threshold_table = select_threshold(
        y_validation, validation_probability
    )
    test_probability = pipeline.predict_proba(x_test)[:, 1]

    print("CodeBhavya Placement Outcome Modeling")
    print("SYNTHETIC EDUCATIONAL DATA — NOT FOR EMPLOYMENT DECISIONS")
    print(
        f"Rows: train={len(x_train)}, validation={len(x_validation)}, "
        f"test={len(x_test)}; positive rate={y.mean():.3f}"
    )
    show_evaluation("Most-frequent baseline", y_test, baseline_probability, 0.50)
    print("\nValidation threshold study")
    print(threshold_table.round(3).to_string(index=False))
    show_evaluation(
        "Logistic regression — untouched test set",
        y_test,
        test_probability,
        chosen_threshold,
    )
    show_standardized_coefficients(pipeline)


if __name__ == "__main__":
    main()
