from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure app
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///malaria_db.sqlite3')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
ma = Marshmallow(app)
CORS(app)

# Health check endpoint (before importing routes)
@app.route('/api/health', methods=['GET'])
def health():
    return {
        'status': 'OK',
        'message': 'Malaria Prediction System is running',
        'environment': os.getenv('FLASK_ENV', 'development')
    }, 200

# Import routes after app initialization
from routes.auth import auth_bp
from routes.patient import patient_bp
from routes.prediction import prediction_bp
from routes.analytics import analytics_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(patient_bp, url_prefix='/api/patient')
app.register_blueprint(prediction_bp, url_prefix='/api/prediction')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return {'message': 'Resource not found'}, 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return {'message': 'Internal server error'}, 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully!")
    
    print(f"\n🚀 Starting Malaria Prediction System in {os.getenv('FLASK_ENV', 'development')} mode...")
    print("📊 API Documentation: http://localhost:5000/api")
    print("❤️  Health Check: http://localhost:5000/api/health\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
