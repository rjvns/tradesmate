import React, { useState, useEffect } from 'react';
import { Mic, Calendar, FileText, Home, User, Phone, MapPin, Clock, Pound } from 'lucide-react';

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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };
      
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsProcessing(true);
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };
    }
  };

  const processAudio = async (audioBlob) => {
    try {
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
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Error processing audio. Please try again.');
    } finally {
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
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
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
            <Pound className="h-4 w-4 mr-2" />
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

  useEffect(() => {
    fetchDashboardData();
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

  const handleSendQuote = () => {
    alert('Quote sent successfully! (Demo - email/SMS integration coming soon)');
    setCurrentView('home');
    setGeneratedQuote(null);
    fetchDashboardData(); // Refresh dashboard
  };

  const renderNavigation = () => (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TM</span>
          </div>
          <span className="font-bold text-xl text-gray-900">TradesMate</span>
        </div>
        
        <div className="flex space-x-1">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'quotes', icon: FileText, label: 'Quotes' },
            { id: 'schedule', icon: Calendar, label: 'Schedule' },
            { id: 'invoices', icon: Pound, label: 'Invoices' },
          ].map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant={currentView === id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView(id)}
              className="flex flex-col items-center p-2 h-auto"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs mt-1">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );

  const renderHomeView = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow tradesmate-primary text-white"
          onClick={() => setCurrentView('voice-quote')}
        >
          <CardContent className="p-6 text-center">
            <Mic className="h-12 w-12 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">New Quote</h3>
            <p className="text-sm opacity-90">Tap to record job description</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-600" />
            <h3 className="font-semibold text-lg mb-2">My Schedule</h3>
            <p className="text-sm text-muted-foreground">View upcoming appointments</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow tradesmate-secondary text-white">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Invoices</h3>
            <p className="text-sm opacity-90">Manage payments and billing</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quotes */}
      {dashboardData?.recent_quotes && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recent_quotes.map((quote) => (
                <div key={quote.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{quote.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{quote.job_description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">£{quote.total_amount}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Jobs */}
      {dashboardData?.upcoming_jobs && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.upcoming_jobs.map((job) => (
                <div key={job.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{job.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{job.job_description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(job.scheduled_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(job.scheduled_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      
      <main className="container mx-auto px-4 py-6">
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
          <Card>
            <CardHeader>
              <CardTitle>All Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Quote management coming soon...</p>
            </CardContent>
          </Card>
        )}
        {currentView === 'schedule' && (
          <Card>
            <CardHeader>
              <CardTitle>Schedule Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Calendar integration coming soon...</p>
            </CardContent>
          </Card>
        )}
        {currentView === 'invoices' && (
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Invoice system coming soon...</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default App;

