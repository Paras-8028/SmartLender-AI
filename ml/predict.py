import os
import joblib
import numpy as np
import pandas as pd
import shap


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model.pkl"
)

PREPROCESSOR_PATH = os.path.join(
    BASE_DIR,
    "processed",
    "preprocessor.pkl"
)


if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model not found: {MODEL_PATH}"
    )

if not os.path.exists(PREPROCESSOR_PATH):
    raise FileNotFoundError(
        f"Preprocessor not found: {PREPROCESSOR_PATH}"
    )


model = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)


EDUCATION_MAPPING = {
    "Graduate": "Bachelor",
    "Post Graduate": "Master",
    "Diploma": "Associate",
    "High School": "High School"
}

EMPLOYMENT_MAPPING = {
    "Salaried": "Employed",
    "Self Employed": "Self-Employed",
    "Business": "Self-Employed",
    "Freelancer": "Self-Employed"
}

LOAN_PURPOSE_MAPPING = {
    "Home Loan": "Home",
    "Car Loan": "Auto",
    "Education Loan": "Education",
    "Business Loan": "Other",
    "Personal Loan": "Other"
}


FEATURE_LABELS = {
    "Age": "Age",
    "NumberOfDependents": "Number of dependents",
    "MonthlyIncome": "Monthly income",
    "AnnualIncome": "Annual income",
    "Experience": "Employment experience",
    "JobTenure": "Job tenure",
    "CreditScore": "Credit score",
    "NumberOfOpenCreditLines": "Existing credit lines",
    "LoanAmount": "Requested loan amount",
    "LoanDuration": "Loan tenure",
    "InterestRate": "Interest rate",
    "MonthlyDebtPayments": "Existing monthly debt payments",
    "MonthlyLoanPayment": "Estimated monthly loan payment",
    "DebtToIncomeRatio": "Debt-to-income ratio",
    "LoanToIncomeRatio": "Loan-to-income ratio",
    "DisposableIncome": "Disposable income",
    "LoanPaymentToIncomeRatio": "Loan payment-to-income ratio",
    "EducationLevel": "Education level",
    "EmploymentStatus": "Employment status",
    "MaritalStatus": "Marital status",
    "LoanPurpose": "Loan purpose"
}


def calculate_emi(
    principal,
    annual_interest_rate,
    tenure_years
):
    principal = float(principal)
    annual_interest_rate = float(
        annual_interest_rate
    )
    tenure_years = float(tenure_years)

    months = tenure_years * 12

    if months <= 0:
        raise ValueError(
            "Loan tenure must be greater than zero."
        )

    monthly_rate = (
        annual_interest_rate / 12 / 100
    )

    if monthly_rate == 0:
        return principal / months

    emi = (
        principal
        * monthly_rate
        * (1 + monthly_rate) ** months
        / (
            (1 + monthly_rate) ** months - 1
        )
    )

    return emi


def build_features(data):
    age = float(data["age"])

    dependents = int(
        data.get("dependents", 0)
    )

    monthly_income = float(
        data["monthlyIncome"]
    )

    monthly_expenses = float(
        data.get("monthlyExpenses", 0)
    )

    employment_years = float(
        data.get("employmentYears", 0)
    )

    credit_score = float(
        data.get("creditScore", 0)
    )

    existing_loans = int(
        data.get("existingLoans", 0)
    )

    existing_emi = float(
        data.get("existingEMI", 0)
    )

    loan_amount = float(
        data["loanAmount"]
    )

    loan_tenure = float(
        data["loanTenure"]
    )

    interest_rate = float(
        data["interestRate"]
    )

    annual_income = monthly_income * 12
    experience = employment_years
    job_tenure = employment_years
    loan_duration = loan_tenure * 12

    monthly_loan_payment = calculate_emi(
        loan_amount,
        interest_rate,
        loan_tenure
    )

    total_monthly_debt = (
        existing_emi
        + monthly_loan_payment
    )

    disposable_income = (
        monthly_income
        - monthly_expenses
        - existing_emi
    )

    if monthly_income > 0:
        debt_to_income_ratio = (
            total_monthly_debt
            / monthly_income
        )

        loan_payment_to_income_ratio = (
            monthly_loan_payment
            / monthly_income
        )
    else:
        debt_to_income_ratio = 1
        loan_payment_to_income_ratio = 1

    if annual_income > 0:
        loan_to_income_ratio = (
            loan_amount
            / annual_income
        )
    else:
        loan_to_income_ratio = 1

    education = data.get(
        "education",
        "Graduate"
    )

    education = EDUCATION_MAPPING.get(
        education,
        education
    )

    employment = data.get(
        "employmentType",
        "Salaried"
    )

    employment = EMPLOYMENT_MAPPING.get(
        employment,
        employment
    )

    marital_status = data.get(
        "maritalStatus",
        "Single"
    )

    loan_purpose = data.get(
        "loanPurpose",
        "Personal Loan"
    )

    loan_purpose = LOAN_PURPOSE_MAPPING.get(
        loan_purpose,
        loan_purpose
    )

    features = {
        "Age": age,
        "NumberOfDependents": dependents,
        "MonthlyIncome": monthly_income,
        "AnnualIncome": annual_income,
        "Experience": experience,
        "JobTenure": job_tenure,
        "CreditScore": credit_score,
        "NumberOfOpenCreditLines": existing_loans,
        "LoanAmount": loan_amount,
        "LoanDuration": loan_duration,
        "InterestRate": interest_rate,
        "MonthlyDebtPayments": existing_emi,
        "MonthlyLoanPayment": monthly_loan_payment,
        "DebtToIncomeRatio": debt_to_income_ratio,
        "LoanToIncomeRatio": loan_to_income_ratio,
        "DisposableIncome": disposable_income,
        "LoanPaymentToIncomeRatio": loan_payment_to_income_ratio,
        "EducationLevel": education,
        "EmploymentStatus": employment,
        "MaritalStatus": marital_status,
        "LoanPurpose": loan_purpose
    }

    return pd.DataFrame([features])


def get_processed_feature_names():
    return list(
        preprocessor.get_feature_names_out()
    )


def get_shap_values(processed_df):
    explainer = shap.TreeExplainer(model)

    shap_result = explainer.shap_values(
        processed_df
    )

    if isinstance(shap_result, list):
        if len(shap_result) > 1:
            shap_values = shap_result[1][0]
        else:
            shap_values = shap_result[0][0]
    else:
        shap_array = np.asarray(
            shap_result
        )

        if shap_array.ndim == 3:
            if shap_array.shape[2] > 1:
                shap_values = shap_array[0, :, 1]
            else:
                shap_values = shap_array[0, :, 0]

        elif shap_array.ndim == 2:
            shap_values = shap_array[0]

        else:
            shap_values = shap_array

    return np.asarray(
        shap_values,
        dtype=float
    )


def group_shap_values(
    shap_values,
    processed_feature_names
):
    grouped = {}

    categorical_features = [
        "EducationLevel",
        "EmploymentStatus",
        "MaritalStatus",
        "LoanPurpose"
    ]

    for index, processed_name in enumerate(
        processed_feature_names
    ):
        if "__" in processed_name:
            _, feature_name = (
                processed_name.split(
                    "__",
                    1
                )
            )
        else:
            feature_name = processed_name

        original_feature = None

        if feature_name in FEATURE_LABELS:
            original_feature = feature_name
        else:
            for candidate in categorical_features:
                if feature_name.startswith(
                    candidate + "_"
                ):
                    original_feature = candidate
                    break

        if original_feature is None:
            original_feature = feature_name

        grouped.setdefault(
            original_feature,
            0.0
        )

        grouped[original_feature] += (
            shap_values[index]
        )

    return grouped


def generate_explanations(
    features,
    grouped_shap
):
    explanations = []

    sorted_features = sorted(
        grouped_shap.items(),
        key=lambda item: abs(item[1]),
        reverse=True
    )

    for feature_name, shap_value in (
        sorted_features[:6]
    ):
        label = FEATURE_LABELS.get(
            feature_name,
            feature_name
        )

        if feature_name not in features.columns:
            continue

        value = features[
            feature_name
        ].iloc[0]

        if shap_value > 0:
            direction = (
                "positively contributed "
                "to the approval prediction"
            )
            effect = "positive"
        else:
            direction = (
                "negatively contributed "
                "to the approval prediction"
            )
            effect = "negative"

        if feature_name in [
            "MonthlyIncome",
            "AnnualIncome",
            "LoanAmount",
            "MonthlyDebtPayments",
            "MonthlyLoanPayment",
            "DisposableIncome"
        ]:
            formatted_value = (
                f"₹{float(value):,.0f}"
            )

        elif feature_name in [
            "DebtToIncomeRatio",
            "LoanToIncomeRatio",
            "LoanPaymentToIncomeRatio"
        ]:
            formatted_value = (
                f"{float(value) * 100:.1f}%"
            )

        elif feature_name == "InterestRate":
            formatted_value = (
                f"{float(value):.2f}%"
            )

        elif feature_name == "LoanDuration":
            formatted_value = (
                f"{float(value):.0f} months"
            )

        else:
            formatted_value = str(value)

        explanations.append({
            "feature": feature_name,
            "label": label,
            "value": formatted_value,
            "impact": effect,
            "shap_value": round(
                float(shap_value),
                4
            ),
            "message": (
                f"{label} ({formatted_value}) "
                f"{direction}."
            )
        })

    return explanations


def predict_loan(data):
    features = build_features(data)

    processed_array = (
        preprocessor.transform(
            features
        )
    )

    processed_feature_names = (
        get_processed_feature_names()
    )

    processed_df = pd.DataFrame(
        processed_array,
        columns=processed_feature_names
    )

    prediction = model.predict(
        processed_df
    )[0]

    probabilities = model.predict_proba(
        processed_df
    )[0]

    classes = list(
        model.classes_
    )

    if 0 in classes:
        rejection_probability = (
            float(
                probabilities[
                    classes.index(0)
                ]
            ) * 100
        )
    else:
        rejection_probability = 0.0

    if 1 in classes:
        approval_probability = (
            float(
                probabilities[
                    classes.index(1)
                ]
            ) * 100
        )
    else:
        approval_probability = 0.0

    risk_score = round(
        100 - approval_probability
    )

    risk_score = max(
        0,
        min(
            100,
            risk_score
        )
    )

    if risk_score <= 30:
        risk_category = "Low Risk"
    elif risk_score <= 60:
        risk_category = "Medium Risk"
    else:
        risk_category = "High Risk"

    status = (
        "Approved"
        if prediction == 1
        else "Rejected"
    )

    shap_values = get_shap_values(
        processed_df
    )

    grouped_shap = group_shap_values(
        shap_values,
        processed_feature_names
    )

    explanations = generate_explanations(
        features,
        grouped_shap
    )

    monthly_emi = float(
        features[
            "MonthlyLoanPayment"
        ].iloc[0]
    )

    debt_ratio = float(
        features[
            "DebtToIncomeRatio"
        ].iloc[0]
    )

    return {
        "status": status,
        "approval_probability": round(
            approval_probability,
            2
        ),
        "rejection_probability": round(
            rejection_probability,
            2
        ),
        "default_probability": round(
            rejection_probability,
            2
        ),
        "risk_score": risk_score,
        "risk_category": risk_category,
        "monthly_emi": round(
            monthly_emi,
            2
        ),
        "debt_to_income_ratio": round(
            debt_ratio * 100,
            2
        ),
        "explanation": explanations
    }


if __name__ == "__main__":
    sample_application = {
        "age": 30,
        "gender": "Male",
        "education": "Graduate",
        "maritalStatus": "Single",
        "dependents": 1,
        "monthlyIncome": 80000,
        "monthlyExpenses": 20000,
        "employmentType": "Salaried",
        "employmentYears": 5,
        "creditScore": 750,
        "existingLoans": 1,
        "existingEMI": 5000,
        "loanAmount": 500000,
        "loanTenure": 5,
        "interestRate": 10,
        "loanPurpose": "Home Loan"
    }

    print("=" * 65)
    print("AI LOAN APPROVAL ENGINE")
    print("SHAP EXPLAINABLE AI TEST")
    print("=" * 65)

    result = predict_loan(
        sample_application
    )

    print("\nPrediction Result:")
    print(
        f"\nStatus: {result['status']}"
    )
    print(
        f"Approval Probability: "
        f"{result['approval_probability']}%"
    )
    print(
        f"Rejection Probability: "
        f"{result['rejection_probability']}%"
    )
    print(
        f"Risk Score: "
        f"{result['risk_score']}/100"
    )
    print(
        f"Risk Category: "
        f"{result['risk_category']}"
    )
    print(
        f"Monthly EMI: "
        f"₹{result['monthly_emi']:,.2f}"
    )
    print(
        f"Debt-to-Income Ratio: "
        f"{result['debt_to_income_ratio']}%"
    )

    print("\n" + "-" * 65)
    print("EXPLAINABLE AI")
    print("-" * 65)

    for explanation in result["explanation"]:
        symbol = (
            "✓"
            if explanation["impact"] == "positive"
            else "✗"
        )

        print(
            f"\n{symbol} "
            f"{explanation['message']}"
        )

        print(
            f"   SHAP impact: "
            f"{explanation['shap_value']}"
        )

    print("\n" + "=" * 65)
    print("SHAP TEST COMPLETE")
    print("=" * 65)