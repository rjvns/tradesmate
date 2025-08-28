"""
TradesMate Flask Application - Database Enabled Version
Full database integration with user authentication and quote persistence
"""

import os
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from datetime import datetime, timedelta

import sys, os
# Ensure we can import from the src directory
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)
print(f"Added to Python path: {current_dir}")  # Debug line

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)

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

# Initialize database
try:
    from database import db
    db.init_app(app)
    print("Database module imported successfully")
except Exception as e:
    print(f"Database import error: {e}")
    db = None

# CRITICAL: Health check routes FIRST (before any complex initialization)
@app.route('/')
def home():
    """Home route - always works"""
    return jsonify({
        'message': 'TradesMate API',
        'version': '2.0.0',
        'status': 'running',
        'database': 'enabled' if db else 'disabled',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/health')
def health_check():
    """Health check endpoint for Railway - ALWAYS works"""
    try:
        status = {
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'message': 'TradesMate API is running (database version)',
            'database': 'connected' if db else 'disconnected'
        }
        
        # Test database connection if available
        if db:
            try:
                db.session.execute('SELECT 1')
                status['database'] = 'connected'
            except Exception as e:
                status['database'] = f'error: {str(e)}'
        
        return jsonify(status), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

# Create database tables with error handling
if db:
    try:
        with app.app_context():
            db.create_all()
            print("Database tables created successfully")
    except Exception as e:
        print(f"Database table creation warning: {e}")

# Import and register authentication blueprint
try:
    from routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    print("Auth blueprint registered successfully")
except Exception as e:
    print(f"Auth blueprint warning: {e}")

# Dashboard route with database integration
@app.route('/api/dashboard')
def dashboard():
    """Dashboard data for the frontend"""
    try:
        # Check if user is authenticated
        user_id = session.get('user_id')
        
        if not db:
            # Fallback to hardcoded data if database is not available
            return jsonify({
                'user': {
                    'name': 'Demo User (No DB)', 
                    'email': 'demo@tradesmate.co.uk',
                    'company': 'Demo Services',
                    'trade': 'General'
                },
                'recent_quotes': [],
                'upcoming_jobs': [],
                'stats': {
                    'totalRevenue': 0,
                    'revenueChange': 0,
                    'activeQuotes': 0,
                    'quotesChange': 0,
                    'completedJobs': 0,
                    'jobsChange': 0,
                    'customerSatisfaction': 0,
                    'satisfactionChange': 0
                }
            })

        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401

        # Import models here to avoid circular imports
        from models.user import User
        from models.quote import Quote, Job
        
        user = User.query.get(user_id)
        if not user:
            session.clear()
            return jsonify({'error': 'User not found'}), 404

        # Get recent quotes
        recent_quotes = Quote.query.filter_by(user_id=user.id).order_by(Quote.created_at.desc()).limit(5).all()

        # Get upcoming jobs
        upcoming_jobs = Job.query.filter_by(user_id=user.id).filter(
            Job.scheduled_date >= datetime.utcnow()
        ).order_by(Job.scheduled_date.asc()).limit(5).all()

        # Calculate stats
        total_quotes = Quote.query.filter_by(user_id=user.id).count()
        accepted_quotes = Quote.query.filter_by(user_id=user.id, status='accepted').count()
        total_revenue = db.session.query(db.func.sum(Quote.total_amount)).filter_by(
            user_id=user.id, status='accepted'
        ).scalar() or 0

        return jsonify({
            'user': user.to_dict(),
            'recent_quotes': [quote.to_dict() for quote in recent_quotes],
            'upcoming_jobs': [job.to_dict() for job in upcoming_jobs],
            'stats': {
                'totalRevenue': float(total_revenue),
                'revenueChange': 0,  # Calculate this based on historical data
                'activeQuotes': total_quotes,
                'quotesChange': 0,  # Calculate this based on previous period
                'completedJobs': Job.query.filter_by(user_id=user.id, status='completed').count(),
                'jobsChange': 0,  # Calculate this based on previous period
                'customerSatisfaction': 4.8,  # This would come from reviews/feedback
                'satisfactionChange': 0
            }
        })
        
    except Exception as e:
        print(f"Dashboard error: {e}")
        return jsonify({'error': str(e)}), 500

# Quotes routes with database integration
@app.route('/api/quotes/', methods=['GET'])
def get_quotes():
    """Get all quotes for authenticated user"""
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401

        if not db:
            # Fallback to hardcoded data
            return jsonify([
                {
                    'id': 1,
                    'quote_number': 'TM-DEMO-001',
                    'customer_name': 'Demo Customer',
                    'job_description': 'Demo job (no database)',
                    'total_amount': 100.00,
                    'status': 'draft',
                    'created_at': datetime.utcnow().isoformat()
                }
            ])

        from models.quote import Quote
        quotes = Quote.query.filter_by(user_id=user_id).order_by(Quote.created_at.desc()).all()
        
        return jsonify([quote.to_dict() for quote in quotes])
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/quotes/create', methods=['POST'])
def create_quote():
    """Create a new quote"""
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401

        data = request.get_json()
        
        if not db:
            # Fallback response when database is not available
            return jsonify({
                'success': True,
                'message': 'Quote created (demo mode - no database)',
                'quote': {
                    'id': 999,
                    'quote_number': f"TM-DEMO-{datetime.now().strftime('%Y%m%d')}",
                    'customer_name': data.get('customer_name', 'Demo Customer'),
                    'total_amount': 0,
                    'status': 'draft'
                }
            }), 201

        from models.quote import Quote
        from services.ai_service import AIService
        
        # Calculate totals
        labour_hours = float(data.get('labour_hours', 0))
        labour_rate = float(data.get('labour_rate', 35))
        materials_cost = float(data.get('materials_cost', 0))
        
        labour_cost = labour_hours * labour_rate
        subtotal = labour_cost + materials_cost
        vat_amount = subtotal * 0.20  # 20% VAT
        total_amount = subtotal + vat_amount
        
        # Generate quote number
        ai_service = AIService()
        quote_number = ai_service.generate_quote_number()
        
        quote = Quote(
            user_id=user_id,
            customer_name=data.get('customer_name'),
            customer_email=data.get('customer_email'),
            customer_phone=data.get('customer_phone'),
            customer_address=data.get('customer_address'),
            job_description=data.get('job_description'),
            job_type=data.get('job_type', 'general'),
            urgency=data.get('urgency', 'normal'),
            labour_hours=labour_hours,
            labour_rate=labour_rate,
            materials_cost=materials_cost,
            subtotal=round(subtotal, 2),
            vat_amount=round(vat_amount, 2),
            total_amount=round(total_amount, 2),
            quote_number=quote_number,
            valid_until=datetime.utcnow() + timedelta(days=30)
        )
        
        db.session.add(quote)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Quote created successfully',
            'quote': quote.to_dict()
        }), 201
        
    except Exception as e:
        if db:
            db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
