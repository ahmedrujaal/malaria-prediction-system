import React, { useState, useEffect } from 'react';
import { patientAPI, predictionAPI } from '../api/api';

const PatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await patientAPI.getAllPatients();
      setPatients(res.data);
    } catch (err) {
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    try {
      const res = await predictionAPI.getPredictionHistory(patient.id);
      setPredictions(res.data);
    } catch (err) {
      setError('Failed to load prediction history');
    }
  };

  if (loading) return <div className="text-center text-gray-600">Loading patients...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Patients List */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Patients</h3>
        {patients.length > 0 ? (
          <div className="space-y-2">
            {patients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => handleSelectPatient(patient)}
                className={`w-full p-3 text-left rounded border-2 transition ${
                  selectedPatient?.id === patient.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <p className="font-bold">{patient.name}</p>
                <p className="text-sm text-gray-600">Age: {patient.age}</p>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No patients found</p>
        )}
      </div>

      {/* Predictions List */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        {selectedPatient ? (
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Prediction History</h3>
            <p className="text-gray-600 mb-4">Patient: {selectedPatient.name}</p>
            {predictions.length > 0 ? (
              <div className="space-y-4">
                {predictions.map((pred) => (
                  <div key={pred.id} className="p-4 border border-gray-200 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          pred.result === 'Positive' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      >
                        {pred.result}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {new Date(pred.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      Confidence: {(pred.confidence * 100).toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No predictions for this patient</p>
            )}
          </>
        ) : (
          <p className="text-gray-600 text-center py-8">Select a patient to view history</p>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;
