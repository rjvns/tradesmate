import React, { useState, useRef } from 'react';
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

  const Input = ({ label, type = 'text', value, onChange, error, placeholder, icon: Icon, ...props }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-white">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-white/50" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            block w-full rounded-2xl transition-all duration-300
            ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3
            text-white placeholder-white/50 font-medium
            bg-white/10 backdrop-blur-md border border-white/20
            focus:bg-white/15 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20
            ${error ? 'border-red-400/50' : ''}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-300 font-medium">{error}</p>}
    </div>
  );

  const Select = ({ label, value, onChange, options, error }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-white">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`
          block w-full rounded-2xl px-4 py-3 text-white font-medium
          bg-white/10 backdrop-blur-md border border-white/20
          focus:bg-white/15 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20
          ${error ? 'border-red-400/50' : ''}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-800 text-white">
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-300 font-medium">{error}</p>}
    </div>
  );

  const TextArea = ({ label, value, onChange, error, placeholder, rows = 4 }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-white">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`
          block w-full rounded-2xl px-4 py-3 text-white placeholder-white/50 font-medium
          bg-white/10 backdrop-blur-md border border-white/20
          focus:bg-white/15 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20
          resize-none
          ${error ? 'border-red-400/50' : ''}
        `}
      />
      {error && <p className="text-sm text-red-300 font-medium">{error}</p>}
    </div>
  );

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
        <label className="text-sm font-semibold text-white cursor-pointer" onClick={() => onChange(!checked)}>
          {label}
        </label>
        {description && (
          <p className="text-xs text-white/60 mt-1">{description}</p>
        )}
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Image */}
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center overflow-hidden border-4 border-white/20">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-white/60" />
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
        <Input
          label="First Name"
          value={profileData.firstName}
          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
          error={errors.firstName}
          icon={User}
        />
        <Input
          label="Last Name"
          value={profileData.lastName}
          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
          error={errors.lastName}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email Address"
          type="email"
          value={profileData.email}
          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
          error={errors.email}
          icon={Mail}
        />
        <Input
          label="Phone Number"
          type="tel"
          value={profileData.phone}
          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
          error={errors.phone}
          icon={Phone}
        />
      </div>

      <Input
        label="Company Name"
        value={profileData.companyName}
        onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
        error={errors.companyName}
        icon={Building}
      />

      <Select
        label="Trade Type"
        value={profileData.tradeType}
        onChange={(e) => setProfileData({...profileData, tradeType: e.target.value})}
        options={tradeTypes}
      />

      <TextArea
        label="Bio"
        value={profileData.bio}
        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
        placeholder="Tell customers about your experience and expertise..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Address"
          value={profileData.address}
          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
        />
        <Input
          label="Postcode"
          value={profileData.postcode}
          onChange={(e) => setProfileData({...profileData, postcode: e.target.value})}
        />
      </div>

      <Input
        label="Website"
        value={profileData.website}
        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
        placeholder="https://yourwebsite.com"
        icon={Globe}
      />
    </div>
  );

  const renderBusinessTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Hourly Rate (£)"
          type="number"
          value={businessData.hourlyRate}
          onChange={(e) => setBusinessData({...businessData, hourlyRate: e.target.value})}
          icon={DollarSign}
        />
        <Input
          label="VAT Number"
          value={businessData.vatNumber}
          onChange={(e) => setBusinessData({...businessData, vatNumber: e.target.value})}
          placeholder="GB123456789"
        />
      </div>

      <Toggle
        label="VAT Registered"
        checked={businessData.isVatRegistered}
        onChange={(checked) => setBusinessData({...businessData, isVatRegistered: checked})}
        description="Include VAT calculations in quotes"
      />

      <div>
        <h3 className="text-lg font-bold text-white mb-4">Working Hours</h3>
        <div className="space-y-4">
          {Object.entries(businessData.workingHours).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl">
              <div className="w-20">
                <Toggle
                  label={day.charAt(0).toUpperCase() + day.slice(1)}
                  checked={hours.enabled}
                  onChange={(checked) => setBusinessData({
                    ...businessData,
                    workingHours: {
                      ...businessData.workingHours,
                      [day]: {...hours, enabled: checked}
                    }
                  })}
                />
              </div>
              {hours.enabled && (
                <div className="flex items-center space-x-2 flex-1">
                  <input
                    type="time"
                    value={hours.start}
                    onChange={(e) => setBusinessData({
                      ...businessData,
                      workingHours: {
                        ...businessData.workingHours,
                        [day]: {...hours, start: e.target.value}
                      }
                    })}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                  <span className="text-white/60">to</span>
                  <input
                    type="time"
                    value={hours.end}
                    onChange={(e) => setBusinessData({
                      ...businessData,
                      workingHours: {
                        ...businessData.workingHours,
                        [day]: {...hours, end: e.target.value}
                      }
                    })}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
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
        <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={securityData.currentPassword}
            onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
            error={errors.currentPassword}
            icon={Lock}
          />
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={securityData.newPassword}
            onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
            error={errors.newPassword}
            icon={Lock}
          />
          <Input
            label="Confirm New Password"
            type={showPassword ? 'text' : 'password'}
            value={securityData.confirmPassword}
            onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
            error={errors.confirmPassword}
            icon={Lock}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="text-sm">{showPassword ? 'Hide' : 'Show'} passwords</span>
          </button>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <Toggle
          label="Two-Factor Authentication"
          checked={securityData.twoFactorEnabled}
          onChange={(checked) => setSecurityData({...securityData, twoFactorEnabled: checked})}
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
        onChange={(checked) => setNotificationData({...notificationData, emailNotifications: checked})}
        description="Receive notifications via email"
      />
      
      <Toggle
        label="SMS Notifications"
        checked={notificationData.smsNotifications}
        onChange={(checked) => setNotificationData({...notificationData, smsNotifications: checked})}
        description="Receive notifications via text message"
      />
      
      <Toggle
        label="Quote Reminders"
        checked={notificationData.quoteReminders}
        onChange={(checked) => setNotificationData({...notificationData, quoteReminders: checked})}
        description="Get reminders for pending quotes"
      />
      
      <Toggle
        label="Push Notifications"
        checked={notificationData.pushNotifications}
        onChange={(checked) => setNotificationData({...notificationData, pushNotifications: checked})}
        description="Receive push notifications in your browser"
      />
      
      <Toggle
        label="Marketing Emails"
        checked={notificationData.marketingEmails}
        onChange={(checked) => setNotificationData({...notificationData, marketingEmails: checked})}
        description="Receive updates about new features and tips"
      />
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Calendar */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-8 w-8 text-blue-400" />
            <div>
              <h3 className="font-bold text-white">Google Calendar</h3>
              <p className="text-sm text-white/60">Sync your appointments</p>
            </div>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
            Connect
          </button>
        </div>

        {/* QuickBooks */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="h-8 w-8 text-green-400" />
            <div>
              <h3 className="font-bold text-white">QuickBooks</h3>
              <p className="text-sm text-white/60">Accounting integration</p>
            </div>
          </div>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
            Connect
          </button>
        </div>

        {/* Stripe */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="h-8 w-8 text-purple-400" />
            <div>
              <h3 className="font-bold text-white">Stripe</h3>
              <p className="text-sm text-white/60">Payment processing</p>
            </div>
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
            Connect
          </button>
        </div>

        {/* WhatsApp */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <Smartphone className="h-8 w-8 text-green-400" />
            <div>
              <h3 className="font-bold text-white">WhatsApp Business</h3>
              <p className="text-sm text-white/60">Customer messaging</p>
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
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900 rounded-3xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-white" />
            <h2 className="text-2xl font-black text-white">Account & Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white/5 border-r border-white/10 p-4">
            <nav className="space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all
                    ${activeTab === id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
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
        <div className="border-t border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {successMessage && (
              <div className="flex items-center space-x-2 text-green-400">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-white/70 hover:text-white font-medium transition-colors"
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

