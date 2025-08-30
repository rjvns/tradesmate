import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import Button from './ui/Button';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Sample events
  const events = [
    { id: 1, date: 15, title: "Kitchen Installation - Smith Residence", time: "09:00", type: "installation" },
    { id: 2, date: 18, title: "Quote Meeting - Johnson Project", time: "14:00", type: "meeting" },
    { id: 3, date: 22, title: "Bathroom Renovation - Brown House", time: "08:30", type: "renovation" },
  ];
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter(event => event.date === day);
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentDate.getMonth() && 
                     new Date().getFullYear() === currentDate.getFullYear();
      
      days.push(
        <div key={day} className={`h-24 border border-gray-200 p-1 ${isToday ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}>
          <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          {dayEvents.map(event => (
            <div key={event.id} className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 mt-1 truncate">
              {event.time} {event.title}
            </div>
          ))}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Schedule and manage your jobs and appointments</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Event
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-0">
              {renderCalendarDays()}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Events</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Kitchen Installation</p>
                  <p className="text-xs text-gray-500">Smith Residence</p>
                  <p className="text-xs text-blue-600">09:00 - 17:00</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="flex-shrink-0">
                  <CalendarIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Quote Meeting</p>
                  <p className="text-xs text-gray-500">New bathroom project</p>
                  <p className="text-xs text-green-600">14:00 - 15:00</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Jobs</span>
                <span className="text-sm font-semibold text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Meetings</span>
                <span className="text-sm font-semibold text-gray-900">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Installations</span>
                <span className="text-sm font-semibold text-gray-900">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
