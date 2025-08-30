import React, { useState, useRef, useCallback, useMemo } from 'react';
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  Lock, 
  Bell, 
  CreditCard, 
  Calendar, 
  Settings, 
  Camera, 
  Save, 
  X, 
  Check,
  AlertTriangle,
  Shield,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Link,
  DollarSign,
  Clock,
  Globe,
  Smartphone
} from 'lucide-react';

// Define form components at TOP LEVEL to prevent re-creation on every render
const FormInput = ({ label, type = 'text', value, onChange, error, placeholder, icon: Icon, ...props }) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className={`
            block w-full rounded-lg transition-all duration-300
            ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3
            text-gray-900 placeholder-gray-400 font-medium
            bg-white border border-gray-300
            focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
            ${error ? 'border-red-400' : ''}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};

const FormSelect = ({ label, value, onChange, options, error }) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <select
        value={value}
        onChange={handleChange}
        className={`
          block w-full rounded-lg px-4 py-3 text-gray-900 font-medium
          bg-white border border-gray-300
          focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
          ${error ? 'border-red-400' : ''}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-white text-gray-900">
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};

const FormTextArea = ({ label, value, onChange, error, placeholder, rows = 4 }) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className={`
          block w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 font-medium
          bg-white border border-gray-300
          focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
          resize-none
          ${error ? 'border-red-400' : ''}
        `}
      />
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};

const SettingsScreen = ({ user, onUpdateUser, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const fileInputRef = useRef(null);

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',
    tradeType: user?.tradeType || 'electrician',
    bio: user?.bio || '',
    address: user?.address || '',
    postcode: user?.postcode || '',
    website: user?.website || ''
  });

  // Update functions to prevent re-renders (memoized)
  const updateProfileData = useCallback((field, value) => {
    console.log('Updating profile data:', field, value); // Debug log
    setProfileData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log('New profile data:', newData); // Debug log
      return newData;
    });
  }, []);

  const updateBusinessData = useCallback((field, value) => {
    setBusinessData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateSecurityData = useCallback((field, value) => {
    setSecurityData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateNotificationData = useCallback((field, value) => {
    setNotificationData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateWorkingHours = (day, field, value) => {
    setBusinessData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
  };

  const [businessData, setBusinessData] = useState({
    hourlyRate: user?.hourlyRate || '45',
    currency: user?.currency || 'GBP',
    vatNumber: user?.vatNumber || '',
    isVatRegistered: user?.isVatRegistered || false,
    servicesOffered: user?.servicesOffered || [],
    workingHours: user?.workingHours || {
      monday: { start: '08:00', end: '17:00', enabled: true },
      tuesday: { start: '08:00', end: '17:00', enabled: true },
      wednesday: { start: '08:00', end: '17:00', enabled: true },
      thursday: { start: '08:00', end: '17:00', enabled: true },
      friday: { start: '08:00', end: '17:00', enabled: true },
      saturday: { start: '09:00', end: '15:00', enabled: false },
      sunday: { start: '09:00', end: '15:00', enabled: false }
    }
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: user?.twoFactorEnabled || false
  });

  const [notificationData, setNotificationData] = useState({
    emailNotifications: user?.emailNotifications || true,
    smsNotifications: user?.smsNotifications || true,
    quoteReminders: user?.quoteReminders || true,
    marketingEmails: user?.marketingEmails || false,
    pushNotifications: user?.pushNotifications || true
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const tradeTypes = [
    { value: 'electrician', label: 'Electrician' },
    { value: 'plumber', label: 'Plumber' },
    { value: 'heating_engineer', label: 'Heating Engineer' },
    { value: 'general_builder', label: 'General Builder' },
    { value: 'carpenter', label: 'Carpenter' },
    { value: 'decorator', label: 'Painter & Decorator' },
    { value: 'roofer', label: 'Roofer' },
    { value: 'gas_engineer', label: 'Gas Safe Engineer' },
    { value: 'other', label: 'Other' }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'business', label: 'Business', icon: Building },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Link }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    
    if (!profileData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!profileData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!profileData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(profileData.email)) newErrors.email = 'Invalid email format';
    if (!profileData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!profileData.companyName.trim()) newErrors.companyName = 'Company name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSecurity = () => {
    const newErrors = {};
    
    if (securityData.newPassword) {
      if (!securityData.currentPassword) newErrors.currentPassword = 'Current password required';
      if (securityData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
      if (securityData.newPassword !== securityData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    let isValid = false;
    
    switch (activeTab) {
      case 'profile':
        isValid = validateProfile();
        break;
      case 'security':
        isValid = validateSecurity();
        break;
      default:
        isValid = true;
    }

    if (!isValid) return;

    setIsLoading(true);
    setSuccessMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        ...profileData,
        ...businessData,
        ...notificationData,
        profileImage,
        twoFactorEnabled: securityData.twoFactorEnabled
      };

      onUpdateUser(updatedUser);
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const Toggle = ({ label, checked, onChange, description }) => (
    <div className="flex items-start space-x-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
          ${checked ? 'bg-blue-600' : 'bg-white/20'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      <div className="flex-1">
        <label className="text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => onChange(!checked)}>
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Image */}
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-200">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition-colors border-2 border-white"
          >
            <Camera className="h-4 w-4 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="First Name"
          value={profileData.firstName}
          onChange={(value) => updateProfileData('firstName', value)}
          error={errors.firstName}
          icon={User}
        />
        <FormInput
          label="Last Name"
          value={profileData.lastName}
          onChange={(value) => updateProfileData('lastName', value)}
          error={errors.lastName}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Email Address"
          type="email"
          value={profileData.email}
          onChange={(value) => updateProfileData('email', value)}
          error={errors.email}
          icon={Mail}
        />
        <FormInput
          label="Phone Number"
          type="tel"
          value={profileData.phone}
          onChange={(value) => updateProfileData('phone', value)}
          error={errors.phone}
          icon={Phone}
        />
      </div>

      <FormInput
        label="Company Name"
        value={profileData.companyName}
        onChange={(value) => updateProfileData('companyName', value)}
        error={errors.companyName}
        icon={Building}
      />

      <FormSelect
        label="Trade Type"
        value={profileData.tradeType}
        onChange={(value) => updateProfileData('tradeType', value)}
        options={tradeTypes}
      />

      <FormTextArea
        label="Bio"
        value={profileData.bio}
        onChange={(value) => updateProfileData('bio', value)}
        placeholder="Tell customers about your experience and expertise..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Address"
          value={profileData.address}
          onChange={(value) => updateProfileData('address', value)}
        />
        <FormInput
          label="Postcode"
          value={profileData.postcode}
          onChange={(value) => updateProfileData('postcode', value)}
        />
      </div>

      <FormInput
        label="Website"
        value={profileData.website}
        onChange={(value) => updateProfileData('website', value)}
        placeholder="https://yourwebsite.com"
        icon={Globe}
      />
    </div>
  );

  const renderBusinessTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Hourly Rate (£)"
          type="number"
          value={businessData.hourlyRate}
          onChange={(value) => updateBusinessData('hourlyRate', value)}
          icon={DollarSign}
        />
        <FormInput
          label="VAT Number"
          value={businessData.vatNumber}
          onChange={(value) => updateBusinessData('vatNumber', value)}
          placeholder="GB123456789"
        />
      </div>

      <Toggle
        label="VAT Registered"
        checked={businessData.isVatRegistered}
        onChange={(checked) => updateBusinessData('isVatRegistered', checked)}
        description="Include VAT calculations in quotes"
      />

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Working Hours</h3>
        <div className="space-y-4">
          {Object.entries(businessData.workingHours).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-20">
                <Toggle
                  label={day.charAt(0).toUpperCase() + day.slice(1)}
                  checked={hours.enabled}
                  onChange={(checked) => updateWorkingHours(day, 'enabled', checked)}
                />
              </div>
              {hours.enabled && (
                <div className="flex items-center space-x-2 flex-1">
                  <input
                    type="time"
                    value={hours.start}
                    onChange={(e) => updateWorkingHours(day, 'start', e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  />
                  <span className="text-gray-600">to</span>
                  <input
                    type="time"
                    value={hours.end}
                    onChange={(e) => updateWorkingHours(day, 'end', e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <FormInput
            label="Current Password"
            type="password"
            value={securityData.currentPassword}
            onChange={(value) => updateSecurityData('currentPassword', value)}
            error={errors.currentPassword}
            icon={Lock}
          />
          <FormInput
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={securityData.newPassword}
            onChange={(value) => updateSecurityData('newPassword', value)}
            error={errors.newPassword}
            icon={Lock}
          />
          <FormInput
            label="Confirm New Password"
            type={showPassword ? 'text' : 'password'}
            value={securityData.confirmPassword}
            onChange={(value) => updateSecurityData('confirmPassword', value)}
            error={errors.confirmPassword}
            icon={Lock}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="text-sm">{showPassword ? 'Hide' : 'Show'} passwords</span>
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <Toggle
          label="Two-Factor Authentication"
          checked={securityData.twoFactorEnabled}
          onChange={(checked) => updateSecurityData('twoFactorEnabled', checked)}
          description="Add an extra layer of security to your account"
        />
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Toggle
        label="Email Notifications"
        checked={notificationData.emailNotifications}
        onChange={(checked) => updateNotificationData('emailNotifications', checked)}
        description="Receive notifications via email"
      />
      
      <Toggle
        label="SMS Notifications"
        checked={notificationData.smsNotifications}
        onChange={(checked) => updateNotificationData('smsNotifications', checked)}
        description="Receive notifications via text message"
      />
      
      <Toggle
        label="Quote Reminders"
        checked={notificationData.quoteReminders}
        onChange={(checked) => updateNotificationData('quoteReminders', checked)}
        description="Get reminders for pending quotes"
      />
      
      <Toggle
        label="Push Notifications"
        checked={notificationData.pushNotifications}
        onChange={(checked) => updateNotificationData('pushNotifications', checked)}
        description="Receive push notifications in your browser"
      />
      
      <Toggle
        label="Marketing Emails"
        checked={notificationData.marketingEmails}
        onChange={(checked) => updateNotificationData('marketingEmails', checked)}
        description="Receive updates about new features and tips"
      />
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Calendar */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-8 w-8 text-blue-400" />
            <div>
              <h3 className="font-bold text-gray-900">Google Calendar</h3>
              <p className="text-sm text-gray-600">Sync your appointments</p>
            </div>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
            Connect
          </button>
        </div>

        {/* QuickBooks */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="h-8 w-8 text-green-400" />
            <div>
              <h3 className="font-bold text-gray-900">QuickBooks</h3>
              <p className="text-sm text-gray-600">Accounting integration</p>
            </div>
          </div>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
            Connect
          </button>
        </div>

        {/* Stripe */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="h-8 w-8 text-purple-400" />
            <div>
              <h3 className="font-bold text-gray-900">Stripe</h3>
              <p className="text-sm text-gray-600">Payment processing</p>
            </div>
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
            Connect
          </button>
        </div>

        {/* WhatsApp */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Smartphone className="h-8 w-8 text-green-400" />
            <div>
              <h3 className="font-bold text-gray-900">WhatsApp Business</h3>
              <p className="text-sm text-gray-600">Customer messaging</p>
            </div>
          </div>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
            Connect
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-gray-700" />
            <h2 className="text-2xl font-black text-gray-900">Account & Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all
                    ${activeTab === id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'business' && renderBusinessTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'integrations' && renderIntegrationsTab()}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {successMessage && (
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold px-6 py-2 rounded-xl transition-all flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;

