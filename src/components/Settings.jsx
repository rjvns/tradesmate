import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SettingsScreen from './SettingsScreen';

function Settings() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => {
    setShowModal(false);
    navigate('/dashboard'); // Navigate back to dashboard when closed
  };

  const handleUpdateUser = (updatedUser) => {
    // Update user in context
    if (updateUser) {
      updateUser(updatedUser);
    }
    console.log('User updated:', updatedUser);
  };

  if (!showModal) {
    return null;
  }

  return (
    <SettingsScreen 
      user={user}
      onUpdateUser={handleUpdateUser}
      onClose={handleClose}
    />
  );
}

export default Settings;
