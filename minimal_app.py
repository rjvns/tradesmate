#!/usr/bin/env python3
"""
Minimal Flask app for Railway deployment testing
"""

from flask import Flask, jsonify
from datetime import datetime
import os

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'message': 'TradesMate API - Minimal Version',
        'status': 'running',
        'timestamp': datetime.utcnow().isoformat(),
        'port': os.getenv('PORT', '8000')
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
