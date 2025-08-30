#!/usr/bin/env python3
"""
TradesMate - Bulletproof Railway Deployment
Minimal Flask app that WILL work on Railway
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS

def create_app():
    """Dead simple Flask app factory"""
    app = Flask(__name__)
    
    # Basic config
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'railway-deployment-key-2024')
    
    # Enable CORS
    CORS(app, origins=['*'])
    
    @app.route('/')
    def home():
        """Railway healthcheck route"""
        return jsonify({
            'status': 'success',
            'message': 'TradesMate API is running',
            'service': 'healthy'
        })
    
    @app.route('/health')
    def health():
        """Health check"""
        return jsonify({
            'status': 'healthy',
            'service': 'TradesMate API'
        })
    
    @app.route('/api/status')
    def api_status():
        """API status"""
        return jsonify({
            'api': 'TradesMate',
            'version': '1.0.0',
            'status': 'operational'
        })
    
    return app

# For gunicorn
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
