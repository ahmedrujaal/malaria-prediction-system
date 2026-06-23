from .auth import auth_bp
from .prediction import prediction_bp
from .patient import patient_bp
from .analytics import analytics_bp

__all__ = ['auth_bp', 'prediction_bp', 'patient_bp', 'analytics_bp']
