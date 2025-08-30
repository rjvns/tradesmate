"""
TradesMate Flask Application - Database Enabled Version
Full database integration with user authentication and quote persistence
Updated: 2025-01-27 Push to Production - Live Deployment
"""

import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

def create_app(test_config=None):
    """Application factory function"""
    app = Flask(__name__, instance_relative_config=True)
    CORS(app, supports_credentials=True)

    # --- Configuration ---
    # Allow dev fallback and auto-generate for Railway if needed
    secret_key = os.getenv('SECRET_KEY')
    flask_env = os.getenv('FLASK_ENV', 'development')
    
    if not secret_key:
        if flask_env == 'production':
            # Auto-generate a secret key for Railway deployment
            import secrets
            secret_key = secrets.token_hex(32)
            log.warning("SECRET_KEY not provided. Generated temporary key for this session. For production, set SECRET_KEY environment variable in Railway.")
        else:
            secret_key = 'dev-secret-key-for-local-development-only'
            log.warning("Using development SECRET_KEY. Set SECRET_KEY environment variable for production.")
    
    app.config.from_mapping(
        SECRET_KEY=secret_key,
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        MAX_CONTENT_LENGTH=int(os.getenv('MAX_CONTENT_LENGTH', 26214400))
    )

    if test_config is None:
        database_url = os.getenv('DATABASE_URL')
        if database_url:
            if database_url.startswith('postgres://'):
                database_url = database_url.replace('postgres://', 'postgresql://', 1)
            app.config['SQLALCHEMY_DATABASE_URI'] = database_url
            log.info("Production database configured.")
        else:
            # Fallback for local development if DATABASE_URL is not set
            # Use consistent path relative to backend directory
            backend_root = os.path.dirname(os.path.dirname(__file__))
            db_path = os.path.join(backend_root, 'instance', 'tradesmate.db')
            os.makedirs(os.path.dirname(db_path), exist_ok=True)
            app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
            log.info(f"Using local SQLite database at {db_path}")
    else:
        app.config.from_mapping(test_config)
        log.info("Test configuration loaded.")

    # --- Database Initialization ---
    try:
        # Handle both relative and absolute imports
        try:
            from .database import db
        except ImportError:
            from database import db
        db.init_app(app)
        log.info("Database initialized successfully.")
    except ImportError as e:
        log.critical(f"CRITICAL: Could not import database module. Error: {e}")
        # In a real app, we might want to exit here if the DB is essential
    except Exception as e:
        log.critical(f"CRITICAL: An unexpected error occurred during DB initialization: {e}")


    # --- Root Route (Essential for Railway healthcheck) ---
    @app.route('/')
    def home():
        """Root route for Railway healthcheck - Simple and robust"""
        try:
            return jsonify({
                'message': 'TradesMate API is running',
                'status': 'healthy',
                'timestamp': datetime.utcnow().isoformat(),
                'version': '1.0.0'
            })
        except Exception as e:
            log.error(f"Root route error: {e}")
            return jsonify({
                'message': 'TradesMate API basic check',
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }), 500

    # --- Health Check Route (Essential for deployment) ---
    @app.route('/health')
    def health_check():
        """Comprehensive health check with graceful error handling"""
        try:
            db_status = "disconnected"
            try:
                # Use the already initialized db
                try:
                    from .database import db
                except ImportError:
                    from database import db
                from sqlalchemy import text
                db.session.execute(text('SELECT 1'))
                db_status = "connected"
                log.info("Health check: Database connection successful.")
            except Exception as e:
                db_status = f"error: {str(e)[:100]}"  # Truncate long error messages
                log.warning(f"Health check: Database connection failed: {e}")

            return jsonify({
                'status': 'healthy',
                'message': 'TradesMate API is running',
                'timestamp': datetime.utcnow().isoformat(),
                'database': db_status,
                'version': '1.0.0'
            })
        except Exception as e:
            log.error(f"Health check route error: {e}")
            return jsonify({
                'status': 'error',
                'message': 'Health check failed',
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }), 500

    # --- Register Blueprints and Create Tables ---
    with app.app_context():
        try:
            # Handle flexible imports for both deployment and local dev
            try:
                from .database import db
                from .routes import auth, quotes
                from .models import User, Quote
            except ImportError:
                from database import db
                from routes import auth, quotes
                from models import User, Quote

            app.register_blueprint(auth.auth_bp)
            app.register_blueprint(quotes.quotes_bp)
            log.info("Blueprints registered successfully.")

            db.create_all()
            log.info("Database tables created/verified.")

        except ImportError as e:
            log.error(f"Failed to import a module during app context setup. Error: {e}")
        except Exception as e:
            log.error(f"An error occurred during app context setup (tables/blueprints). Error: {e}")

    return app

# This allows running for local dev with `python -m src.main`
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5001)
