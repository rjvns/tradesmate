import React, { useState, useEffect } from 'react';
import { Mic, Calendar, FileText, Home, User, Phone, MapPin, Clock, PoundSterling, LogOut, Settings } from 'lucide-react';
import AuthScreen from './components/AuthScreen';
import SettingsScreen from './components/SettingsScreen';
import QuotesPage from './components/QuotesPage';


// Simple Button component
const Button = ({ children, onClick, className = '', variant = 'default', size = 'default', disabled = false }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Simple Card components
const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Voice Recorder Component
const VoiceRecorder = ({ onQuoteGenerated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted, starting recording...');
      
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        console.log('Audio data available:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };
      
      recorder.onstop = () => {
        console.log('Recording stopped, cleaning up...');
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.start();
      setIsRecording(true);
      console.log('Recording started successfully');
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      console.log('Stopping recording...');
      mediaRecorder.stop();
      setIsRecording(false);
      setIsProcessing(true);
      
      mediaRecorder.onstop = async () => {
        console.log('Creating audio blob from chunks:', audioChunks.length, 'chunks');
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        console.log('Audio blob created, size:', audioBlob.size, 'bytes');
        await processAudio(audioBlob);
      };
    }
  };

  const processAudio = async (audioBlob) => {
    try {
      console.log('Processing audio blob:', audioBlob);
      
      // For demo purposes, simulate the API call with mock data
      setTimeout(() => {
        const mockQuoteData = {
          success: true,
          quote_data: {
            customer_name: "Mrs. Johnson",
            customer_phone: "07700 900123",
            customer_address: "123 Main Street, London",
            job_description: "Kitchen tap replacement - customer mentioned old tap is leaking and needs urgent replacement",
            job_type: "Kitchen",
            urgency: "urgent",
            labour_hours: 2,
            labour_rate: 45,
            materials_cost: 35,
            materials: [
              { item: "Kitchen tap", quantity: 1, unit_price: 25, total: 25 },
              { item: "Washers & seals", quantity: 1, unit_price: 10, total: 10 }
            ],
            subtotal: 125,
            vat_amount: 25,
            total_amount: 150,
            confidence: 0.9
          }
        };
        
        console.log('Mock quote generated:', mockQuoteData);
        onQuoteGenerated(mockQuoteData);
        setIsProcessing(false);
      }, 2000);
      
      // Real implementation would be:
      /*
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      const response = await fetch('/api/voice/voice-to-quote', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        onQuoteGenerated(result);
      } else {
        alert(`Error: ${result.error}`);
      }
      */
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Error processing audio. Please try again.');
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isProcessing) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Your Recording</h3>
            <p className="text-muted-foreground">AI is analyzing your job description and creating a professional quote...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {isRecording ? 'Recording Job Description' : 'Voice to Quote'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          {isRecording && (
            <div className="mb-4">
              <div className="text-2xl font-mono text-primary">
                {formatTime(recordingTime)}
              </div>
              <div className="flex justify-center space-x-1 mt-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={`waveform-${i}`}
                    className="w-1 bg-primary waveform-bar"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            size="lg"
            className={`w-24 h-24 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600 recording-pulse' : 'tradesmate-primary'}`}
          >
            <Mic className="h-8 w-8" />
          </Button>
          
          <p className="text-sm text-muted-foreground">
            {isRecording 
              ? 'Tap to stop recording' 
              : 'Tap to start recording your job description'
            }
          </p>
          
          {!isRecording && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>💡 Speak clearly and include:</p>
              <p>• Customer name and contact</p>
              <p>• Job type and description</p>
              <p>• Materials needed</p>
              <p>• Any urgency or special requirements</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Quote Display Component
const QuoteDisplay = ({ quoteData, onBack, onSend }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Professional Quote Generated</span>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Customer Details
            </h4>
            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {quoteData.customer_name}</p>
              {quoteData.customer_phone && (
                <p className="flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  {quoteData.customer_phone}
                </p>
              )}
              {quoteData.customer_address && (
                <p className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {quoteData.customer_address}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Job Information
            </h4>
            <div className="space-y-1 text-sm">
              <p><strong>Type:</strong> {quoteData.job_type}</p>
              <p><strong>Urgency:</strong> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  quoteData.urgency === 'emergency' ? 'bg-red-100 text-red-800' :
                  quoteData.urgency === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {quoteData.urgency}
                </span>
              </p>
              <p className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {quoteData.labour_hours} hours estimated
              </p>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <h4 className="font-semibold mb-2">Job Description</h4>
          <p className="text-sm bg-gray-50 p-3 rounded">{quoteData.job_description}</p>
        </div>

        {/* Materials */}
        {quoteData.materials && quoteData.materials.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Materials Required</h4>
            <div className="space-y-2">
              {quoteData.materials.map((material, index) => (
                <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                  <span>{material.item} (x{material.quantity})</span>
                  <span>{formatCurrency(material.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <PoundSterling className="h-4 w-4 mr-2" />
            Quote Breakdown
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Labour ({quoteData.labour_hours} hours @ {formatCurrency(quoteData.labour_rate)}/hour)</span>
              <span>{formatCurrency(quoteData.labour_hours * quoteData.labour_rate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Materials</span>
              <span>{formatCurrency(quoteData.materials_cost)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Subtotal</span>
              <span>{formatCurrency(quoteData.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (20%)</span>
              <span>{formatCurrency(quoteData.vat_amount)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(quoteData.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Button onClick={onSend} className="flex-1 tradesmate-primary">
            Send Quote to Customer
          </Button>
          <Button variant="outline" className="flex-1">
            Save as Draft
          </Button>
        </div>

        {/* AI Confidence */}
        <div className="text-xs text-muted-foreground text-center">
          AI Confidence: {Math.round((quoteData.confidence || 0.8) * 100)}%
        </div>
      </CardContent>
    </Card>
  );
};

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('home');
  const [dashboardData, setDashboardData] = useState(null);
  const [generatedQuote, setGeneratedQuote] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('tradesmate_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
    fetchDashboardData();
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('tradesmate_user');
      }
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleQuoteGenerated = (result) => {
    setGeneratedQuote(result.quote_data);
    setCurrentView('quote');
  };

  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('tradesmate_user', JSON.stringify(userData));
    fetchDashboardData();
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('home');
    setGeneratedQuote(null);
    setDashboardData(null);
    setShowSettings(false);
    localStorage.removeItem('tradesmate_user');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('tradesmate_user', JSON.stringify(updatedUser));
  };

  const handleSendQuote = () => {
    alert('Quote sent successfully! (Demo - email/SMS integration coming soon)');
    setCurrentView('home');
    setGeneratedQuote(null);
    fetchDashboardData(); // Refresh dashboard
  };

  const renderNavigation = () => (
    <nav className="relative z-20 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl">
      <div className="px-6 py-4">
        {/* Header with logo and user info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-black text-xl">TM</span>
            </div>
            <div>
              <h1 className="text-white font-black text-2xl tracking-tight">TradesMate</h1>
              <p className="text-white/60 text-sm font-medium">
                Welcome back, {user?.firstName || 'User'} ✨
              </p>
            </div>
          </div>
          
        <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95"
            >
              <Settings className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={handleLogout}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95"
            >
              <LogOut className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
        
        {/* Navigation tabs */}
        <div className="flex space-x-2 bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10">
          {[
            { id: 'home', icon: Home, label: 'Dashboard' },
            { id: 'quotes', icon: FileText, label: 'Quotes' },
            { id: 'schedule', icon: Calendar, label: 'Schedule' },
            { id: 'invoices', icon: PoundSterling, label: 'Invoices' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentView(id)}
              className={`
                flex-1 flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-300 font-medium
                ${currentView === id 
                  ? 'bg-white text-slate-800 shadow-xl transform scale-105' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <Icon className="h-5 w-5 mb-2" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );

  const renderHomeView = () => (
    <div className="space-y-8">
      {/* Welcome Section - Industrial Style */}
      <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-600/20 to-gray-700/20 rounded-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.firstName}! 🔧
              </h2>
              <p className="text-white/70 text-lg font-medium">
                {user?.companyName}
              </p>
              <p className="text-white/50 text-sm font-medium">
                {user?.tradeType?.charAt(0).toUpperCase() + user?.tradeType?.slice(1).replace('_', ' ')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-sm font-medium">Today</p>
              <p className="text-2xl font-bold text-white">{new Date().toLocaleDateString('en-GB', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}</p>
              <p className="text-white/70 text-sm">London, 16°C ⛅</p>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Today</p>
              <p className="text-white text-2xl font-bold">3</p>
              <p className="text-white/70 text-sm">Quotes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide">This Week</p>
              <p className="text-white text-2xl font-bold">£2,450</p>
              <p className="text-white/70 text-sm">Revenue</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Rating</p>
              <p className="text-white text-2xl font-bold">4.9⭐</p>
              <p className="text-white/70 text-sm">Customer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Industrial Style Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="group cursor-pointer relative backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:scale-105 transition-all duration-500"
          onClick={() => {
            console.log('New Quote clicked, switching to voice-quote view');
            setCurrentView('voice-quote');
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-600/30 to-blue-800/30"></div>
          
          <div className="relative z-10 p-8 text-center">
            <div className="bg-white/20 backdrop-blur-md rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/30">
              <Mic className="h-10 w-10 text-white" />
            </div>
            <h3 className="font-black text-2xl mb-3 text-white">New Quote</h3>
            <p className="text-white/70 text-sm font-medium">Record job description with AI ⚡</p>
          </div>
        </div>

        <div
          className="group cursor-pointer relative backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:scale-105 transition-all duration-500"
          onClick={() => setCurrentView('schedule')}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-600/30 via-gray-600/30 to-slate-700/30"></div>
          
          <div className="relative z-10 p-8 text-center">
            <div className="bg-white/20 backdrop-blur-md rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/30">
              <Calendar className="h-10 w-10 text-white" />
            </div>
            <h3 className="font-black text-2xl mb-3 text-white">My Schedule</h3>
            <p className="text-white/70 text-sm font-medium">View upcoming jobs 🔧</p>
          </div>
        </div>

        <div
          className="group cursor-pointer relative backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:scale-105 transition-all duration-500"
          onClick={() => setCurrentView('invoices')}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/30 via-gray-700/30 to-slate-800/30"></div>
          
          <div className="relative z-10 p-8 text-center">
            <div className="bg-white/20 backdrop-blur-md rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/30">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h3 className="font-black text-2xl mb-3 text-white">Invoices</h3>
            <p className="text-white/70 text-sm font-medium">Manage payments & billing 💼</p>
          </div>
        </div>
      </div>

      {/* Recent Activity - Slack Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Quotes */}
      {dashboardData?.recent_quotes && (
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-2xl font-black text-white mb-2">Recent Quotes 📊</h3>
              <p className="text-white/60 text-sm font-medium">Your latest customer quotes</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.recent_quotes.map((quote, index) => (
                  <div key={quote.id || index} className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-md rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/10">
                    <div className="flex-1">
                      <p className="font-bold text-white">{quote.customer_name || quote.customer}</p>
                      <p className="text-sm text-white/70 mt-1 font-medium">{quote.job_description || quote.job}</p>
                  </div>
                    <div className="text-right ml-4">
                      <p className="font-black text-xl text-white">£{quote.total_amount || quote.amount}</p>
                      <span className={`inline-block text-xs px-3 py-1 rounded-full font-bold border ${
                        quote.status === 'sent' ? 'bg-blue-600/20 text-blue-200 border-blue-600/30' :
                        quote.status === 'accepted' ? 'bg-slate-600/20 text-slate-200 border-slate-600/30' :
                        'bg-gray-600/20 text-gray-200 border-gray-600/30'
                      }`}>
                        {quote.status || 'draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
              <button 
                onClick={() => setCurrentView('quotes')}
                className="w-full mt-6 py-3 text-center text-white font-bold bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 backdrop-blur-md border border-white/20"
              >
                View all quotes →
              </button>
            </div>
          </div>
        )}

        {/* Performance Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-2xl font-black text-white mb-2">Performance ⚡</h3>
            <p className="text-white/60 text-sm font-medium">Your business metrics</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-600/20 backdrop-blur-md rounded-2xl border border-blue-600/30">
                <p className="text-3xl font-black text-white">{dashboardData?.stats?.quotes || 5}</p>
                <p className="text-sm text-blue-200 font-bold">Quotes Created</p>
              </div>
              <div className="text-center p-4 bg-slate-600/20 backdrop-blur-md rounded-2xl border border-slate-600/30">
                <p className="text-3xl font-black text-white">{dashboardData?.stats?.jobs || 3}</p>
                <p className="text-sm text-slate-200 font-bold">Jobs Completed</p>
              </div>
              <div className="text-center p-4 bg-gray-600/20 backdrop-blur-md rounded-2xl border border-gray-600/30">
                <p className="text-3xl font-black text-white">£2,450</p>
                <p className="text-sm text-gray-200 font-bold">Revenue</p>
              </div>
              <div className="text-center p-4 bg-blue-700/20 backdrop-blur-md rounded-2xl border border-blue-700/30">
                <p className="text-3xl font-black text-white">4.9⭐</p>
                <p className="text-sm text-blue-200 font-bold">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Jobs */}
      {dashboardData?.upcoming_jobs && dashboardData.upcoming_jobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.upcoming_jobs.map((job, index) => (
                <div key={job.id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{job.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{job.job_description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : 'TBD'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {job.scheduled_date ? new Date(job.scheduled_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  console.log('App rendering with currentView:', currentView, 'generatedQuote:', !!generatedQuote, 'isAuthenticated:', isAuthenticated);

  // Show authentication screen if not logged in
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/8 via-slate-600/8 to-gray-600/8"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      {renderNavigation()}
      
      <main className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto">
        {currentView === 'home' && renderHomeView()}
        {currentView === 'voice-quote' && (
          <VoiceRecorder onQuoteGenerated={handleQuoteGenerated} />
        )}
        {currentView === 'quote' && generatedQuote && (
          <QuoteDisplay 
            quoteData={generatedQuote}
            onBack={() => setCurrentView('home')}
            onSend={handleSendQuote}
          />
        )}
        {currentView === 'quotes' && (
            <QuotesPage onCreateQuote={() => setCurrentView('voice-quote')} />
        )}
        {currentView === 'schedule' && (
            <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Schedule Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Calendar integration coming soon...</p>
            </CardContent>
          </Card>
        )}
        {currentView === 'invoices' && (
            <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Invoice system coming soon...</p>
            </CardContent>
          </Card>
        )}
        </div>
      </main>
      
      {/* Settings Modal */}
      {showSettings && (
        <SettingsScreen 
          user={user}
          onUpdateUser={handleUpdateUser}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;

