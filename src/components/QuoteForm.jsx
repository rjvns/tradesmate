import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Save, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Calculator, 
  Plus, 
  Trash2,
  PoundSterling,
  Clock
} from 'lucide-react';

// Move Input component outside to prevent recreation
const FormInput = React.memo(({ label, type = 'text', value, onChange, error, placeholder, icon: Icon, ...props }) => (
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
));

const FormSelect = React.memo(({ label, value, onChange, options, error }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
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
));

const FormTextArea = React.memo(({ label, value, onChange, error, placeholder, rows = 4 }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
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
));

const QuoteForm = ({ quote, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    job_description: '',
    job_type: 'general',
    urgency: 'normal',
    labour_hours: '0',
    labour_rate: '45',
    materials_cost: '0'
  });

  // Update form data when quote prop changes
  useEffect(() => {
    console.log('QuoteForm: quote prop changed:', quote);
    if (quote) {
      setFormData({
        customer_name: quote.customer_name || '',
        customer_email: quote.customer_email || '',
        customer_phone: quote.customer_phone || '',
        customer_address: quote.address || quote.customer_address || '',
        job_description: quote.job_description || '',
        job_type: quote.job_type || 'general',
        urgency: quote.urgency || 'normal',
        labour_hours: quote.labour_hours ? String(quote.labour_hours) : '0',
        labour_rate: quote.labour_rate ? String(quote.labour_rate) : '45',
        materials_cost: quote.materials_cost ? String(quote.materials_cost) : '0'
      });
    } else {
      // Reset form for new quote
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        job_description: '',
        job_type: 'general',
        urgency: 'normal',
        labour_hours: '0',
        labour_rate: '45',
        materials_cost: '0'
      });
    }
  }, [quote?.id, quote]);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const jobTypes = [
    { value: 'electrical', label: 'Electrical' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'heating', label: 'Heating' },
    { value: 'building', label: 'Building' },
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'decorating', label: 'Decorating' },
    { value: 'roofing', label: 'Roofing' },
    { value: 'general', label: 'General' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[field]) {
        return {
          ...prev,
          [field]: ''
        };
      }
      return prev;
    });
  }, []);

  const calculateTotals = () => {
    const labourHours = parseFloat(formData.labour_hours) || 0;
    const labourRate = parseFloat(formData.labour_rate) || 0;
    const materialsCost = parseFloat(formData.materials_cost) || 0;
    
    const labourCost = labourHours * labourRate;
    const subtotal = labourCost + materialsCost;
    const vatRate = 0.20; // 20% VAT
    const vatAmount = subtotal * vatRate;
    const total = subtotal + vatAmount;

    return {
      labourCost: labourCost.toFixed(2),
      subtotal: subtotal.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) newErrors.customer_name = 'Customer name is required';
    if (!formData.customer_email.trim()) newErrors.customer_email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) newErrors.customer_email = 'Invalid email format';
    if (!formData.customer_phone.trim()) newErrors.customer_phone = 'Phone number is required';
    if (!formData.job_description.trim()) newErrors.job_description = 'Job description is required';
    if (parseFloat(formData.labour_hours) <= 0) newErrors.labour_hours = 'Labour hours must be greater than 0';
    if (parseFloat(formData.labour_rate) <= 0) newErrors.labour_rate = 'Labour rate must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const endpoint = quote ? `/api/quotes/${quote.id}` : '/api/quotes/create';
      const method = quote ? 'PUT' : 'POST';
      
      // Convert string values to numbers for API
      const apiData = {
        ...formData,
        labour_hours: parseFloat(formData.labour_hours) || 0,
        labour_rate: parseFloat(formData.labour_rate) || 0,
        materials_cost: parseFloat(formData.materials_cost) || 0
      };
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.quote);
        onClose();
      } else {
        const error = await response.json();
        alert(`Failed to save quote: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Failed to save quote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-gray-700" />
            <h2 className="text-2xl font-black text-gray-900">
              {quote ? `Edit Quote ${quote.quote_number || ''}` : 'Create New Quote'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Customer Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Customer Name"
                value={formData.customer_name}
                onChange={(value) => handleInputChange('customer_name', value)}
                error={errors.customer_name}
                placeholder="John Smith"
                icon={User}
              />
              <FormInput
                label="Email Address"
                type="email"
                value={formData.customer_email}
                onChange={(value) => handleInputChange('customer_email', value)}
                error={errors.customer_email}
                placeholder="john@example.com"
                icon={Mail}
              />
              <FormInput
                label="Phone Number"
                type="tel"
                value={formData.customer_phone}
                onChange={(value) => handleInputChange('customer_phone', value)}
                error={errors.customer_phone}
                placeholder="07700 900123"
                icon={Phone}
              />
              <FormInput
                label="Address"
                value={formData.customer_address}
                onChange={(value) => handleInputChange('customer_address', value)}
                error={errors.customer_address}
                placeholder="123 High Street, London"
                icon={MapPin}
              />
            </div>
          </div>

          {/* Job Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Job Information</h3>
            <div className="space-y-6">
              <FormTextArea
                label="Job Description"
                value={formData.job_description}
                onChange={(value) => handleInputChange('job_description', value)}
                error={errors.job_description}
                placeholder="Describe the work to be performed..."
                rows={4}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                  label="Job Type"
                  value={formData.job_type}
                  onChange={(value) => handleInputChange('job_type', value)}
                  options={jobTypes}
                />
                <FormSelect
                  label="Urgency"
                  value={formData.urgency}
                  onChange={(value) => handleInputChange('urgency', value)}
                  options={urgencyLevels}
                />
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput
                label="Labour Hours"
                type="number"
                step="0.5"
                min="0"
                value={formData.labour_hours}
                onChange={(value) => handleInputChange('labour_hours', value)}
                error={errors.labour_hours}
                icon={Clock}
              />
              <FormInput
                label="Labour Rate (£/hour)"
                type="number"
                step="0.01"
                min="0"
                value={formData.labour_rate}
                onChange={(value) => handleInputChange('labour_rate', value)}
                error={errors.labour_rate}
                icon={PoundSterling}
              />
              <FormInput
                label="Materials Cost (£)"
                type="number"
                step="0.01"
                min="0"
                value={formData.materials_cost}
                onChange={(value) => handleInputChange('materials_cost', value)}
                error={errors.materials_cost}
                icon={Calculator}
              />
            </div>
          </div>

          {/* Quote Summary */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quote Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-800">
                <span>Labour ({formData.labour_hours} hours × £{formData.labour_rate}):</span>
                <span>£{totals.labourCost}</span>
              </div>
              <div className="flex justify-between text-gray-800">
                <span>Materials:</span>
                <span>£{Number(formData.materials_cost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-800 border-t border-gray-300 pt-3">
                <span>Subtotal:</span>
                <span>£{totals.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-800">
                <span>VAT (20%):</span>
                <span>£{totals.vatAmount}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold text-xl border-t border-gray-300 pt-3">
                <span>Total:</span>
                <span>£{totals.total}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold px-8 py-3 rounded-lg transition-all flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>{isLoading ? 'Saving...' : (quote ? 'Update Quote' : 'Create Quote')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteForm;
