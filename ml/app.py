from flask import Flask, request, jsonify
from flask_cors import CORS

from predict import predict_loan

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "AI Loan Approval ML API is running",
        "service": "Random Forest + SHAP"
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required."
            }), 400

        required_fields = [
            "age",
            "monthlyIncome",
            "loanAmount",
            "loanTenure",
            "interestRate"
        ]

        missing_fields = [
            field
            for field in required_fields
            if field not in data
            or data[field] is None
            or data[field] == ""
        ]

        if missing_fields:
            return jsonify({
                "success": False,
                "message": "Missing required fields.",
                "missing_fields": missing_fields
            }), 400

        result = predict_loan(data)

        return jsonify({
            "success": True,
            "prediction": result
        })

    except ValueError as error:
        return jsonify({
            "success": False,
            "message": str(error)
        }), 400

    except Exception as error:
        print("Prediction error:", error)

        return jsonify({
            "success": False,
            "message": "Prediction failed.",
            "error": str(error)
        }), 500


if __name__ == "__main__":
    print("=" * 60)
    print("AI LOAN APPROVAL ML API")
    print("=" * 60)
    print("Flask server: http://localhost:5001")
    print("Prediction endpoint: POST http://localhost:5001/predict")
    print("Service: Random Forest + SHAP")
    print("=" * 60)

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )