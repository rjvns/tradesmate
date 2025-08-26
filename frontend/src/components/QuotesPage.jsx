import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Send, 
  Calendar, 
  PoundSterling, 
  User, 
  Phone, 
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Download,
  MoreVertical
} from 'lucide-react';
import QuoteForm from './QuoteForm';

const QuotesPage = ({ onCreateQuote }) => {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);

  // Mock quotes data - in real app this would come from API
  const mockQuotes = [
    {
      id: 1,
      customer_name: 'John Smith',
      customer_email: 'john@example.com',
      customer_phone: '07700 900123',
      job_description: 'Kitchen rewiring and new consumer unit installation',
      address: '123 High Street, London SW1A 1AA',
      total_amount: 1250.00,
      status: 'sent',
      created_date: '2024-08-20',
      valid_until: '2024-09-20',
      items: [
        { description: 'Consumer unit replacement', quantity: 1, rate: 450, amount: 450 },
        { description: 'Kitchen socket installation', quantity: 8, rate: 35, amount: 280 },
        { description: 'LED downlight installation', quantity: 10, rate: 25, amount: 250 },
        { description: 'Labour and materials', quantity: 1, rate: 270, amount: 270 }
      ]
    },
    {
      id: 2,
      customer_name: 'Sarah Johnson',
      customer_email: 'sarah.j@email.com',
      customer_phone: '07777 123456',
      job_description: 'Bathroom extractor fan and shower installation',
      address: '45 Oak Avenue, Manchester M1 2AB',
      total_amount: 680.00,
      status: 'accepted',
      created_date: '2024-08-18',
      valid_until: '2024-09-18',
      items: [
        { description: 'Extractor fan supply and install', quantity: 1, rate: 180, amount: 180 },
        { description: 'Shower circuit installation', quantity: 1, rate: 320, amount: 320 },
        { description: 'Materials and testing', quantity: 1, rate: 180, amount: 180 }
      ]
    },
    {
      id: 3,
      customer_name: 'Mike Wilson',
      customer_email: 'mike.wilson@company.com',
      customer_phone: '07888 999000',
      job_description: 'Office lighting upgrade to LED',
      address: '78 Business Park, Birmingham B2 4QG',
      total_amount: 2150.00,
      status: 'draft',
      created_date: '2024-08-22',
      valid_until: '2024-09-22',
      items: [
        { description: 'LED panel lights', quantity: 20, rate: 45, amount: 900 },
        { description: 'Installation labour', quantity: 16, rate: 55, amount: 880 },
        { description: 'Emergency lighting upgrade', quantity: 1, rate: 370, amount: 370 }
      ]
    },
    {
      id: 4,
      customer_name: 'Emma Davis',
      customer_email: 'emma@homeowner.co.uk',
      customer_phone: '07555 444333',
      job_description: 'Electric vehicle charging point installation',
      address: '12 Garden Close, Bristol BS1 6TH',
      total_amount: 895.00,
      status: 'sent',
      created_date: '2024-08-19',
      valid_until: '2024-09-19',
      items: [
        { description: 'EV charging unit', quantity: 1, rate: 550, amount: 550 },
        { description: 'Installation and setup', quantity: 1, rate: 345, amount: 345 }
      ]
    },
    {
      id: 5,
      customer_name: 'David Brown',
      customer_email: 'david.brown@email.com',
      customer_phone: '07333 222111',
      job_description: 'Complete house rewire',
      address: '67 Victoria Road, Leeds LS1 3QR',
      total_amount: 4500.00,
      status: 'expired',
      created_date: '2024-07-15',
      valid_until: '2024-08-15',
      items: [
        { description: 'Complete rewire materials', quantity: 1, rate: 1800, amount: 1800 },
        { description: 'Labour (5 days)', quantity: 5, rate: 400, amount: 2000 },
        { description: 'Testing and certification', quantity: 1, rate: 350, amount: 350 },
        { description: 'Consumer unit upgrade', quantity: 1, rate: 350, amount: 350 }
      ]
    }
  ];

  useEffect(() => {
    fetchQuotes();
    fetchStats();
  }, []);

  const fetchQuotes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/quotes/');
      const data = await response.json();
      
      if (data.quotes) {
        // Transform backend data to frontend format
        const transformedQuotes = data.quotes.map(quote => ({
          ...quote,
          customer_name: quote.customer_name,
          customer_email: quote.customer_email || '',
          customer_phone: quote.customer_phone || '',
          job_description: quote.job_description,
          address: quote.customer_address || '',
          total_amount: quote.total_amount,
          status: quote.status,
          created_date: quote.created_at ? quote.created_at.split('T')[0] : '',
          valid_until: quote.valid_until ? quote.valid_until.split('T')[0] : '',
          items: [
            { description: 'Labour', quantity: quote.labour_hours || 0, rate: quote.labour_rate || 0, amount: (quote.labour_hours || 0) * (quote.labour_rate || 0) },
            { description: 'Materials', quantity: 1, rate: quote.materials_cost || 0, amount: quote.materials_cost || 0 }
          ].filter(item => item.amount > 0)
        }));
        setQuotes(transformedQuotes);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      // Fallback to mock data if API fails
      setQuotes(mockQuotes);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/quotes/stats');
      if (response.ok) {
        const statsData = await response.json();
        // Stats will be used in the component
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    filterAndSortQuotes();
  }, [quotes, searchTerm, statusFilter, sortBy]);

  const filterAndSortQuotes = () => {
    let filtered = [...quotes];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.job_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.created_date) - new Date(a.created_date);
        case 'date_asc':
          return new Date(a.created_date) - new Date(b.created_date);
        case 'amount_desc':
          return b.total_amount - a.total_amount;
        case 'amount_asc':
          return a.total_amount - b.total_amount;
        case 'customer_asc':
          return a.customer_name.localeCompare(b.customer_name);
        case 'customer_desc':
          return b.customer_name.localeCompare(a.customer_name);
        default:
          return 0;
      }
    });

    setFilteredQuotes(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4 text-gray-400" />;
      case 'sent': return <AlertCircle className="h-4 w-4 text-blue-400" />;
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'expired': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-600/20 text-gray-200 border-gray-600/30';
      case 'sent': return 'bg-blue-600/20 text-blue-200 border-blue-600/30';
      case 'accepted': return 'bg-green-600/20 text-green-200 border-green-600/30';
      case 'expired': return 'bg-red-600/20 text-red-200 border-red-600/30';
      default: return 'bg-gray-600/20 text-gray-200 border-gray-600/30';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const handleQuoteAction = async (action, quote) => {
    console.log(`${action} quote:`, quote);
    
    try {
      switch (action) {
        case 'view':
          setSelectedQuote(quote);
          setShowQuoteModal(true);
          break;
          
        case 'edit':
          console.log('QuotesPage: Editing quote:', quote);
          setEditingQuote(quote);
          setShowQuoteForm(true);
          break;
          
        case 'duplicate':
          const duplicateResponse = await fetch(`/api/quotes/${quote.id}/duplicate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (duplicateResponse.ok) {
            const result = await duplicateResponse.json();
            alert('Quote duplicated successfully!');
            fetchQuotes(); // Refresh the list
          } else {
            alert('Failed to duplicate quote');
          }
          break;
          
        case 'send':
          const sendResponse = await fetch(`/api/quotes/${quote.id}/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (sendResponse.ok) {
            alert(`Quote sent to ${quote.customer_name}!`);
            // Update local state
            setQuotes(quotes.map(q => 
              q.id === quote.id ? {...q, status: 'sent'} : q
            ));
          } else {
            alert('Failed to send quote');
          }
          break;
          
        case 'delete':
          if (confirm(`Are you sure you want to delete the quote for ${quote.customer_name}?`)) {
            const deleteResponse = await fetch(`/api/quotes/${quote.id}`, {
              method: 'DELETE'
            });
            
            if (deleteResponse.ok) {
              setQuotes(quotes.filter(q => q.id !== quote.id));
              alert('Quote deleted successfully');
            } else {
              alert('Failed to delete quote');
            }
          }
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error(`Error ${action}ing quote:`, error);
      alert(`Failed to ${action} quote. Please try again.`);
    }
  };

  const stats = {
    total: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    totalValue: quotes.reduce((sum, q) => sum + q.total_amount, 0)
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">All Quotes</h1>
            <p className="text-white/70">Manage and track all your customer quotes</p>
          </div>
          <button
            onClick={() => {
              setEditingQuote(null);
              setShowQuoteForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl transition-all flex items-center space-x-2 hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>New Quote</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
            <p className="text-white text-2xl font-bold">{stats.total}</p>
            <p className="text-white/60 text-sm font-medium">Total Quotes</p>
          </div>
          <div className="bg-gray-600/20 rounded-2xl p-4 text-center border border-gray-600/30">
            <p className="text-white text-2xl font-bold">{stats.draft}</p>
            <p className="text-gray-200 text-sm font-medium">Draft</p>
          </div>
          <div className="bg-blue-600/20 rounded-2xl p-4 text-center border border-blue-600/30">
            <p className="text-white text-2xl font-bold">{stats.sent}</p>
            <p className="text-blue-200 text-sm font-medium">Sent</p>
          </div>
          <div className="bg-green-600/20 rounded-2xl p-4 text-center border border-green-600/30">
            <p className="text-white text-2xl font-bold">{stats.accepted}</p>
            <p className="text-green-200 text-sm font-medium">Accepted</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
            <p className="text-white text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
            <p className="text-white/60 text-sm font-medium">Total Value</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
            <input
              type="text"
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:bg-white/15 focus:border-white/40 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:bg-white/15 focus:border-white/40 focus:outline-none"
          >
            <option value="all" className="bg-gray-800">All Status</option>
            <option value="draft" className="bg-gray-800">Draft</option>
            <option value="sent" className="bg-gray-800">Sent</option>
            <option value="accepted" className="bg-gray-800">Accepted</option>
            <option value="expired" className="bg-gray-800">Expired</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:bg-white/15 focus:border-white/40 focus:outline-none"
          >
            <option value="date_desc" className="bg-gray-800">Newest First</option>
            <option value="date_asc" className="bg-gray-800">Oldest First</option>
            <option value="amount_desc" className="bg-gray-800">Highest Amount</option>
            <option value="amount_asc" className="bg-gray-800">Lowest Amount</option>
            <option value="customer_asc" className="bg-gray-800">Customer A-Z</option>
            <option value="customer_desc" className="bg-gray-800">Customer Z-A</option>
          </select>

          {/* Export */}
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white transition-all">
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Quotes List */}
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-white font-semibold">Customer</th>
                <th className="text-left p-4 text-white font-semibold">Job Description</th>
                <th className="text-left p-4 text-white font-semibold">Amount</th>
                <th className="text-left p-4 text-white font-semibold">Status</th>
                <th className="text-left p-4 text-white font-semibold">Date</th>
                <th className="text-center p-4 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-white">{quote.customer_name}</p>
                      <p className="text-sm text-white/60">{quote.customer_email}</p>
                      <p className="text-sm text-white/60">{quote.customer_phone}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-medium">{quote.job_description}</p>
                    <p className="text-sm text-white/60 mt-1">{quote.address}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-bold text-lg">{formatCurrency(quote.total_amount)}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(quote.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(quote.status)}`}>
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-white">{formatDate(quote.created_date)}</p>
                    <p className="text-sm text-white/60">Valid until {formatDate(quote.valid_until)}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleQuoteAction('view', quote)}
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-xl transition-colors border border-blue-600/30"
                        title="View Quote"
                      >
                        <Eye className="h-4 w-4 text-blue-200" />
                      </button>
                      <button
                        onClick={() => handleQuoteAction('edit', quote)}
                        className="p-2 bg-gray-600/20 hover:bg-gray-600/40 rounded-xl transition-colors border border-gray-600/30"
                        title="Edit Quote"
                      >
                        <Edit className="h-4 w-4 text-gray-200" />
                      </button>
                      {quote.status === 'draft' && (
                        <button
                          onClick={() => handleQuoteAction('send', quote)}
                          className="p-2 bg-green-600/20 hover:bg-green-600/40 rounded-xl transition-colors border border-green-600/30"
                          title="Send Quote"
                        >
                          <Send className="h-4 w-4 text-green-200" />
                        </button>
                      )}
                      <button
                        onClick={() => handleQuoteAction('duplicate', quote)}
                        className="p-2 bg-slate-600/20 hover:bg-slate-600/40 rounded-xl transition-colors border border-slate-600/30"
                        title="Duplicate Quote"
                      >
                        <Copy className="h-4 w-4 text-slate-200" />
                      </button>
                      <button
                        onClick={() => handleQuoteAction('delete', quote)}
                        className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-xl transition-colors border border-red-600/30"
                        title="Delete Quote"
                      >
                        <Trash2 className="h-4 w-4 text-red-200" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No quotes found matching your criteria</p>
            <p className="text-white/40 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Quote Detail Modal */}
      {showQuoteModal && selectedQuote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900 rounded-3xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Quote Details</h2>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <XCircle className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Customer Information</h3>
                  <div className="space-y-2">
                    <p className="text-white"><strong>Name:</strong> {selectedQuote.customer_name}</p>
                    <p className="text-white"><strong>Email:</strong> {selectedQuote.customer_email}</p>
                    <p className="text-white"><strong>Phone:</strong> {selectedQuote.customer_phone}</p>
                    <p className="text-white"><strong>Address:</strong> {selectedQuote.address}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Quote Information</h3>
                  <div className="space-y-2">
                    <p className="text-white"><strong>Created:</strong> {formatDate(selectedQuote.created_date)}</p>
                    <p className="text-white"><strong>Valid Until:</strong> {formatDate(selectedQuote.valid_until)}</p>
                    <p className="text-white"><strong>Status:</strong> 
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedQuote.status)}`}>
                        {selectedQuote.status.charAt(0).toUpperCase() + selectedQuote.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Job Description</h3>
                <p className="text-white/80 bg-white/5 p-4 rounded-2xl">{selectedQuote.job_description}</p>
              </div>

              {/* Quote Items */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Quote Items</h3>
                <div className="bg-white/5 rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="text-left p-4 text-white font-semibold">Description</th>
                        <th className="text-center p-4 text-white font-semibold">Qty</th>
                        <th className="text-right p-4 text-white font-semibold">Rate</th>
                        <th className="text-right p-4 text-white font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuote.items.map((item, index) => (
                        <tr key={index} className="border-b border-white/10">
                          <td className="p-4 text-white">{item.description}</td>
                          <td className="p-4 text-center text-white">{item.quantity}</td>
                          <td className="p-4 text-right text-white">{formatCurrency(item.rate)}</td>
                          <td className="p-4 text-right text-white font-semibold">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                      <tr className="bg-white/5">
                        <td colSpan="3" className="p-4 text-right text-white font-bold">Total:</td>
                        <td className="p-4 text-right text-white font-bold text-xl">{formatCurrency(selectedQuote.total_amount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleQuoteAction('edit', selectedQuote)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-xl transition-all flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleQuoteAction('duplicate', selectedQuote)}
                  className="bg-slate-600 hover:bg-slate-700 text-white font-semibold px-6 py-2 rounded-xl transition-all flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Duplicate</span>
                </button>
                {selectedQuote.status === 'draft' && (
                  <button
                    onClick={() => {
                      handleQuoteAction('send', selectedQuote);
                      setShowQuoteModal(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl transition-all flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Quote</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <QuoteForm
          quote={editingQuote}
          onSave={(savedQuote) => {
            // Refresh quotes list
            fetchQuotes();
            setShowQuoteForm(false);
            setEditingQuote(null);
          }}
          onClose={() => {
            setShowQuoteForm(false);
            setEditingQuote(null);
          }}
        />
      )}
    </div>
  );
};

export default QuotesPage;
