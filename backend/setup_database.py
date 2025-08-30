#!/usr/bin/env python3
"""
Database Setup Script for TradesMate
This script initializes the database and creates all necessary tables.
"""

import os
import sys
import logging
from pathlib import Path

# Add the backend src directory to Python path
backend_dir = Path(__file__).parent
src_dir = backend_dir / 'src'
sys.path.insert(0, str(src_dir))

# Configure logging
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

def setup_database():
    """Initialize database and create all tables"""
    try:
        # Import the Flask app factory
        from main import create_app
        from database import db
        from models.user import User
        from models.quote import Quote, Job, Invoice
        
        # Create the Flask app
        app = create_app()
        
        with app.app_context():
            log.info("Creating database tables...")
            
            # Drop all tables (for fresh start)
            # db.drop_all()
            # log.info("Dropped existing tables")
            
            # Create all tables
            db.create_all()
            log.info("Created all database tables successfully!")
            
            # Verify tables were created
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            log.info(f"Tables created: {tables}")
            
            return True
            
    except Exception as e:
        log.error(f"Database setup failed: {e}")
        return False

def check_database_connection():
    """Test database connection"""
    try:
        from main import create_app
        from database import db
        from sqlalchemy import text
        
        app = create_app()
        
        with app.app_context():
            # Test connection
            result = db.session.execute(text('SELECT 1'))
            log.info("Database connection successful!")
            
            # Show database info
            database_url = app.config.get('SQLALCHEMY_DATABASE_URI', 'Not configured')
            if 'sqlite' in database_url.lower():
                log.info(f"Using SQLite database: {database_url}")
            elif 'postgresql' in database_url.lower():
                log.info("Using PostgreSQL database")
            else:
                log.info(f"Database type: {database_url}")
                
            return True
            
    except Exception as e:
        log.error(f"Database connection failed: {e}")
        return False

if __name__ == '__main__':
    print("=" * 50)
    print("TradesMate Database Setup")
    print("=" * 50)
    
    # Check connection first
    print("\n1. Testing database connection...")
    if not check_database_connection():
        print("❌ Database connection failed!")
        print("\nTroubleshooting:")
        print("- For local development: Make sure SQLite path is accessible")
        print("- For production: Set DATABASE_URL environment variable")
        print("- Check your .env file or environment variables")
        sys.exit(1)
    
    print("✅ Database connection successful!")
    
    # Setup database
    print("\n2. Setting up database tables...")
    if setup_database():
        print("✅ Database setup completed successfully!")
        print("\nYour TradesMate database is ready to use!")
    else:
        print("❌ Database setup failed!")
        sys.exit(1)
