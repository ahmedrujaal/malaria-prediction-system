import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authAPI = {
  register: (username, email, password, role = 'staff') =>
    api.post('/auth/register', { username, email, password, role }),
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  profile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
};

// Patient endpoints
export const patientAPI = {
  addPatient: (name, age, gender) =>
    api.post('/patient/add', { name, age, gender }),
  getAllPatients: () => api.get('/patient/all'),
  getPatient: (patientId) => api.get(`/patient/${patientId}`),
  updatePatient: (patientId, data) =>
    api.put(`/patient/${patientId}`, data),
  deletePatient: (patientId) => api.delete(`/patient/${patientId}`),
};

// Prediction endpoints
export const predictionAPI = {
  predict: (patientId, symptoms) =>
    api.post('/prediction/predict', {
      patient_id: patientId,
      ...symptoms,
    }),
  getPredictionHistory: (patientId) =>
    api.get(`/prediction/history/${patientId}`),
};

// Analytics endpoints
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getRecentPredictions: () => api.get('/analytics/recent-predictions'),
};

export default api;
