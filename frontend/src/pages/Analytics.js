import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../api/api';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsAPI.getDashboard();
      setStats(res.data);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-gray-600">Loading analytics...</div>;

  const pieData = {
    labels: ['Positive', 'Negative'],
    datasets: [
      {
        label: 'Cases',
        data: [stats?.positive_cases || 0, stats?.negative_cases || 0],
        backgroundColor: ['#ef4444', '#22c55e'],
        borderColor: ['#dc2626', '#16a34a'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Positive', 'Negative'],
    datasets: [
      {
        label: 'Number of Cases',
        data: [stats?.positive_cases || 0, stats?.negative_cases || 0],
        backgroundColor: ['#ef4444', '#22c55e'],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Patients</p>
          <p className="text-3xl font-bold text-gray-800">{stats?.total_patients}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Predictions</p>
          <p className="text-3xl font-bold text-gray-800">{stats?.total_predictions}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Positive (%)</p>
          <p className="text-3xl font-bold text-red-500">{stats?.positive_percentage}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Negative (%)</p>
          <p className="text-3xl font-bold text-green-500">{stats?.negative_percentage}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Cases Distribution</h3>
          <Pie data={pieData} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Cases Breakdown</h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
