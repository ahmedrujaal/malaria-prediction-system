# Backend Setup Guide - Malaria Prediction System

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- git
- 2GB RAM (minimum)
- 500MB disk space

---

## Installation Steps

### For Linux/macOS Users

#### 1. **Navigate to Backend Directory**
```bash
cd backend
```

#### 2. **Make Setup Script Executable**
```bash
chmod +x setup_backend.sh
```

#### 3. **Run Setup Script**
```bash
./setup_backend.sh
```

The script will:
- ✓ Check Python installation
- ✓ Create virtual environment
- ✓ Activate virtual environment
- ✓ Install all dependencies
- ✓ Setup .env file
- ✓ Create models directory
- ✓ Initialize database
- ✓ Create default users (optional)

---

### For Windows Users

#### 1. **Navigate to Backend Directory**
```cmd
cd backend
```

#### 2. **Run Setup Script**
```cmd
setup_backend.bat
```

The script will:
- ✓ Check Python installation
- ✓ Create virtual environment
- ✓ Activate virtual environment
- ✓ Install all dependencies
- ✓ Setup .env file
- ✓ Create models directory
- ✓ Initialize database
- ✓ Create default users (optional)

---

### Manual Setup (If Scripts Don't Work)

#### 1. **Create Virtual Environment**
```bash
# Linux/macOS
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate.bat
```

#### 2. **Upgrade pip**
```bash
pip install --upgrade pip setuptools wheel
```

#### 3. **Install Requirements**
```bash
pip install -r requirements.txt
```

#### 4. **Setup Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` file and update:
- `JWT_SECRET_KEY` - Change to a strong secret key
- `DATABASE_URL` - Update if using different database

#### 5. **Create Models Directory**
```bash
mkdir models
```

#### 6. **Initialize Database**
```bash
python
```

Inside Python shell:
```python
from app import app, db
with app.app_context():
    db.create_all()
exit()
```

#### 7. **Create Default Users (Optional)**
```bash
python
```

Inside Python shell:
```python
from app import app, db
from models import User

with app.app_context():
    # Create admin user
    admin = User(username='admin', email='admin@malaria.local', role='admin')
    admin.set_password('admin123')
    db.session.add(admin)
    
    # Create staff user
    staff = User(username='staff', email='staff@malaria.local', role='staff')
    staff.set_password('staff123')
    db.session.add(staff)
    
    db.session.commit()
    print("Users created successfully!")
exit()
```

---

## Running the Backend

### 1. **Activate Virtual Environment** (if not already activated)

**Linux/macOS:**
```bash
source venv/bin/activate
```

**Windows:**
```cmd
venv\Scripts\activate.bat
```

### 2. **Start Flask Server**
```bash
python app.py
```

You should see:
```
🚀 Starting Malaria Prediction System in development mode...
📊 API Documentation: http://localhost:5000/api
❤️  Health Check: http://localhost:5000/api/health
 * Running on http://0.0.0.0:5000
```

### 3. **Test the API**

Open your browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Malaria Prediction System is running",
  "environment": "development"
}
```

---

## Configuration

### Environment Variables (.env)

```env
# Flask Configuration
FLASK_ENV=development          # Set to 'production' for production
FLASK_APP=app.py               # Main app file

# Database
DATABASE_URL=sqlite:///malaria_db.sqlite3
# For PostgreSQL: postgresql://user:password@localhost:5432/malaria_db

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here    # Change this!
JWT_ACCESS_TOKEN_EXPIRES=3600          # 1 hour in seconds

# ML Model
MODEL_PATH=./models/malaria_model.pkl  # Path to your ML model
```

---

## Database Setup

### Supported Databases

1. **SQLite** (Default - Development)
   - File-based database
   - No server needed
   - Good for development and testing

2. **PostgreSQL** (Recommended for Production)
   - Scalable relational database
   - Better for production environments

#### PostgreSQL Setup Example

1. Install PostgreSQL
2. Create database and user:
```sql
CREATE DATABASE malaria_db;
CREATE USER malaria_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE malaria_db TO malaria_user;
```

3. Update `.env`:
```env
DATABASE_URL=postgresql://malaria_user:secure_password@localhost:5432/malaria_db
```

4. Install PostgreSQL adapter:
```bash
pip install psycopg2-binary
```

---

## Adding ML Model

1. **Place your trained model** in `models/` directory
   - File should be named: `malaria_model.pkl`
   - Model must have `predict()` and `predict_proba()` methods

2. **Verify model features** match the expected features:
   - Age (numeric)
   - Gender (0=Female, 1=Male)
   - Fever (0/1)
   - Headache (0/1)
   - Chills (0/1)
   - Sweating (0/1)
   - Vomiting (0/1)
   - Fatigue (0/1)

3. **Test the model**:
```python
import joblib
import numpy as np

model = joblib.load('models/malaria_model.pkl')
features = np.array([[25, 1, 1, 1, 1, 1, 1, 1]])  # Sample data
prediction = model.predict(features)
confidence = model.predict_proba(features)
print(f"Prediction: {prediction[0]}, Confidence: {max(confidence[0])}")
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires token)
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

---

## Troubleshooting

### Error: "No module named 'app'"
**Solution:** Make sure you're in the backend directory and virtual environment is activated

### Error: "Database is locked"
**Solution:** Delete `malaria_db.sqlite3` file and reinitialize:
```bash
rm malaria_db.sqlite3
python app.py
```

### Error: "Module not found"
**Solution:** Reinstall requirements:
```bash
pip install --force-reinstall -r requirements.txt
```

### Port 5000 already in use
**Solution:** Change port in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Use different port
```

### Connection refused when accessing API
**Solution:** Make sure backend is running:
```bash
python app.py
```

---

## Development Tips

### Enable Debug Mode
Edit `.env`:
```env
FLASK_ENV=development
FLASK_DEBUG=1
```

### Database Inspection
```bash
python
>>> from app import app, db
>>> with app.app_context():
...     from models import User, Patient, Prediction
...     print(User.query.all())
...     print(Patient.query.all())
...     print(Prediction.query.all())
```

### Clear Database
```bash
python
>>> from app import app, db
>>> with app.app_context():
...     db.drop_all()
...     db.create_all()
...     print("Database reset!")
```

---

## Next Steps

1. ✅ Backend setup complete
2. 📦 Add your ML model to `models/malaria_model.pkl`
3. 🚀 Run `python app.py` to start the server
4. 🌐 Setup frontend with `npm install` in frontend directory
5. 📱 Connect frontend to backend API

---

## Support

If you encounter issues:
1. Check error messages carefully
2. Review logs in terminal
3. Verify all requirements are installed
4. Check database connection
5. Verify environment variables are set correctly

---

**Happy Coding! 🎉**
