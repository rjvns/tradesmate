"""
Calendar Service for TradesMate
Handles Google Calendar integration
"""

import os
from datetime import datetime, timedelta

class CalendarService:
    """Service for calendar integration"""
    
    def __init__(self):
        # In production, you would initialize Google Calendar API here
        self.calendar_id = os.getenv('GOOGLE_CALENDAR_ID', 'primary')
    
    def get_upcoming_events(self, days_ahead=7):
        """
        Get upcoming calendar events
        
        Args:
            days_ahead (int): Number of days to look ahead
            
        Returns:
            dict: Calendar events
        """
        try:
            # For demo purposes, return mock events
            now = datetime.now()
            events = [
                {
                    'id': 'demo-event-1',
                    'title': 'Kitchen installation - Mrs. Smith',
                    'start_time': (now + timedelta(days=1)).isoformat(),
                    'end_time': (now + timedelta(days=1, hours=3)).isoformat(),
                    'description': 'Complete kitchen tap installation'
                },
                {
                    'id': 'demo-event-2',
                    'title': 'Electrical inspection - Mr. Jones',
                    'start_time': (now + timedelta(days=3)).isoformat(),
                    'end_time': (now + timedelta(days=3, hours=2)).isoformat(),
                    'description': 'Annual electrical safety inspection'
                }
            ]
            
            return {
                'success': True,
                'events': events
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to fetch calendar events: {str(e)}'
            }
    
    def create_event(self, title, start_time, end_time, description=None, location=None):
        """
        Create a new calendar event
        
        Args:
            title (str): Event title
            start_time (datetime): Event start time
            end_time (datetime): Event end time
            description (str): Event description
            location (str): Event location
            
        Returns:
            dict: Created event details
        """
        try:
            # For demo purposes
            event_id = f"demo-{int(datetime.now().timestamp())}"
            
            return {
                'success': True,
                'event': {
                    'id': event_id,
                    'title': title,
                    'start_time': start_time.isoformat(),
                    'end_time': end_time.isoformat(),
                    'description': description,
                    'location': location
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to create calendar event: {str(e)}'
            }
    
    def find_available_slots(self, duration_hours=2, days_ahead=14):
        """
        Find available time slots for scheduling
        
        Args:
            duration_hours (int): Duration needed in hours
            days_ahead (int): How many days to search ahead
            
        Returns:
            dict: Available time slots
        """
        try:
            # For demo purposes, return some mock available slots
            now = datetime.now()
            slots = []
            
            for day in range(1, days_ahead + 1):
                base_date = now + timedelta(days=day)
                
                # Mock available slots (9 AM - 5 PM)
                for hour in [9, 11, 14, 16]:
                    slot_start = base_date.replace(hour=hour, minute=0, second=0, microsecond=0)
                    slot_end = slot_start + timedelta(hours=duration_hours)
                    
                    slots.append({
                        'start_time': slot_start.isoformat(),
                        'end_time': slot_end.isoformat(),
                        'available': True
                    })
            
            return {
                'success': True,
                'available_slots': slots[:10]  # Return first 10 slots
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to find available slots: {str(e)}'
            }
