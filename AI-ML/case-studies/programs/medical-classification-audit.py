"""Responsible evaluation of a medical classification teaching dataset.

This program is for education only. It is not a medical device and must not be
used for diagnosis, treatment, triage, or patient-specific advice.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


RANDOM_STATE = 42


def load_teaching_data() -> tuple[pd.DataFrame, pd.Series]:
    dataset = load_breast_cancer(as_frame=True)
    features = dataset.data.copy()
    # Original target: 0=malignant, 1=benign. Invert it so the clinically
    # important malignant class is the positive class throughout this program.
    high_risk = (dataset.target == 0).astype(int)
    high_risk.name = "malignant"
    return features, high_risk


def build_pipeline() -> Pipeline:
    return Pipeline(
        [
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            (
                "classifier",
                LogisticRegression(
                    class_weight="balanced",
                    max_iter=3000,
                    random_state=RANDOM_STATE,
                ),
            ),
        ]
    )


def threshold_metrics(y_true: pd.Series, probabilities: np.ndarray,
                      threshold: float) -> dict[str, float | int]:
    predicted = (probabilities >= threshold).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_true, predicted).ravel()
    specificity = tn / (tn + fp) if tn + fp else 0.0
    return {
        "threshold": threshold,
        "precision": precision_score(y_true, predicted, zero_division=0),
        "recall_sensitivity": recall_score(y_true, predicted, zero_division=0),
        "specificity": specificity,
        "f1": f1_score(y_true, predicted, zero_division=0),
        "false_negatives": int(fn),
        "false_positives": int(fp),
    }


def show_error_audit(y_true: pd.Series, probabilities: np.ndarray,
                     threshold: float) -> None:
    predicted = (probabilities >= threshold).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_true, predicted).ravel()
    print(f"\nHeld-out test audit at threshold {threshold:.2f}")
    print("----------------------------------------")
    print(f"TN={tn}  FP={fp}  FN={fn}  TP={tp}")
    print(f"Precision          : {precision_score(y_true, predicted):.3f}")
    print(f"Recall/Sensitivity : {recall_score(y_true, predicted):.3f}")
    print(f"F1-score           : {f1_score(y_true, predicted):.3f}")
    print(f"ROC-AUC             : {roc_auc_score(y_true, probabilities):.3f}")

    false_negative_rows = y_true.index[(y_true == 1) & (predicted == 0)].tolist()
    print(f"False-negative row IDs for review: {false_negative_rows or 'none'}")


def show_feature_signals(pipeline: Pipeline, feature_names: list[str]) -> None:
    coefficients = pipeline.named_steps["classifier"].coef_[0]
    strongest = sorted(
        zip(feature_names, coefficients),
        key=lambda pair: abs(pair[1]),
        reverse=True,
    )[:10]
    print("\nLargest standardized model coefficients")
    print("---------------------------------------")
    for feature, coefficient in strongest:
        direction = "toward malignant" if coefficient > 0 else "toward benign"
        print(f"{feature:<28} {coefficient:>8.3f}  {direction}")
    print("Association in this fitted model is not clinical causation.")


def main() -> None:
    x, y = load_teaching_data()
    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.20,
        stratify=y,
        random_state=RANDOM_STATE,
    )
    pipeline = build_pipeline()

    cross_validation = StratifiedKFold(
        n_splits=5, shuffle=True, random_state=RANDOM_STATE
    )
    scores = cross_validate(
        pipeline,
        x_train,
        y_train,
        cv=cross_validation,
        scoring={
            "precision": "precision",
            "recall": "recall",
            "f1": "f1",
            "roc_auc": "roc_auc",
        },
    )
    pipeline.fit(x_train, y_train)
    probability = pipeline.predict_proba(x_test)[:, 1]

    print("CodeBhavya Responsible Medical Classification Audit")
    print("EDUCATIONAL USE ONLY — NOT FOR CLINICAL DECISIONS")
    print(
        f"Development rows={len(x_train)}, test rows={len(x_test)}, "
        f"malignant rate={y.mean():.3f}"
    )
    print("\nFive-fold development cross-validation")
    for metric in ("precision", "recall", "f1", "roc_auc"):
        values = scores[f"test_{metric}"]
        print(f"{metric:<10}: {values.mean():.3f} ± {values.std():.3f}")

    table = pd.DataFrame(
        threshold_metrics(y_test, probability, threshold)
        for threshold in (0.20, 0.35, 0.50, 0.65, 0.80)
    )
    print("\nThreshold audit on the held-out test set")
    print(table.round(3).to_string(index=False))

    # This is a demonstration threshold, not a clinically validated operating point.
    show_error_audit(y_test, probability, threshold=0.35)
    show_feature_signals(pipeline, x.columns.tolist())
    print("\nRequired next steps before any clinical study:")
    print("external validation, calibration, subgroup analysis, clinician review,")
    print("prospective evaluation, governance, privacy controls and regulatory assessment.")


if __name__ == "__main__":
    main()
