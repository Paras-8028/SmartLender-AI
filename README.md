# SmartLender AI

### AI-Powered Loan Approval, Risk Analysis & Explainable Lending Platform

SmartLender AI is a full-stack AI-powered loan decision-support platform that combines **React, Node.js, Express, Python Flask, Random Forest, and SHAP Explainable AI** to help users evaluate loan applications, calculate EMI, analyze financial risk, and understand AI-generated lending predictions.

> **Project Status:** Working / Complete Local Version

---

## 🚀 Overview

SmartLender AI brings the complete loan assessment workflow into one application.

Users can:

- Create an account and securely log in
- Submit loan applications
- Calculate monthly EMI
- Receive AI-powered loan predictions
- View approval, rejection, and default probabilities
- View risk scores and risk categories
- Analyze debt-to-income ratio
- View Explainable AI insights
- Track previous loan applications
- Monitor loan statistics through a dashboard

Administrators can:

- Access an admin dashboard
- View registered users
- View all loan applications
- Approve loan applications
- Reject loan applications
- Monitor application status

---

## 🎯 Problem Statement

Loan approval requires the analysis of multiple financial attributes. Users often do not know:

- Whether they are likely to qualify for a loan
- How financially risky their application is
- What their expected EMI will be
- Why an application receives a particular prediction

For administrators and lending teams, manually evaluating every application can also be time-consuming.

**SmartLender AI** addresses this by combining:

- Financial analysis
- Machine learning prediction
- Risk assessment
- Explainable AI
- Loan management
- Administrative review

into a single full-stack platform.

---

## ✨ Key Features

### 🔐 User Authentication

- User registration
- User login
- Password hashing with `bcryptjs`
- JWT authentication
- Protected routes
- Role-based authorization
- Admin-only access

### 💰 Loan Application

Users can submit loan applications and the system calculates:

- Annual income
- Disposable income
- Loan-to-income ratio
- Debt-to-income ratio
- Loan status
- AI prediction information
- Prediction update time

### 🧮 EMI Calculator

The EMI calculator provides:

- Monthly EMI
- Total interest payable
- Total repayment amount
- Principal vs. interest visualization
- Complete monthly amortization schedule

The application uses the standard reducing-balance EMI formula:

```text
EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
```

Where:

- `P` = Principal loan amount
- `r` = Monthly interest rate
- `n` = Number of monthly payments

### 🤖 AI Loan Prediction

The machine learning service provides:

- Loan prediction status
- Approval probability
- Rejection probability
- Default probability
- Risk score
- Risk category
- Monthly EMI
- Debt-to-income ratio
- Prediction explanation

### 🔍 Explainable AI

SmartLender AI uses **SHAP** to make model predictions easier to understand.

Instead of only displaying:

```text
Approved / Rejected
```

the platform provides additional information about the prediction, including risk metrics and explanation factors.

### 📊 User Dashboard

The dashboard provides:

- Total loan applications
- Approved applications
- Rejected applications
- Pending applications
- Latest risk score
- Latest risk category
- Latest EMI
- Latest loan decision
- Loan status charts
- Risk distribution charts
- Recent applications
- Quick actions

### 👨‍💼 Admin Dashboard

Administrators can:

- View users
- View loan applications
- Review application details
- Approve loans
- Reject loans
- Monitor lending activity

### 📱 Responsive UI

Built with React and Tailwind CSS for:

- Desktop
- Tablet
- Mobile

---

## 🏗️ System Architecture

```text
                         SMARTLENDER AI
                               |
              +----------------+----------------+
              |                                 |
       React Frontend                    Node.js Backend
              |                                 |
              |                            REST API
              |                                 |
              |                 +---------------+---------------+
              |                 |               |               |
              |           Authentication     Loan APIs     Prediction API
              |                 |               |               |
              |                 +---------------+---------------+
              |                                 |
              |                            Flask ML API
              |                                 |
              |                       Random Forest + SHAP
              |                                 |
              +---------------------------------+
```

---

## 🔄 Application Flow

### User Flow

```text
Landing Page
     |
     v
   Sign Up
     |
     v
   Login
     |
     v
 Dashboard
     |
     +------------------+
     |                  |
     v                  v
Apply Loan        EMI Calculator
     |
     v
Loan Application
     |
     v
AI Prediction
     |
     v
Risk Assessment
     |
     v
Explainable AI
     |
     v
Dashboard
     |
     v
Application Tracking
```

### Admin Flow

```text
Login
  |
  v
Admin Dashboard
  |
  +----> View Users
  |
  +----> View Loans
  |
  +----> Approve Loan
  |
  +----> Reject Loan
```

---

## 🧠 Machine Learning Pipeline

```text
Financial Input
      |
      v
Input Validation
      |
      v
Feature Preparation
      |
      v
Random Forest Model
      |
      +-------------------+
      |                   |
      v                   v
 Prediction          SHAP Analysis
      |                   |
      +---------+---------+
                |
                v
       Explainable Result
                |
                v
          Node.js API
                |
                v
            React UI
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI development |
| React Router | Client-side routing |
| Axios | API communication |
| Tailwind CSS | Styling |
| Vite | Frontend tooling |
| React Icons | UI icons |
| Recharts | Data visualization |
| React Circular Progressbar | Progress visualization |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Server runtime |
| Express.js | REST API |
| Axios | ML API communication |
| JWT | Authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin communication |
| Helmet | HTTP security headers |
| Morgan | Request logging |
| UUID | Unique IDs |
| dotenv | Environment configuration |

### Machine Learning

| Technology | Purpose |
|---|---|
| Python | ML service |
| Flask | ML REST API |
| Flask-CORS | Cross-origin ML requests |
| Random Forest | Loan prediction |
| SHAP | Explainable AI |

### Data Storage

The current implementation uses JSON files:

```text
server/src/data/users.json
server/src/data/applications.json
```

This keeps the local/demo setup simple.

For production, the storage layer should be migrated to a persistent database such as MongoDB or PostgreSQL.

---

## 📁 Project Structure

```text
SMARTLENDER-AI/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StatCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LoanForm.jsx
│   │   │   ├── EMICalculator.jsx
│   │   │   ├── Prediction.jsx
│   │   │   └── Admin.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── loanController.js
│   │   │   ├── predictionController.js
│   │   │   └── adminController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── adminMiddleware.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── loanRoutes.js
│   │   │   ├── predictionRoutes.js
│   │   │   └── adminRoutes.js
│   │   │
│   │   ├── utils/
│   │   │   └── fileHandler.js
│   │   │
│   │   ├── data/
│   │   │   ├── users.json
│   │   │   └── applications.json
│   │   │
│   │   ├── app.js
│   │   └── index.js
│   │
│   └── package.json
│
├── ml/
│   ├── app.py
│   ├── predict.py
│   └── requirements.txt
│
├── README.md
└── .gitignore
```

---

## 🌐 Frontend Routes

### Public Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | User login |
| `/signup` | User registration |

### Protected User Routes

| Route | Description |
|---|---|
| `/dashboard` | User dashboard |
| `/loan-form` | Loan application |
| `/emi-calculator` | EMI calculator |
| `/prediction` | AI prediction |

### Admin Route

| Route | Description |
|---|---|
| `/admin` | Admin dashboard |

---

## 🔌 Backend API

### Authentication

#### Register

```http
POST /api/auth/register
```

Registers a new user.

#### Login

```http
POST /api/auth/login
```

Authenticates a user and returns a JWT.

#### Profile

```http
GET /api/auth/profile
```

Returns authenticated user information.

### Loan

#### Apply

```http
POST /api/loan/apply
```

Submits a loan application.

#### History

```http
GET /api/loan/history
```

Returns the authenticated user's loan history.

#### Single Loan

```http
GET /api/loan/:id
```

Returns a specific loan application.

### Prediction

#### Generate Prediction

```http
POST /api/predict/
```

Generates an AI loan prediction.

#### Prediction Route Test

```http
GET /api/predict/
```

Checks prediction API availability.

### Admin

```http
GET /api/admin/
GET /api/admin/dashboard
GET /api/admin/users
GET /api/admin/loans
PATCH /api/admin/loans/:id/approve
PATCH /api/admin/loans/:id/reject
```

---

## 📐 Financial Metrics

### Annual Income

```text
annualIncome = monthlyIncome × 12
```

### Disposable Income

```text
disposableIncome = monthlyIncome - monthlyExpenses
```

### Loan-to-Income Ratio

```text
loanToIncome = (loanAmount / annualIncome) × 100
```

### Debt-to-Income Ratio

```text
debtToIncomeRatio =
((monthlyExpenses + existingEMI) / monthlyIncome) × 100
```

These metrics provide additional financial context for the loan application and AI prediction.

---

## 🔐 Security

SmartLender AI implements:

- JWT authentication
- Bearer token authorization
- Password hashing with bcryptjs
- Protected frontend routes
- Protected backend routes
- Admin role verification
- Helmet security middleware
- CORS configuration
- Token expiration handling

### Important

Never commit:

```text
.env
API keys
JWT secrets
Passwords
Database credentials
Private credentials
```

Use environment variables for sensitive configuration.

---

## ⚙️ Environment Variables

### Backend

Create:

```text
server/.env
```

Example:

```env
PORT=5000
JWT_SECRET=your_secret
ML_API_URL=http://127.0.0.1:5001
CLIENT_URL=http://localhost:5173
```

### Frontend

Create:

```text
client/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

> Do not use real production secrets in the repository.

---

## 💻 Local Development

### Prerequisites

Install:

- Node.js
- npm
- Python 3
- Git

### 1. Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd SmartLender-AI
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

### 4. Install ML Dependencies

```bash
cd ../ml
pip install -r requirements.txt
```

---

## ▶️ Run the Application

SmartLender AI consists of three services.

### Terminal 1 — ML Service

```bash
cd ml
python app.py
```

ML API:

```text
http://localhost:5001
```

### Terminal 2 — Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Terminal 3 — Frontend

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 📜 NPM Scripts

### Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates the production build.

```bash
npm run preview
```

Previews the production build.

```bash
npm run lint
```

Runs Oxlint.

### Backend

```bash
npm run dev
```

Starts the backend with Nodemon.

```bash
npm start
```

Starts the backend with Node.js.

---

## 🧪 Testing Checklist

### Authentication

- [ ] Register a user
- [ ] Login with valid credentials
- [ ] Reject invalid credentials
- [ ] Verify protected routes
- [ ] Verify expired token handling
- [ ] Logout

### Loan Application

- [ ] Submit a loan
- [ ] Generate application ID
- [ ] Calculate financial metrics
- [ ] View loan history
- [ ] View individual loan
- [ ] Prevent unauthorized access

### EMI Calculator

- [ ] Calculate EMI
- [ ] Validate empty fields
- [ ] Validate invalid values
- [ ] Display total interest
- [ ] Display total repayment
- [ ] Display amortization schedule

### AI Prediction

- [ ] Submit prediction
- [ ] Validate required fields
- [ ] Verify ML API communication
- [ ] Display approval probability
- [ ] Display rejection probability
- [ ] Display default probability
- [ ] Display risk score
- [ ] Display risk category
- [ ] Display explanation
- [ ] Save prediction to application

### Admin

- [ ] Admin login
- [ ] Reject non-admin access
- [ ] View users
- [ ] View loans
- [ ] Approve loan
- [ ] Reject loan

---

## 🚀 Deployment Architecture

Recommended production architecture:

```text
                    Internet
                       |
                       v
              React Frontend
                       |
                       v
             Node.js / Express API
                       |
                       v
                Flask ML API
                       |
                       v
             Persistent Database
```

For deployment, update:

- Frontend API URL
- Backend ML API URL
- Production CORS
- JWT secret
- Database configuration

The current JSON-based storage is suitable for a local/demo project but should be replaced with persistent database storage for production.

---

## 🔮 Future Enhancements

- [ ] MongoDB/PostgreSQL integration
- [ ] Refresh-token authentication
- [ ] Email verification
- [ ] Password reset
- [ ] User profile management
- [ ] Document upload
- [ ] Downloadable PDF loan reports
- [ ] Downloadable AI prediction reports
- [ ] Multiple ML model comparison
- [ ] Model performance dashboard
- [ ] Model version tracking
- [ ] Email/SMS notifications
- [ ] Advanced admin analytics
- [ ] Search and filtering
- [ ] Pagination
- [ ] Audit logs
- [ ] Automated testing
- [ ] CI/CD
- [ ] Docker support
- [ ] Production monitoring
- [ ] ML retraining pipeline
- [ ] Fairness and bias evaluation
- [ ] Multilingual support

---

## 🤝 Contributing

Contributions are welcome.

### Recommended Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature

# Make changes and test locally

# Commit
git commit -m "Add your feature"

# Push
git push origin feature/your-feature
```

Then open a Pull Request.

---

## ⚠️ Disclaimer

SmartLender AI is an **educational and demonstration project**.

AI-generated loan predictions should not be treated as professional financial advice or as an actual lending decision.

A real-world lending platform would require:

- Regulatory compliance
- Secure production databases
- Model validation
- Model monitoring
- Auditing
- Data privacy controls
- Bias and fairness evaluation
- Secure infrastructure
- Human oversight

---

## 📌 GitHub Repository Description

> **SmartLender AI — AI-powered full-stack loan approval, risk analysis and Explainable AI platform built with React, Node.js, Python, Random Forest and SHAP.**

---

## 🏷️ Suggested GitHub Topics

```text
ai
artificial-intelligence
machine-learning
explainable-ai
shap
random-forest
loan-prediction
loan-approval
fintech
react
nodejs
expressjs
python
flask
tailwindcss
jwt
full-stack
risk-analysis
```

---

## 📸 Project Showcase

For a polished GitHub repository, add screenshots here after deployment:

```text
screenshots/
├── landing-page.png
├── login.png
├── signup.png
├── dashboard.png
├── loan-form.png
├── emi-calculator.png
├── prediction.png
└── admin-dashboard.png
```

Example:

```markdown
## 📸 Screenshots

### Landing Page
![Landing Page](screenshots/landing-page.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### AI Prediction
![AI Prediction](screenshots/prediction.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)
```

---

## 👨‍💻 Project Summary

SmartLender AI demonstrates the integration of:

- Full-stack web development
- REST API architecture
- Authentication and authorization
- Financial calculations
- Machine learning
- Random Forest
- Explainable AI with SHAP
- Data visualization
- Risk analysis
- Administrative workflows

The complete workflow is:

```text
User Registration
       ↓
Secure Authentication
       ↓
Loan Application
       ↓
Financial Analysis
       ↓
AI Prediction
       ↓
Risk Assessment
       ↓
Explainable AI
       ↓
User Dashboard
       ↓
Admin Review
       ↓
Loan Approval / Rejection
```

---

# SmartLender AI

### AI-Powered Loan Approval, Risk Analysis & Explainable Lending Platform

Built as a full-stack AI project combining modern web development, machine learning, financial analysis, and Explainable AI.
