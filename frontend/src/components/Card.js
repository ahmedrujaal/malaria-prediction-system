import React from 'react';

const Card = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
  const colorClass = {
    blue: 'text-blue-500 bg-blue-50',
    red: 'text-red-500 bg-red-50',
    green: 'text-green-500 bg-green-50',
    purple: 'text-purple-500 bg-purple-50',
  }[color] || 'text-blue-500 bg-blue-50';

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center mb-3`}>
        <Icon className="text-2xl" />
      </div>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

export default Card;
