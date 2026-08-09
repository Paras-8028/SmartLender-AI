import pandas as pd
import numpy as np
import os
import joblib

from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
    confusion_matrix
)


# ============================================================
# CONFIGURATION
# ============================================================

TRAIN_PATH = "processed/train.csv"
TEST_PATH = "processed/test.csv"

MODEL_PATH = "model.pkl"

TARGET = "LoanApproved"

RANDOM_STATE = 42


# ============================================================
# HEADER
# ============================================================

print("\n" + "=" * 65)
print("AI LOAN APPROVAL ENGINE")
print("RANDOM FOREST MODEL TRAINING")
print("=" * 65)


# ============================================================
# CHECK FILES
# ============================================================

if not os.path.exists(TRAIN_PATH):

    raise FileNotFoundError(
        f"Training dataset not found: {TRAIN_PATH}"
    )


if not os.path.exists(TEST_PATH):

    raise FileNotFoundError(
        f"Testing dataset not found: {TEST_PATH}"
    )


# ============================================================
# LOAD DATA
# ============================================================

print("\nLoading processed datasets...")

train_df = pd.read_csv(TRAIN_PATH)

test_df = pd.read_csv(TEST_PATH)


print(
    f"Training dataset: {train_df.shape}"
)

print(
    f"Testing dataset : {test_df.shape}"
)


# ============================================================
# SEPARATE FEATURES AND TARGET
# ============================================================

X_train = train_df.drop(
    columns=[TARGET]
)

y_train = train_df[TARGET]


X_test = test_df.drop(
    columns=[TARGET]
)

y_test = test_df[TARGET]


print(
    f"\nTraining features: {X_train.shape[1]}"
)

print(
    f"Testing features : {X_test.shape[1]}"
)


# ============================================================
# CHECK CLASS DISTRIBUTION
# ============================================================

print("\nTraining class distribution:")

print(
    y_train.value_counts()
)


print("\nTesting class distribution:")

print(
    y_test.value_counts()
)


# ============================================================
# CREATE RANDOM FOREST
# ============================================================

print("\nCreating Random Forest model...")


model = RandomForestClassifier(

    n_estimators=300,

    max_depth=None,

    min_samples_split=2,

    min_samples_leaf=1,

    class_weight="balanced",

    random_state=RANDOM_STATE,

    n_jobs=-1

)


# ============================================================
# TRAIN MODEL
# ============================================================

print("\nTraining model...")

model.fit(
    X_train,
    y_train
)


print("Model training completed.")


# ============================================================
# PREDICTIONS
# ============================================================

print("\nGenerating predictions...")


y_pred = model.predict(
    X_test
)


y_probability = model.predict_proba(
    X_test
)[:, 1]


# ============================================================
# EVALUATION
# ============================================================

accuracy = accuracy_score(
    y_test,
    y_pred
)


precision = precision_score(
    y_test,
    y_pred,
    zero_division=0
)


recall = recall_score(
    y_test,
    y_pred,
    zero_division=0
)


f1 = f1_score(
    y_test,
    y_pred,
    zero_division=0
)


roc_auc = roc_auc_score(
    y_test,
    y_probability
)


# ============================================================
# PRINT METRICS
# ============================================================

print("\n" + "=" * 65)
print("MODEL PERFORMANCE")
print("=" * 65)


print(
    f"\nAccuracy  : {accuracy:.4f}"
)

print(
    f"Precision : {precision:.4f}"
)

print(
    f"Recall    : {recall:.4f}"
)

print(
    f"F1 Score  : {f1:.4f}"
)

print(
    f"ROC-AUC   : {roc_auc:.4f}"
)


# ============================================================
# CLASSIFICATION REPORT
# ============================================================

print("\n" + "=" * 65)
print("CLASSIFICATION REPORT")
print("=" * 65)


print(
    classification_report(
        y_test,
        y_pred,
        target_names=[
            "Rejected",
            "Approved"
        ],
        zero_division=0
    )
)


# ============================================================
# CONFUSION MATRIX
# ============================================================

print("\n" + "=" * 65)
print("CONFUSION MATRIX")
print("=" * 65)


cm = confusion_matrix(
    y_test,
    y_pred
)


print(cm)


print(
    "\nConfusion Matrix:"
)

print(
    "[[TN, FP]"
)

print(
    " [FN, TP]]"
)


# ============================================================
# FEATURE IMPORTANCE
# ============================================================

print("\n" + "=" * 65)
print("TOP 15 IMPORTANT FEATURES")
print("=" * 65)


feature_importance = pd.DataFrame({

    "feature": X_train.columns,

    "importance": model.feature_importances_

})


feature_importance = (
    feature_importance
    .sort_values(
        by="importance",
        ascending=False
    )
)


print(
    feature_importance
    .head(15)
    .to_string(index=False)
)


# ============================================================
# SAVE MODEL
# ============================================================

print("\nSaving model...")

joblib.dump(
    model,
    MODEL_PATH
)


print(
    f"\nModel saved successfully:"
)

print(
    os.path.abspath(MODEL_PATH)
)


# ============================================================
# FINAL SUMMARY
# ============================================================

print("\n" + "=" * 65)
print("MODEL TRAINING COMPLETE")
print("=" * 65)


print(
    f"""
Model:
    Random Forest Classifier

Training Samples:
    {len(X_train)}

Testing Samples:
    {len(X_test)}

Features:
    {X_train.shape[1]}

Accuracy:
    {accuracy * 100:.2f}%

Precision:
    {precision * 100:.2f}%

Recall:
    {recall * 100:.2f}%

F1 Score:
    {f1 * 100:.2f}%

ROC-AUC:
    {roc_auc:.4f}

Saved Model:
    {MODEL_PATH}
"""
)