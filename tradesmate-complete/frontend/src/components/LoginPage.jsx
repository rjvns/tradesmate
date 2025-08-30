import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EnhancedAuthScreen from './enhanced/EnhancedAuthScreen';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleLogin = (userData, token) => {
    login(userData, token);
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedAuthScreen onLogin={handleLogin} />
    </div>
  );
}

export default LoginPage;
