"""
TradesMate Flask Backend Application
AI-powered quotes and scheduling for UK tradespeople
"""

import os
from flask import Flask, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder='static', static_url_path='')

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///database/app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_CONTENT_LENGTH', 26214400))  # 25MB

# Initialize extensions
db = SQLAlchemy(app)
CORS(app, origins=os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(','))

# Import models
from models.user import User
from models.quote import Quote, Job, Invoice

# Import routes
from routes.user import user_bp
from routes.quotes import quotes_bp
from routes.voice import voice_bp
from routes.photo import photo_bp
from routes.calendar import calendar_bp

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api/user')
app.register_blueprint(quotes_bp, url_prefix='/api/quotes')
app.register_blueprint(voice_bp, url_prefix='/api/voice')
app.register_blueprint(photo_bp, url_prefix='/api/photo')
app.register_blueprint(calendar_bp, url_prefix='/api/calendar')

# Create database tables
with app.app_context():
    # Create database directory if it doesn't exist
    db_dir = os.path.dirname(app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', ''))
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir)
    
    db.create_all()
    
    # Create demo user if none exists
    if not User.query.first():
        demo_user = User(
            name="Demo Tradesperson",
            email="demo@tradesmate.co.uk",
            phone="+44 7700 900123",
            trade_type="Electrician",
            company_name="Demo Electrical Services"
        )
        db.session.add(demo_user)
        db.session.commit()
        print("Created demo user")

# Dashboard API endpoint
@app.route('/api/dashboard')
def dashboard():
    """Get dashboard data for the demo user"""
    try:
        user = User.query.first()
        if not user:
            return jsonify({'error': 'No user found'}), 404
        
        # Get recent quotes
        recent_quotes = Quote.query.filter_by(user_id=user.id).order_by(Quote.created_at.desc()).limit(5).all()
        
        # Get upcoming jobs
        upcoming_jobs = Job.query.filter_by(user_id=user.id, status='scheduled').order_by(Job.scheduled_date).limit(5).all()
        
        # Calculate stats
        total_quotes = Quote.query.filter_by(user_id=user.id).count()
        total_revenue = db.session.query(db.func.sum(Quote.total_amount)).filter_by(user_id=user.id, status='accepted').scalar() or 0
        
        return jsonify({
            'user': {
                'name': user.name,
                'trade_type': user.trade_type,
                'company_name': user.company_name
            },
            'stats': {
                'total_quotes': total_quotes,
                'total_revenue': float(total_revenue),
                'quotes_this_month': Quote.query.filter_by(user_id=user.id).filter(
                    Quote.created_at >= db.func.date('now', 'start of month')
                ).count()
            },
            'recent_quotes': [{
                'id': q.id,
                'customer_name': q.customer_name,
                'job_description': q.job_description,
                'total_amount': float(q.total_amount),
                'status': q.status,
                'created_at': q.created_at.isoformat()
            } for q in recent_quotes],
            'upcoming_jobs': [{
                'id': j.id,
                'customer_name': j.customer_name,
                'job_description': j.job_description,
                'scheduled_date': j.scheduled_date.isoformat() if j.scheduled_date else None,
                'status': j.status
            } for j in upcoming_jobs]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'TradesMate API',
        'version': '1.0.0'
    })

# Serve React app
@app.route('/')
def serve_react_app():
    """Serve the React application"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    """Serve static files or React app for client-side routing"""
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Create uploads directory
    upload_dir = os.getenv('UPLOAD_FOLDER', 'uploads')
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        os.makedirs(os.path.join(upload_dir, 'audio'))
        os.makedirs(os.path.join(upload_dir, 'photos'))
    
    # Run the application
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"🚀 TradesMate API starting on port {port}")
    print(f"📊 Dashboard: http://localhost:{port}/api/dashboard")
    print(f"🏠 Frontend: http://localhost:{port}/")
    
    app.run(host='0.0.0.0', port=port, debug=debug)

