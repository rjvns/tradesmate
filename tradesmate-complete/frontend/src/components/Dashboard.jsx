import React from 'react';
import EnhancedDashboard from './enhanced/EnhancedDashboard';

function Dashboard() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
      </div>
      
      {/* Use the existing enhanced dashboard component */}
      <EnhancedDashboard />
    </div>
  );
}

export default Dashboard;
