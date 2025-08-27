import os
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        'message': 'TradesMate API',
        'version': '1.0.0',
        'status': 'running',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/dashboard')
def dashboard():
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

@app.route('/api/quotes/')
def get_quotes():
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

@app.route('/api/quotes/stats')
def get_quote_stats():
    return jsonify({
        'total_quotes': 15,
        'total_value': 2450.00,
        'sent_quotes': 8,
        'accepted_quotes': 5,
        'draft_quotes': 2
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)