import React, { useState, useEffect } from 'react';
import { analyticsAPI, patientAPI } from '../api/api';
import Card from '../components/Card';
import { FiUsers, FiActivity, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await analyticsAPI.getDashboard();
      const predictionsRes = await analyticsAPI.getRecentPredictions();
      
      setStats(statsRes.data);
      setRecentPredictions(predictionsRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={FiUsers} title="Total Patients" value={stats?.total_patients || 0} />
        <Card icon={FiActivity} title="Total Predictions" value={stats?.total_predictions || 0} />
        <Card
          icon={FiTrendingUp}
          title="Positive Cases"
          value={stats?.positive_cases || 0}
          subtitle={`${stats?.positive_percentage || 0}%`}
          color="red"
        />
        <Card
          icon={FiTrendingDown}
          title="Negative Cases"
          value={stats?.negative_cases || 0}
          subtitle={`${stats?.negative_percentage || 0}%`}
          color="green"
        />
      </div>

      {/* Recent Predictions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Predictions</h3>
        {recentPredictions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700">Patient ID</th>
                  <th className="px-4 py-2 text-left text-gray-700">Result</th>
                  <th className="px-4 py-2 text-left text-gray-700">Confidence</th>
                  <th className="px-4 py-2 text-left text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPredictions.map((pred) => (
                  <tr key={pred.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800">{pred.patient_id}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          pred.result === 'Positive' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      >
                        {pred.result}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-800">{(pred.confidence * 100).toFixed(2)}%</td>
                    <td className="px-4 py-2 text-gray-800">
                      {new Date(pred.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No predictions yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
