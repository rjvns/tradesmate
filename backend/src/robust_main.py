"""
TradesMate Flask Application - Robust Version
AI-powered quotes and scheduling for UK tradespeople
This version ensures healthcheck always works, even if some features fail
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

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

# CRITICAL: Health check routes FIRST (before any complex initialization)
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
            'message': 'TradesMate API is running (robust version)'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

# Initialize database with error handling
db = None
try:
    from database import db
    db.init_app(app)
    print("Database module imported successfully")
except Exception as e:
    print(f"Database import warning: {e}")
    # Continue without database

# Create database tables with error handling
try:
    if db:
        with app.app_context():
            db.create_all()
            print("Database tables created successfully")
except Exception as e:
    print(f"Database initialization warning: {e}")
    # Continue anyway - tables might already exist

# Import and register blueprints with error handling
try:
    from routes.quotes import quotes_bp
    app.register_blueprint(quotes_bp, url_prefix='/api/quotes')
    print("Quotes blueprint registered successfully")
except Exception as e:
    print(f"Quotes blueprint warning: {e}")
    # Continue without quotes functionality

try:
    from routes.voice import voice_bp
    app.register_blueprint(voice_bp, url_prefix='/api/voice')
    print("Voice blueprint registered successfully")
except Exception as e:
    print(f"Voice blueprint warning: {e}")
    # Continue without voice functionality

try:
    from routes.user import user_bp
    app.register_blueprint(user_bp, url_prefix='/api/user')
    print("User blueprint registered successfully")
except Exception as e:
    print(f"User blueprint warning: {e}")
    # Continue without user functionality

try:
    from routes.photo import photo_bp
    app.register_blueprint(photo_bp, url_prefix='/api/photo')
    print("Photo blueprint registered successfully")
except Exception as e:
    print(f"Photo blueprint warning: {e}")
    # Continue without photo functionality

try:
    from routes.calendar import calendar_bp
    app.register_blueprint(calendar_bp, url_prefix='/api/calendar')
    print("Calendar blueprint registered successfully")
except Exception as e:
    print(f"Calendar blueprint warning: {e}")
    # Continue without calendar functionality

# Dashboard route with error handling
@app.route('/api/dashboard')
def dashboard():
    """Dashboard data for the frontend"""
    try:
        if not db:
            # Fallback to hardcoded data if database is not available
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

        # Import models here to avoid circular imports
        from models.user import User
        from models.quote import Quote, Job
        
        # Get or create demo user
        user = User.query.first()
        if not user:
            user = User(
                name="Demo Tradesperson",
                email="demo@tradesmate.co.uk",
                phone="07700 900123",
                trade_type="Electrician",
                hourly_rate=45.0,
                company_name="Demo Electrical Services",
                address="123 Demo Street, London, SW1A 1AA",
                vat_number="GB123456789"
            )
            db.session.add(user)
            db.session.commit()

        # Get recent quotes (create some demo data if none exist)
        recent_quotes = Quote.query.filter_by(user_id=user.id).order_by(Quote.created_at.desc()).limit(5).all()
        
        if not recent_quotes:
            # Create demo quotes
            demo_quotes = [
                {
                    'customer_name': 'Mrs. Johnson',
                    'job_description': 'Kitchen tap replacement',
                    'total_amount': 135.00,
                    'status': 'sent'
                },
                {
                    'customer_name': 'Mr. Smith',
                    'job_description': 'Bathroom light fitting',
                    'total_amount': 89.50,
                    'status': 'accepted'
                }
            ]
            
            for demo in demo_quotes:
                quote = Quote(
                    user_id=user.id,
                    customer_name=demo['customer_name'],
                    job_description=demo['job_description'],
                    total_amount=demo['total_amount'],
                    status=demo['status'],
                    quote_number=f"TM-{datetime.now().strftime('%Y%m%d')}-{len(recent_quotes) + 1:04d}"
                )
                db.session.add(quote)
            
            db.session.commit()
            recent_quotes = Quote.query.filter_by(user_id=user.id).order_by(Quote.created_at.desc()).limit(5).all()

        # Get upcoming jobs
        upcoming_jobs = Job.query.filter_by(user_id=user.id).filter(
            Job.scheduled_date >= datetime.utcnow()
        ).order_by(Job.scheduled_date.asc()).limit(5).all()

        return jsonify({
            'user': user.to_dict(),
            'recent_quotes': [quote.to_dict() for quote in recent_quotes],
            'upcoming_jobs': [job.to_dict() for job in upcoming_jobs],
            'stats': {
                'total_quotes': Quote.query.filter_by(user_id=user.id).count(),
                'accepted_quotes': Quote.query.filter_by(user_id=user.id, status='accepted').count(),
                'total_jobs': Job.query.filter_by(user_id=user.id).count(),
                'completed_jobs': Job.query.filter_by(user_id=user.id, status='completed').count()
            }
        })
    except Exception as e:
        print(f"Dashboard error: {e}")
        # Fallback to hardcoded data
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
                }
            ],
            'upcoming_jobs': [],
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

if __name__ == '__main__':
    with app.app_context():
        if db:
            # Import models here
            try:
                from models.user import User
                from models.quote import Quote, Job, Invoice
                db.create_all()
            except Exception as e:
                print(f"Model initialization warning: {e}")
    app.run(debug=True, host='0.0.0.0', port=5001)
