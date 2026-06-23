# Malaria Prediction System

A comprehensive healthcare application that uses machine learning to predict malaria infection based on patient symptoms.

## Project Overview

This system is designed to assist healthcare professionals in early detection and diagnosis of malaria infections. It combines a modern React frontend with a Flask backend and machine learning capabilities.

## Features

### Frontend (React)
- Modern and responsive user interface
- Professional healthcare theme dashboard
- Patient information forms and symptom input
- Prediction results with confidence scores
- Patient history tracking
- Analytics dashboard
- Sidebar navigation
- Authentication with role-based access

### Backend (Flask)
- REST API endpoints for prediction
- Patient data management
- Prediction history storage
- User authentication and authorization
- Role-based access control (Admin, Healthcare Staff)
- Database integration with SQLAlchemy

### Machine Learning
- Trained ML model for malaria prediction
- Features: Age, Gender, Fever, Headache, Chills, Sweating, Vomiting, Fatigue
- Outputs: Malaria Positive/Negative with confidence score

### Database
- User management and authentication
- Patient records storage
- Prediction history with confidence scores
- Date tracking for all records

## Project Structure

```
malaria-prediction-system/
├── backend/
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── patient.py
│   │   ├── prediction.py
│   │   └── analytics.py
│   ├── models.py
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   └── Card.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Prediction.js
│   │   │   ├── PatientHistory.js
│   │   │   ├── Analytics.js
│   │   │   └── About.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create .env file:
```bash
cp .env.example .env
```

5. Run the Flask app:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout user

### Patient Management
- `POST /api/patient/add` - Add new patient
- `GET /api/patient/all` - Get all patients
- `GET /api/patient/<id>` - Get specific patient
- `PUT /api/patient/<id>` - Update patient
- `DELETE /api/patient/<id>` - Delete patient

### Prediction
- `POST /api/prediction/predict` - Make prediction
- `GET /api/prediction/history/<patient_id>` - Get prediction history

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/recent-predictions` - Get recent predictions

## Models

### User Model
- ID, Username, Email, Password (hashed)
- Role (Admin/Staff)
- Timestamps

### Patient Model
- ID, Name, Age, Gender
- User ID (Foreign Key)
- Timestamps

### Prediction Model
- ID, Patient ID, Symptoms (Fever, Headache, Chills, Sweating, Vomiting, Fatigue)
- Result, Confidence Score
- Timestamp

## Environment Variables

### Backend (.env)
```
FLASK_ENV=development
FLASK_APP=app.py
DATABASE_URL=sqlite:///malaria_db.sqlite3
JWT_SECRET_KEY=your-secret-key-change-this
JWT_ACCESS_TOKEN_EXPIRES=3600
MODEL_PATH=./models/malaria_model.pkl
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Technologies Used

### Frontend
- React 18
- React Router
- Axios
- Tailwind CSS
- Chart.js
- React Icons

### Backend
- Flask
- SQLAlchemy
- JWT Authentication
- scikit-learn
- NumPy
- Pandas

## Next Steps

1. Add your trained ML model to `backend/models/malaria_model.pkl`
2. Customize the dashboard colors and branding
3. Add more detailed analytics and reporting
4. Implement email notifications
5. Add data export functionality
6. Deploy to production

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
