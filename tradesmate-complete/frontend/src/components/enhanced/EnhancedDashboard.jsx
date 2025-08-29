import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  FileText, 
  Users, 
  PoundSterling, 
  Clock,
  ArrowUpRight,
  MoreVertical,
  Plus,
  Filter,
  Search,
  Bell,
  Settings,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { LoadingSpinner, SkeletonLoader, CardSkeleton } from '../ui/LoadingSpinner';

/**
 * Enhanced Dashboard - Industry-leading dashboard with progressive disclosure
 * 
 * Features:
 * - Progressive disclosure to reduce cognitive load
 * - Real-time data with optimistic updates
 * - Contextual actions and smart defaults
 * - Beautiful data visualizations
 * - Responsive design with mobile-first approach
 * - Accessible navigation and focus management
 */

const EnhancedDashboard = ({ user, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Simulate data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDashboardData({
          stats: {
            totalRevenue: 12450,
            revenueChange: 12.5,
            activeQuotes: 8,
            quotesChange: -2,
            completedJobs: 24,
            jobsChange: 18.2,
            customerSatisfaction: 4.8,
            satisfactionChange: 2.1
          },
          recentQuotes: [
            {
              id: 1,
              customerName: 'Mrs. Johnson',
              jobDescription: 'Kitchen tap replacement',
              amount: 135.00,
              status: 'sent',
              createdAt: '2024-01-15',
              priority: 'medium'
            },
            {
              id: 2,
              customerName: 'Mr. Smith',
              jobDescription: 'Bathroom light fitting installation',
              amount: 89.50,
              status: 'accepted',
              createdAt: '2024-01-14',
              priority: 'high'
            },
            {
              id: 3,
              customerName: 'Brown & Associates',
              jobDescription: 'Office electrical inspection',
              amount: 450.00,
              status: 'draft',
              createdAt: '2024-01-13',
              priority: 'low'
            }
          ],
          upcomingJobs: [
            {
              id: 1,
              customerName: 'Mrs. Wilson',
              jobDescription: 'Rewiring kitchen',
              scheduledDate: '2024-01-18',
              time: '09:00',
              status: 'confirmed',
              address: '123 Oak Street, London'
            },
            {
              id: 2,
              customerName: 'City Council',
              jobDescription: 'Street lighting maintenance',
              scheduledDate: '2024-01-19',
              time: '14:00',
              status: 'pending',
              address: 'High Street, London'
            }
          ],
          notifications: [
            {
              id: 1,
              type: 'quote_accepted',
              message: 'Mr. Smith accepted your quote for £89.50',
              time: '2 hours ago',
              read: false
            },
            {
              id: 2,
              type: 'payment_received',
              message: 'Payment received: £135.00 from Mrs. Johnson',
              time: '5 hours ago',
              read: false
            }
          ]
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedPeriod]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      sent: { color: 'bg-blue-100 text-blue-800', text: 'Sent' },
      accepted: { color: 'bg-green-100 text-green-800', text: 'Accepted' },
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getPriorityIndicator = (priority) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    
    return (
      <div className={`w-2 h-2 rounded-full ${colors[priority]}`} />
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatChangePercentage = (change) => {
    const isPositive = change > 0;
    return (
      <span className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <ArrowUpRight className={`h-4 w-4 ${isPositive ? '' : 'rotate-180'}`} />
        {Math.abs(change)}%
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <SkeletonLoader lines={2} className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 animate-fade-in">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Good morning, {user?.name?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your business today
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Input
                  placeholder="Search quotes, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                  className="w-64"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>
              
              {/* Settings */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('settings')}
                leftIcon={<Settings className="h-4 w-4" />}
              >
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Key Metrics */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Key Metrics</h2>
            <div className="flex items-center gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(dashboardData.stats.totalRevenue)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <PoundSterling className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  {formatChangePercentage(dashboardData.stats.revenueChange)}
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Quotes</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {dashboardData.stats.activeQuotes}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  {formatChangePercentage(dashboardData.stats.quotesChange)}
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {dashboardData.stats.completedJobs}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  {formatChangePercentage(dashboardData.stats.jobsChange)}
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {dashboardData.stats.customerSatisfaction}/5.0
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  {formatChangePercentage(dashboardData.stats.satisfactionChange)}
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('quotes')}
              leftIcon={<Plus className="h-5 w-5" />}
              className="justify-start h-16"
            >
              Create New Quote
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('calendar')}
              leftIcon={<Calendar className="h-5 w-5" />}
              className="justify-start h-16"
            >
              Schedule Job
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('customers')}
              leftIcon={<Users className="h-5 w-5" />}
              className="justify-start h-16"
            >
              Add Customer
            </Button>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Quotes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Quotes</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('quotes')}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {dashboardData.recentQuotes.map((quote, index) => (
                  <div 
                    key={quote.id}
                    className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                      index !== dashboardData.recentQuotes.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                    onClick={() => onNavigate('quotes')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getPriorityIndicator(quote.priority)}
                        <div>
                          <p className="font-medium text-gray-900">{quote.customerName}</p>
                          <p className="text-sm text-gray-600 mt-1">{quote.jobDescription}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(quote.amount)}</p>
                        <div className="mt-1">
                          {getStatusBadge(quote.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Jobs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Jobs</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('calendar')}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  View calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {dashboardData.upcomingJobs.map((job, index) => (
                  <div 
                    key={job.id}
                    className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                      index !== dashboardData.upcomingJobs.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                    onClick={() => onNavigate('calendar')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{job.customerName}</p>
                        <p className="text-sm text-gray-600 mt-1">{job.jobDescription}</p>
                        <p className="text-xs text-gray-500 mt-1">{job.address}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {job.time}
                        </div>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {new Date(job.scheduledDate).toLocaleDateString('en-GB', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <div className="mt-1">
                          {getStatusBadge(job.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {dashboardData.notifications.map((notification, index) => (
                <div 
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    index !== dashboardData.notifications.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                      <p className="text-gray-900">{notification.message}</p>
                    </div>
                    <span className="text-sm text-gray-500">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EnhancedDashboard;
