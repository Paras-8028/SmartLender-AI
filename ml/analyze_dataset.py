import pandas as pd
import os


# ==========================================
# Configuration
# ==========================================

DATASET_PATH = "../dataset/Loan.csv"


# ==========================================
# Load Dataset
# ==========================================

print("\n" + "=" * 60)
print("AI LOAN APPROVAL ENGINE")
print("DATASET ANALYSIS")
print("=" * 60)


if not os.path.exists(DATASET_PATH):

    print(f"\nERROR: Dataset not found at:")
    print(os.path.abspath(DATASET_PATH))

    print("\nMake sure Loan.csv exists inside:")
    print("../dataset/")

    exit()


df = pd.read_csv(DATASET_PATH)


# ==========================================
# Basic Information
# ==========================================

print("\n1. DATASET SHAPE")
print("-" * 40)

print(f"Rows    : {df.shape[0]}")
print(f"Columns : {df.shape[1]}")


# ==========================================
# Column Names
# ==========================================

print("\n2. COLUMN NAMES")
print("-" * 40)

for index, column in enumerate(df.columns, start=1):

    print(f"{index:2}. {column}")


# ==========================================
# Data Types
# ==========================================

print("\n3. DATA TYPES")
print("-" * 40)

print(df.dtypes)


# ==========================================
# Missing Values
# ==========================================

print("\n4. MISSING VALUES")
print("-" * 40)

missing_values = df.isnull().sum()

missing_values = missing_values[
    missing_values > 0
]


if len(missing_values) == 0:

    print("No missing values found.")

else:

    print(missing_values)


# ==========================================
# Duplicate Rows
# ==========================================

print("\n5. DUPLICATE ROWS")
print("-" * 40)

duplicates = df.duplicated().sum()

print(f"Duplicate rows: {duplicates}")


# ==========================================
# Numerical Columns
# ==========================================

print("\n6. NUMERICAL COLUMNS")
print("-" * 40)

numerical_columns = df.select_dtypes(
    include=["int64", "float64"]
).columns


for column in numerical_columns:

    print(column)


# ==========================================
# Categorical Columns
# ==========================================

print("\n7. CATEGORICAL COLUMNS")
print("-" * 40)

categorical_columns = df.select_dtypes(
    include=["object"]
).columns


for column in categorical_columns:

    print(column)


# ==========================================
# Unique Values
# ==========================================

print("\n8. CATEGORICAL VALUES")
print("-" * 40)

for column in categorical_columns:

    print(f"\n{column}:")

    values = df[column].unique()

    for value in values:

        print(f"  - {value}")


# ==========================================
# Loan Approval Distribution
# ==========================================

print("\n9. LOAN APPROVAL DISTRIBUTION")
print("-" * 40)


if "LoanApproved" in df.columns:

    approval_counts = df[
        "LoanApproved"
    ].value_counts()

    approval_percentages = (
        df["LoanApproved"]
        .value_counts(normalize=True)
        * 100
    )


    for value in approval_counts.index:

        count = approval_counts[value]

        percentage = approval_percentages[value]


        if value == 1:

            status = "Approved"

        else:

            status = "Rejected"


        print(
            f"{status}: "
            f"{count} "
            f"({percentage:.2f}%)"
        )

else:

    print(
        "LoanApproved column not found."
    )


# ==========================================
# Risk Score Analysis
# ==========================================

print("\n10. RISK SCORE ANALYSIS")
print("-" * 40)


if "RiskScore" in df.columns:

    print(
        df["RiskScore"]
        .describe()
        .round(2)
    )

else:

    print(
        "RiskScore column not found."
    )


# ==========================================
# Statistical Summary
# ==========================================

print("\n11. NUMERICAL SUMMARY")
print("-" * 40)

print(
    df[numerical_columns]
    .describe()
    .round(2)
)


# ==========================================
# Correlation with Loan Approval
# ==========================================

print(
    "\n12. CORRELATION WITH LOAN APPROVAL"
)

print("-" * 40)


if "LoanApproved" in df.columns:

    correlations = (
        df[numerical_columns]
        .corr()["LoanApproved"]
        .sort_values(
            ascending=False
        )
    )

    print(
        correlations.round(3)
    )

else:

    print(
        "LoanApproved column not found."
    )


# ==========================================
# Final Summary
# ==========================================

print("\n" + "=" * 60)
print("DATASET ANALYSIS COMPLETE")
print("=" * 60)


print(
    f"""
Dataset:
    Rows       : {df.shape[0]}
    Columns    : {df.shape[1]}
    Numerical  : {len(numerical_columns)}
    Categorical: {len(categorical_columns)}
    Duplicates : {duplicates}

Target:
    LoanApproved

Risk:
    RiskScore

Next Phase:
    Data preprocessing and feature engineering
"""
)