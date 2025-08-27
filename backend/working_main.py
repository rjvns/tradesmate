import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        'message': 'TradesMate API',
        'version': '1.0.0',
        'status': 'running'
    })

@app.route('/api/dashboard')
def dashboard():
    return jsonify({
        'user': {'name': 'Demo Tradesperson', 'trade': 'Electrician'},
        'recent_quotes': [
            {'customer': 'Mrs. Johnson', 'job': 'Kitchen tap', 'amount': 135.00},
            {'customer': 'Mr. Smith', 'job': 'Bathroom light', 'amount': 89.50}
        ],
        'stats': {'quotes': 5, 'jobs': 3}
    })

if __name__ == '__main__':
    # Use Railway's PORT environment variable, fallback to 5000
    port = int(os.environ.get('PORT', 5000))
    # Bind to 0.0.0.0 so Railway can reach it
    app.run(host='0.0.0.0', port=port, debug=False)