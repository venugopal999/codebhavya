"""Original CodeBhavya house-price regression workflow on synthetic data.

The program teaches leakage-safe evaluation. Its generated prices are fictional
and must not be used for valuation, lending or investment decisions.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

RANDOM_STATE = 42
NUMERIC = ["area_sqft", "bedrooms", "age_years", "distance_km", "parking_spaces"]
CATEGORICAL = ["neighborhood", "property_type"]
FEATURES = NUMERIC + CATEGORICAL


def generate_housing_data(rows: int = 1200) -> pd.DataFrame:
    """Create reproducible fictional property records with noise and missingness."""
    rng = np.random.default_rng(RANDOM_STATE)
    neighborhood = rng.choice(["Central", "North", "East", "South"], rows, p=[.20, .28, .30, .22])
    property_type = rng.choice(["Apartment", "Independent", "Duplex"], rows, p=[.58, .30, .12])
    area = np.clip(rng.normal(1350, 420, rows), 450, 3200)
    bedrooms = np.clip(np.rint(area / 520 + rng.normal(0, .55, rows)), 1, 6).astype(int)
    age = rng.integers(0, 36, rows)
    distance = np.clip(rng.gamma(2.2, 2.2, rows), .2, 18)
    parking = rng.choice([0, 1, 2], rows, p=[.18, .62, .20])

    neighborhood_effect = pd.Series(neighborhood).map(
        {"Central": 2_200_000, "North": 900_000, "East": 500_000, "South": 250_000}
    ).to_numpy()
    type_effect = pd.Series(property_type).map(
        {"Apartment": 0, "Independent": 800_000, "Duplex": 1_350_000}
    ).to_numpy()
    price = (
        1_200_000 + area * 4_800 + bedrooms * 180_000 - age * 42_000
        - distance * 95_000 + parking * 300_000 + neighborhood_effect + type_effect
        + 420 * np.maximum(area - 1800, 0) ** 1.18
        + rng.normal(0, 520_000, rows)
    )
    frame = pd.DataFrame(
        {"area_sqft": area.round(0), "bedrooms": bedrooms, "age_years": age,
         "distance_km": distance.round(2), "parking_spaces": parking,
         "neighborhood": neighborhood, "property_type": property_type,
         "price": np.maximum(price, 800_000).round(0)}
    )
    for column in ("area_sqft", "distance_km", "neighborhood"):
        indexes = rng.choice(frame.index, round(rows * .025), replace=False)
        frame.loc[indexes, column] = np.nan
    return frame


def build_pipeline(max_depth: int | None) -> Pipeline:
    numeric = Pipeline([("imputer", SimpleImputer(strategy="median"))])
    categorical = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])
    preparation = ColumnTransformer([
        ("numeric", numeric, NUMERIC),
        ("categorical", categorical, CATEGORICAL),
    ])
    model = RandomForestRegressor(
        n_estimators=250, max_depth=max_depth, min_samples_leaf=3,
        random_state=RANDOM_STATE, n_jobs=-1,
    )
    return Pipeline([("prepare", preparation), ("model", model)])


def metrics(y_true: pd.Series, prediction: np.ndarray) -> dict[str, float]:
    return {
        "MAE": mean_absolute_error(y_true, prediction),
        "RMSE": mean_squared_error(y_true, prediction) ** .5,
        "R2": r2_score(y_true, prediction),
    }


def show_metrics(name: str, values: dict[str, float]) -> None:
    print(f"\n{name}\n{'-' * len(name)}")
    print(f"MAE : Rs. {values['MAE']:,.0f}")
    print(f"RMSE: Rs. {values['RMSE']:,.0f}")
    print(f"R2  : {values['R2']:.3f}")


def main() -> None:
    data = generate_housing_data()
    x_development, x_test, y_development, y_test = train_test_split(
        data[FEATURES], data["price"], test_size=.20, random_state=RANDOM_STATE
    )
    x_train, x_validation, y_train, y_validation = train_test_split(
        x_development, y_development, test_size=.25, random_state=RANDOM_STATE
    )

    baseline = DummyRegressor(strategy="median").fit(x_train, y_train)
    baseline_test = baseline.predict(x_test)

    candidates = []
    for depth in (5, 9, None):
        candidate = build_pipeline(depth).fit(x_train, y_train)
        validation_prediction = candidate.predict(x_validation)
        candidates.append((mean_absolute_error(y_validation, validation_prediction), depth, candidate))
    candidates.sort(key=lambda item: item[0])
    validation_mae, chosen_depth, model = candidates[0]

    validation_prediction = model.predict(x_validation)
    residual_radius = float(np.quantile(np.abs(y_validation - validation_prediction), .90))
    test_prediction = model.predict(x_test)
    covered = np.mean(np.abs(y_test - test_prediction) <= residual_radius)

    print("CodeBhavya House-Price Prediction")
    print("SYNTHETIC EDUCATIONAL DATA — NOT A PROPERTY VALUATION")
    print(f"Rows: train={len(x_train)}, validation={len(x_validation)}, test={len(x_test)}")
    show_metrics("Median-price baseline — untouched test", metrics(y_test, baseline_test))
    print("\nValidation model selection")
    for mae, depth, _ in candidates:
        print(f"max_depth={str(depth):<4} validation MAE=Rs. {mae:,.0f}")
    print(f"Chosen depth: {chosen_depth}; validation MAE: Rs. {validation_mae:,.0f}")
    show_metrics("Random forest — untouched test", metrics(y_test, test_prediction))
    print(f"90th-percentile validation residual radius: Rs. {residual_radius:,.0f}")
    print(f"Test coverage of prediction ± radius: {covered:.3f}")

    transformed_names = model.named_steps["prepare"].get_feature_names_out()
    importance = model.named_steps["model"].feature_importances_
    print("\nLargest model feature importances (predictive, not causal)")
    for name, value in sorted(zip(transformed_names, importance), key=lambda pair: pair[1], reverse=True)[:8]:
        print(f"{name:<42} {value:.3f}")

    audit = x_test[["neighborhood"]].copy()
    audit["absolute_error"] = np.abs(y_test.to_numpy() - test_prediction)
    print("\nTest MAE by neighborhood (after missing-value label handling)")
    audit["neighborhood"] = audit["neighborhood"].fillna("Missing")
    print(audit.groupby("neighborhood")["absolute_error"].agg(["count", "mean"]).round(0))
    print("\nLimit: synthetic patterns and residual ranges do not transfer to real markets.")


if __name__ == "__main__":
    main()
