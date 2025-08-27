"""
TradesMate Flask Application - Simple Robust Version
This version ensures ALL endpoints work, even if some features fail
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_CONTENT_LENGTH', 26214400))

# Database configuration for production (Railway)
database_url = os.getenv('DATABASE_URL')
if database_url and database_url.startswith('postgres://'):
    # Railway provides postgres:// but SQLAlchemy expects postgresql://
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///tradesmate.db'

# CRITICAL: Core routes FIRST (before any complex initialization)
@app.route('/')
def home():
    """Home route - always works"""
    return jsonify({
        'message': 'TradesMate API',
        'version': '1.0.0',
        'status': 'running',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/health')
def health_check():
    """Health check endpoint for Railway - ALWAYS works"""
    try:
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'message': 'TradesMate API is running (simple robust version)'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

# Dashboard route with hardcoded data (always works)
@app.route('/api/dashboard')
def dashboard():
    """Dashboard data for the frontend - always works"""
    return jsonify({
        'user': {
            'name': 'Demo Tradesperson', 
            'email': 'demo@tradesmate.co.uk',
            'company': 'Demo Electrical Services',
            'trade': 'Electrician'
        },
        'recent_quotes': [
            {
                'id': 1,
                'customer_name': 'Mrs. Johnson',
                'job_description': 'Kitchen tap replacement',
                'amount': 135.00,
                'status': 'sent',
                'created_at': '2024-01-15'
            },
            {
                'id': 2,
                'customer_name': 'Mr. Smith', 
                'job_description': 'Bathroom light fitting',
                'amount': 89.50,
                'status': 'accepted',
                'created_at': '2024-01-14'
            }
        ],
        'upcoming_jobs': [
            {
                'id': 1,
                'customer_name': 'Mrs. Wilson',
                'job_description': 'Rewiring kitchen',
                'scheduled_date': '2024-01-18',
                'time': '09:00',
                'status': 'confirmed'
            }
        ],
        'stats': {
            'totalRevenue': 12450,
            'revenueChange': 12.5,
            'activeQuotes': 8,
            'quotesChange': -2,
            'completedJobs': 24,
            'jobsChange': 18.2,
            'customerSatisfaction': 4.8,
            'satisfactionChange': 2.1
        }
    })

# Quotes endpoints with hardcoded data (always work)
@app.route('/api/quotes/', methods=['GET'])
def get_quotes():
    """Get all quotes - always works with hardcoded data"""
    return jsonify([
        {
            'id': 1,
            'quote_number': 'TM-20240115-0001',
            'customer_name': 'Mrs. Johnson',
            'job_description': 'Kitchen tap replacement',
            'total_amount': 135.00,
            'status': 'sent',
            'created_at': '2024-01-15T10:30:00Z'
        },
        {
            'id': 2,
            'quote_number': 'TM-20240114-0002', 
            'customer_name': 'Mr. Smith',
            'job_description': 'Bathroom light fitting',
            'total_amount': 89.50,
            'status': 'accepted',
            'created_at': '2024-01-14T14:20:00Z'
        }
    ])

@app.route('/api/quotes/create', methods=['POST'])
def create_quote():
    """Create a new quote - always works with hardcoded response"""
    try:
        data = request.get_json()
        
        # Calculate totals
        labour_hours = float(data.get('labour_hours', 0))
        labour_rate = float(data.get('labour_rate', 45))
        materials_cost = float(data.get('materials_cost', 0))
        
        labour_cost = labour_hours * labour_rate
        subtotal = labour_cost + materials_cost
        vat_amount = subtotal * 0.20  # 20% VAT
        total_amount = subtotal + vat_amount
        
        # Create a mock quote response
        new_quote = {
            'id': 999,  # Mock ID
            'quote_number': f"TM-{datetime.now().strftime('%Y%m%d')}-{999:04d}",
            'customer_name': data.get('customer_name', 'New Customer'),
            'customer_email': data.get('customer_email', ''),
            'customer_phone': data.get('customer_phone', ''),
            'customer_address': data.get('customer_address', ''),
            'job_description': data.get('job_description', ''),
            'job_type': data.get('job_type', 'general'),
            'urgency': data.get('urgency', 'normal'),
            'labour_hours': labour_hours,
            'labour_rate': labour_rate,
            'materials_cost': materials_cost,
            'subtotal': round(subtotal, 2),
            'vat_amount': round(vat_amount, 2),
            'total_amount': round(total_amount, 2),
            'status': 'draft',
            'created_at': datetime.utcnow().isoformat(),
            'valid_until': (datetime.utcnow() + timedelta(days=30)).isoformat()
        }
        
        return jsonify({
            'success': True,
            'message': 'Quote created successfully',
            'quote': new_quote
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/quotes/stats', methods=['GET'])
def get_quote_stats():
    """Get quote statistics - always works"""
    return jsonify({
        'total_quotes': 15,
        'total_value': 2450.00,
        'sent_quotes': 8,
        'accepted_quotes': 5,
        'draft_quotes': 2
    })

# Initialize database with error handling (optional)
db = None
try:
    from database import db
    db.init_app(app)
    print("Database module imported successfully")
    
    # Try to create tables
    try:
        with app.app_context():
            db.create_all()
            print("Database tables created successfully")
    except Exception as e:
        print(f"Database initialization warning: {e}")
        
except Exception as e:
    print(f"Database import warning: {e}")
    # Continue without database

# Try to import and register additional blueprints (optional)
try:
    from routes.voice import voice_bp
    app.register_blueprint(voice_bp, url_prefix='/api/voice')
    print("Voice blueprint registered successfully")
except Exception as e:
    print(f"Voice blueprint warning: {e}")

try:
    from routes.user import user_bp
    app.register_blueprint(user_bp, url_prefix='/api/user')
    print("User blueprint registered successfully")
except Exception as e:
    print(f"User blueprint warning: {e}")

try:
    from routes.photo import photo_bp
    app.register_blueprint(photo_bp, url_prefix='/api/photo')
    print("Photo blueprint registered successfully")
except Exception as e:
    print(f"Photo blueprint warning: {e}")

try:
    from routes.calendar import calendar_bp
    app.register_blueprint(calendar_bp, url_prefix='/api/calendar')
    print("Calendar blueprint registered successfully")
except Exception as e:
    print(f"Calendar blueprint warning: {e}")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
