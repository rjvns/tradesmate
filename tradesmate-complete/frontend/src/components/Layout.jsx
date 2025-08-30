import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-blue-600">TradesMate</span>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-4">
              <Button
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                onClick={() => navigate('/dashboard')}
                className={`${isActive('/dashboard') ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'hover:bg-gray-100'} transition-colors`}
              >
                🏠 Dashboard
              </Button>
              <Button
                variant={isActive('/quotes') ? 'default' : 'ghost'}
                onClick={() => navigate('/quotes')}
                className={`${isActive('/quotes') ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'hover:bg-gray-100'} transition-colors`}
              >
                📄 Quotes
              </Button>
              <Button
                variant={isActive('/calendar') ? 'default' : 'ghost'}
                onClick={() => navigate('/calendar')}
                className={`${isActive('/calendar') ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 'hover:bg-gray-100'} transition-colors`}
              >
                📅 Calendar
              </Button>
            </nav>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-gray-700">
                Welcome, {user?.name || 'User'}!
              </span>
              <Button
                variant="ghost"
                onClick={() => navigate('/settings')}
                className={`${isActive('/settings') ? 'bg-gray-100 text-gray-800' : 'hover:bg-gray-100'} transition-colors`}
              >
                ⚙️ Settings
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t bg-gray-50">
          <div className="px-4 py-2 flex space-x-2 overflow-x-auto">
            <Button
              size="sm"
              variant={isActive('/dashboard') ? 'default' : 'ghost'}
              onClick={() => navigate('/dashboard')}
              className={`${isActive('/dashboard') ? 'bg-green-100 text-green-800' : ''} whitespace-nowrap`}
            >
              🏠 Dashboard
            </Button>
            <Button
              size="sm"
              variant={isActive('/quotes') ? 'default' : 'ghost'}
              onClick={() => navigate('/quotes')}
              className={`${isActive('/quotes') ? 'bg-blue-100 text-blue-800' : ''} whitespace-nowrap`}
            >
              📄 Quotes
            </Button>
            <Button
              size="sm"
              variant={isActive('/calendar') ? 'default' : 'ghost'}
              onClick={() => navigate('/calendar')}
              className={`${isActive('/calendar') ? 'bg-orange-100 text-orange-800' : ''} whitespace-nowrap`}
            >
              📅 Calendar
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
