import React, { useState } from 'react';
import { patientAPI, predictionAPI } from '../api/api';

const Prediction = () => {
  const [step, setStep] = useState(1);
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male' });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [symptoms, setSymptoms] = useState({
    fever: 0,
    headache: 0,
    chills: 0,
    sweating: 0,
    vomiting: 0,
    fatigue: 0,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Load patients
  const loadPatients = async () => {
    try {
      const res = await patientAPI.getAllPatients();
      setPatients(res.data);
    } catch (err) {
      setError('Failed to load patients');
    }
  };

  // Step 1: Add new patient
  const handleAddPatient = async () => {
    if (!newPatient.name || !newPatient.age) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await patientAPI.addPatient(newPatient.name, newPatient.age, newPatient.gender);
      setPatients([...patients, res.data.patient]);
      setSelectedPatient(res.data.patient);
      setNewPatient({ name: '', age: '', gender: 'Male' });
      setStep(2);
    } catch (err) {
      setError('Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Predict
  const handlePredict = async () => {
    try {
      setLoading(true);
      const res = await predictionAPI.predict(selectedPatient.id, symptoms);
      setResult(res.data.prediction);
      setStep(3);
    } catch (err) {
      setError('Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Patient Selection
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Select or Add Patient</h3>

          {/* Existing Patients */}
          <div className="mb-6">
            <h4 className="text-gray-700 font-bold mb-2">Existing Patients</h4>
            <button
              onClick={loadPatients}
              className="mb-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Load Patients
            </button>
            {patients.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {patients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatient(p);
                      setStep(2);
                    }}
                    className="p-3 border border-gray-300 rounded hover:bg-blue-50 text-left"
                  >
                    <p className="font-bold">{p.name}</p>
                    <p className="text-sm text-gray-600">Age: {p.age} | Gender: {p.gender}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add New Patient */}
          <div className="border-t pt-6">
            <h4 className="text-gray-700 font-bold mb-3">Add New Patient</h4>
            <input
              type="text"
              placeholder="Patient Name"
              value={newPatient.name}
              onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="number"
              placeholder="Age"
              value={newPatient.age}
              onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
            />
            <select
              value={newPatient.gender}
              onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <button
              onClick={handleAddPatient}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Patient & Continue'}
            </button>
          </div>
        </div>
        {error && <div className="p-3 bg-red-500 text-white rounded">{error}</div>}
      </div>
    );
  }

  // Step 2: Symptoms Input
  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Symptom Assessment</h3>
          <p className="text-gray-600 mb-4">Patient: {selectedPatient?.name}</p>

          <div className="space-y-4">
            {Object.entries(symptoms).map(([symptom, value]) => (
              <div key={symptom}>
                <label className="block text-gray-700 font-bold mb-2 capitalize">
                  {symptom}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={symptom}
                      value="0"
                      checked={value === 0}
                      onChange={() => setSymptoms({ ...symptoms, [symptom]: 0 })}
                      className="mr-2"
                    />
                    No
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={symptom}
                      value="1"
                      checked={value === 1}
                      onChange={() => setSymptoms({ ...symptoms, [symptom]: 1 })}
                      className="mr-2"
                    />
                    Yes
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handlePredict}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Predicting...' : 'Get Prediction'}
            </button>
          </div>
        </div>
        {error && <div className="p-3 bg-red-500 text-white rounded">{error}</div>}
      </div>
    );
  }

  // Step 3: Results
  if (step === 3 && result) {
    return (
      <div className="space-y-6">
        <div className={`rounded-lg shadow p-6 text-white ${
          result.result === 'Positive' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          <h3 className="text-2xl font-bold mb-2">Prediction Result</h3>
          <p className="text-lg">Patient: {selectedPatient?.name}</p>
          <p className="text-3xl font-bold mt-4">{result.result}</p>
          <p className="text-lg mt-2">Confidence: {(result.confidence * 100).toFixed(2)}%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-gray-700 font-bold mb-3">Assessed Symptoms:</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(symptoms).map(([symptom, value]) => (
              <p key={symptom} className="text-gray-700">
                <span className="font-bold capitalize">{symptom}:</span> {value === 1 ? 'Yes' : 'No'}
              </p>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setStep(1);
              setSelectedPatient(null);
              setSymptoms({ fever: 0, headache: 0, chills: 0, sweating: 0, vomiting: 0, fatigue: 0 });
              setResult(null);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            New Prediction
          </button>
        </div>
      </div>
    );
  }
};

export default Prediction;
