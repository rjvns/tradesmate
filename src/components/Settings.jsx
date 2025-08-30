import React from 'react';
import SettingsScreen from './SettingsScreen';

function Settings() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>
      
      {/* Use the existing settings component */}
      <SettingsScreen />
    </div>
  );
}

export default Settings;
