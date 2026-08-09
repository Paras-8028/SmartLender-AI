import pandas as pd
import numpy as np
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline


# ============================================================
# CONFIGURATION
# ============================================================

DATASET_PATH = "../dataset/Loan.csv"
PROCESSED_DIR = "processed"

RANDOM_STATE = 42
TARGET = "LoanApproved"


# ============================================================
# DEPLOYMENT FEATURE SCHEMA
# ============================================================
#
# These are the features that our real React loan form can
# provide directly or calculate reliably.
#
# IMPORTANT:
# RiskScore is deliberately NOT used.
# LoanApproved is the target.
# ApplicationDate is not used.
#


NUMERICAL_FEATURES = [
    "Age",
    "NumberOfDependents",
    "MonthlyIncome",
    "AnnualIncome",
    "Experience",
    "JobTenure",
    "CreditScore",
    "NumberOfOpenCreditLines",
    "LoanAmount",
    "LoanDuration",
    "InterestRate",
    "MonthlyDebtPayments",
    "MonthlyLoanPayment",
    "DebtToIncomeRatio",
    "LoanToIncomeRatio",
    "DisposableIncome",
    "LoanPaymentToIncomeRatio",
]


CATEGORICAL_FEATURES = [
    "EducationLevel",
    "EmploymentStatus",
    "MaritalStatus",
    "LoanPurpose",
]


# ============================================================
# LOAD DATASET
# ============================================================

print("\n" + "=" * 65)
print("AI LOAN APPROVAL ENGINE")
print("DEPLOYMENT FEATURE PREPROCESSING")
print("=" * 65)


if not os.path.exists(DATASET_PATH):

    raise FileNotFoundError(
        f"Dataset not found: {DATASET_PATH}"
    )


df = pd.read_csv(DATASET_PATH)

print(
    f"\nOriginal dataset shape: {df.shape}"
)


# ============================================================
# CHECK ORIGINAL DATASET COLUMNS
# ============================================================

# Only check columns that must actually exist in Loan.csv.
# Engineered features are created later in this script.

ORIGINAL_REQUIRED_COLUMNS = [
    "Age",
    "NumberOfDependents",
    "MonthlyIncome",
    "AnnualIncome",
    "Experience",
    "JobTenure",
    "CreditScore",
    "NumberOfOpenCreditLines",
    "LoanAmount",
    "LoanDuration",
    "InterestRate",
    "MonthlyDebtPayments",
    "MonthlyLoanPayment",
    "DebtToIncomeRatio",
    "EducationLevel",
    "EmploymentStatus",
    "MaritalStatus",
    "LoanPurpose",
    "LoanApproved",
]


missing_columns = [
    column
    for column in ORIGINAL_REQUIRED_COLUMNS
    if column not in df.columns
]


if missing_columns:

    print("\nMissing ORIGINAL dataset columns:")

    for column in missing_columns:
        print(f"  - {column}")

    raise ValueError(
        "Loan.csv does not contain all required original columns."
    )


# ============================================================
# REMOVE DUPLICATES
# ============================================================

duplicates = df.duplicated().sum()

print(
    f"\nDuplicate rows found: {duplicates}"
)

df = df.drop_duplicates()


# ============================================================
# FEATURE ENGINEERING
# ============================================================

print("\nCreating deployment features...")


# ------------------------------------------------------------
# Disposable income
# ------------------------------------------------------------
#
# The Kaggle dataset provides MonthlyIncome and
# MonthlyDebtPayments.
#
# We derive the amount remaining after monthly debt
# obligations.
#

df["DisposableIncome"] = (
    df["MonthlyIncome"]
    - df["MonthlyDebtPayments"]
)


# ------------------------------------------------------------
# Loan-to-income ratio
# ------------------------------------------------------------
#
# Measures the requested loan relative to annual income.
#

df["LoanToIncomeRatio"] = (
    df["LoanAmount"]
    / df["AnnualIncome"].replace(0, np.nan)
)


# ------------------------------------------------------------
# Loan-payment-to-income ratio
# ------------------------------------------------------------
#
# Measures how much of monthly income is required for
# the loan payment.
#

df["LoanPaymentToIncomeRatio"] = (
    df["MonthlyLoanPayment"]
    / df["MonthlyIncome"].replace(0, np.nan)
)


# ------------------------------------------------------------
# Replace invalid numerical values
# ------------------------------------------------------------

df = df.replace(
    [np.inf, -np.inf],
    np.nan
)


print("Engineered features created:")
print("  - DisposableIncome")
print("  - LoanToIncomeRatio")
print("  - LoanPaymentToIncomeRatio")


# ------------------------------------------------------------
# Disposable income
# ------------------------------------------------------------
#
# Dataset does not directly contain monthly expenses in the
# same form as our application. We therefore derive the
# affordability feature from debt obligations available in
# the dataset.
#
# For the dataset:
# DisposableIncome ≈ MonthlyIncome - MonthlyDebtPayments
#

df["DisposableIncome"] = (
    df["MonthlyIncome"]
    - df["MonthlyDebtPayments"]
)


# ------------------------------------------------------------
# Loan-to-income ratio
# ------------------------------------------------------------

df["LoanToIncomeRatio"] = (
    df["LoanAmount"]
    / df["AnnualIncome"].replace(0, np.nan)
)


# ------------------------------------------------------------
# Loan payment-to-income ratio
# ------------------------------------------------------------

df["LoanPaymentToIncomeRatio"] = (
    df["MonthlyLoanPayment"]
    / df["MonthlyIncome"].replace(0, np.nan)
)


# ------------------------------------------------------------
# Clean infinite values
# ------------------------------------------------------------

df = df.replace(
    [np.inf, -np.inf],
    np.nan
)


# ============================================================
# BUILD FEATURE MATRIX
# ============================================================

feature_columns = (
    NUMERICAL_FEATURES
    + CATEGORICAL_FEATURES
)


X = df[feature_columns].copy()

y = df[TARGET].copy()


print(
    f"\nSelected raw features: {len(feature_columns)}"
)

print(
    f"Numerical features: {len(NUMERICAL_FEATURES)}"
)

print(
    f"Categorical features: {len(CATEGORICAL_FEATURES)}"
)


# ============================================================
# DISPLAY FEATURES
# ============================================================

print("\nSelected features:")

for index, feature in enumerate(
    feature_columns,
    start=1
):

    print(
        f"{index:2}. {feature}"
    )


# ============================================================
# TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.20,

    random_state=RANDOM_STATE,

    stratify=y

)


print("\nTrain/Test split:")

print(
    f"Training samples: {len(X_train)}"
)

print(
    f"Testing samples : {len(X_test)}"
)


# ============================================================
# PREPROCESSING PIPELINES
# ============================================================

numerical_pipeline = Pipeline(
    steps=[

        (
            "imputer",
            SimpleImputer(
                strategy="median"
            )
        )

    ]
)


categorical_pipeline = Pipeline(
    steps=[

        (
            "imputer",
            SimpleImputer(
                strategy="most_frequent"
            )
        ),

        (
            "encoder",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False
            )
        )

    ]
)


preprocessor = ColumnTransformer(
    transformers=[

        (
            "numerical",
            numerical_pipeline,
            NUMERICAL_FEATURES
        ),

        (
            "categorical",
            categorical_pipeline,
            CATEGORICAL_FEATURES
        )

    ]
)


# ============================================================
# FIT PREPROCESSOR
# ============================================================

print(
    "\nFitting preprocessing pipeline..."
)


X_train_processed = (
    preprocessor.fit_transform(X_train)
)


X_test_processed = (
    preprocessor.transform(X_test)
)


# ============================================================
# FEATURE NAMES
# ============================================================

feature_names = (
    preprocessor
    .get_feature_names_out()
)


print(
    f"\nProcessed feature count: "
    f"{len(feature_names)}"
)


# ============================================================
# CREATE OUTPUT DIRECTORY
# ============================================================

os.makedirs(
    PROCESSED_DIR,
    exist_ok=True
)


# ============================================================
# SAVE PROCESSED TRAINING DATA
# ============================================================

train_df = pd.DataFrame(
    X_train_processed,
    columns=feature_names
)

train_df[TARGET] = (
    y_train.reset_index(drop=True)
)


# ============================================================
# SAVE PROCESSED TESTING DATA
# ============================================================

test_df = pd.DataFrame(
    X_test_processed,
    columns=feature_names
)

test_df[TARGET] = (
    y_test.reset_index(drop=True)
)


# ============================================================
# SAVE FILES
# ============================================================

train_path = os.path.join(
    PROCESSED_DIR,
    "train.csv"
)

test_path = os.path.join(
    PROCESSED_DIR,
    "test.csv"
)

preprocessor_path = os.path.join(
    PROCESSED_DIR,
    "preprocessor.pkl"
)


train_df.to_csv(
    train_path,
    index=False
)


test_df.to_csv(
    test_path,
    index=False
)


joblib.dump(
    preprocessor,
    preprocessor_path
)


# ============================================================
# SAVE FEATURE SCHEMA
# ============================================================

schema = {

    "numerical_features":
        NUMERICAL_FEATURES,

    "categorical_features":
        CATEGORICAL_FEATURES,

    "target":
        TARGET,

    "processed_features":
        list(feature_names)

}


schema_path = os.path.join(
    PROCESSED_DIR,
    "feature_schema.pkl"
)


joblib.dump(
    schema,
    schema_path
)


# ============================================================
# SUMMARY
# ============================================================

print("\n" + "=" * 65)
print("DEPLOYMENT PREPROCESSING COMPLETE")
print("=" * 65)


print(
    f"""
Original dataset:
    {df.shape[0]} rows

Selected raw features:
    {len(feature_columns)}

Numerical features:
    {len(NUMERICAL_FEATURES)}

Categorical features:
    {len(CATEGORICAL_FEATURES)}

Processed features:
    {len(feature_names)}

Training samples:
    {len(X_train)}

Testing samples:
    {len(X_test)}

Generated files:

    {train_path}

    {test_path}

    {preprocessor_path}

    {schema_path}
"""
)


print("=" * 65)