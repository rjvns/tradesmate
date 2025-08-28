"""
TradesMate Flask Application - Database Enabled Version
Full database integration with user authentication and quote persistence
Updated: 2025-08-28 01:55 UTC - Force redeploy
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
    app.config.from_mapping(
        SECRET_KEY=os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production'),
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
            db_path = os.path.join(app.instance_path, 'tradesmate-local.db')
            os.makedirs(app.instance_path, exist_ok=True)
            app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
            log.info(f"Using local SQLite database at {db_path}")
    else:
        app.config.from_mapping(test_config)
        log.info("Test configuration loaded.")

    # --- Database Initialization ---
    try:
        from .database import db
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
        """Root route for Railway healthcheck"""
        return jsonify({
            'message': 'TradesMate API is running (database version)',
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat()
        })

    # --- Health Check Route (Essential for deployment) ---
    @app.route('/health')
    def health_check():
        db_status = "disconnected"
        try:
            from .database import db
            from sqlalchemy import text
            db.session.execute(text('SELECT 1'))
            db_status = "connected"
            log.info("Health check: Database connection successful.")
        except Exception as e:
            db_status = f"error: {e}"
            log.error(f"Health check: Database connection failed. Error: {e}")

        return jsonify({
            'status': 'healthy',
            'message': 'TradesMate API is running (database version)',
            'timestamp': datetime.utcnow().isoformat(),
            'database': db_status
        })

    # --- Register Blueprints and Create Tables ---
    with app.app_context():
        try:
            from .database import db
            from .routes import auth, quotes # Assuming you have __init__.py in routes
            
            # Import models to ensure they are registered with SQLAlchemy
            from .models import User, Quote

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
