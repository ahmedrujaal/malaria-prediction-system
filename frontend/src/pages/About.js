import React from 'react';
import { FiHeart, FiZap, FiShield } from 'react-icons/fi';

const About = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">About MalariaAI</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          MalariaAI is an advanced predictive system designed to assist healthcare professionals in early detection and diagnosis of malaria infections. Using machine learning algorithms trained on extensive clinical data, our system provides accurate predictions to support clinical decision-making.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <FiHeart className="text-red-500 text-4xl mb-3" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Healthcare-Focused</h3>
          <p className="text-gray-700">
            Designed specifically for healthcare professionals to assist in patient diagnosis and care.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <FiZap className="text-yellow-500 text-4xl mb-3" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">AI-Powered</h3>
          <p className="text-gray-700">
            Leverages advanced machine learning for accurate predictions based on patient symptoms.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <FiShield className="text-blue-500 text-4xl mb-3" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Secure & Private</h3>
          <p className="text-gray-700">
            Enterprise-grade security to protect patient data and ensure privacy compliance.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Features</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center"><span className="mr-3">✓</span> Patient Information Management</li>
          <li className="flex items-center"><span className="mr-3">✓</span> Symptom-Based Prediction</li>
          <li className="flex items-center"><span className="mr-3">✓</span> Prediction History Tracking</li>
          <li className="flex items-center"><span className="mr-3">✓</span> Comprehensive Analytics Dashboard</li>
          <li className="flex items-center"><span className="mr-3">✓</span> Role-Based Access Control</li>
          <li className="flex items-center"><span className="mr-3">✓</span> User Authentication & Authorization</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
