from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///malaria_db.sqlite3')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))

db = SQLAlchemy(app)
jwt = JWTManager(app)
ma = Marshmallow(app)
CORS(app)

# Import blueprints
from routes import auth_bp, prediction_bp, patient_bp, analytics_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(prediction_bp, url_prefix='/api/prediction')
app.register_blueprint(patient_bp, url_prefix='/api/patient')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

@app.route('/api/health', methods=['GET'])
def health():
    return {'status': 'OK', 'message': 'Malaria Prediction System is running'}, 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
