from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Patient, User

patient_bp = Blueprint('patient', __name__)

@patient_bp.route('/add', methods=['POST'])
@jwt_required()
def add_patient():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('age') or not data.get('gender'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    patient = Patient(
        user_id=current_user_id,
        name=data['name'],
        age=data['age'],
        gender=data['gender']
    )
    
    db.session.add(patient)
    db.session.commit()
    
    return jsonify({'message': 'Patient added successfully', 'patient': patient.to_dict()}), 201

@patient_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_patients():
    current_user_id = get_jwt_identity()
    patients = Patient.query.filter_by(user_id=current_user_id).all()
    
    return jsonify([patient.to_dict() for patient in patients]), 200

@patient_bp.route('/<int:patient_id>', methods=['GET'])
@jwt_required()
def get_patient(patient_id):
    current_user_id = get_jwt_identity()
    patient = Patient.query.filter_by(id=patient_id, user_id=current_user_id).first()
    
    if not patient:
        return jsonify({'message': 'Patient not found'}), 404
    
    return jsonify(patient.to_dict()), 200

@patient_bp.route('/<int:patient_id>', methods=['PUT'])
@jwt_required()
def update_patient(patient_id):
    current_user_id = get_jwt_identity()
    patient = Patient.query.filter_by(id=patient_id, user_id=current_user_id).first()
    
    if not patient:
        return jsonify({'message': 'Patient not found'}), 404
    
    data = request.get_json()
    patient.name = data.get('name', patient.name)
    patient.age = data.get('age', patient.age)
    patient.gender = data.get('gender', patient.gender)
    
    db.session.commit()
    
    return jsonify({'message': 'Patient updated successfully', 'patient': patient.to_dict()}), 200

@patient_bp.route('/<int:patient_id>', methods=['DELETE'])
@jwt_required()
def delete_patient(patient_id):
    current_user_id = get_jwt_identity()
    patient = Patient.query.filter_by(id=patient_id, user_id=current_user_id).first()
    
    if not patient:
        return jsonify({'message': 'Patient not found'}), 404
    
    db.session.delete(patient)
    db.session.commit()
    
    return jsonify({'message': 'Patient deleted successfully'}), 200
