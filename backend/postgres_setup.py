#!/usr/bin/env python3
"""
PostgreSQL Setup and Verification Script for TradesMate
This script ensures PostgreSQL is properly connected and all data is being saved.
"""

import os
import sys
import logging
from pathlib import Path
import json
from datetime import datetime, timedelta

# Add the backend src directory to Python path
backend_dir = Path(__file__).parent
src_dir = backend_dir / 'src'
sys.path.insert(0, str(src_dir))

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
log = logging.getLogger(__name__)

def check_postgres_connection():
    """Test PostgreSQL connection and configuration"""
    try:
        from main import create_app
        from database import db
        from sqlalchemy import text, inspect
        
        app = create_app()
        
        with app.app_context():
            # Check database URL
            db_url = app.config.get('SQLALCHEMY_DATABASE_URI', 'Not configured')
            
            if 'postgresql' not in db_url.lower():
                log.error("❌ DATABASE_URL is not PostgreSQL!")
                log.error(f"Current: {db_url}")
                log.error("Expected: postgresql://user:pass@host:port/dbname")
                return False
            
            log.info(f"✅ PostgreSQL URL configured: {db_url[:50]}...")
            
            # Test connection
            result = db.session.execute(text('SELECT version()'))
            version = result.fetchone()[0]
            log.info(f"✅ PostgreSQL connection successful!")
            log.info(f"Database version: {version}")
            
            # Check tables exist
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            
            expected_tables = ['users', 'quotes', 'jobs', 'invoices']
            missing_tables = [t for t in expected_tables if t not in tables]
            
            if missing_tables:
                log.warning(f"⚠️  Missing tables: {missing_tables}")
                return False
            
            log.info(f"✅ All required tables exist: {tables}")
            
            # Check table structures
            for table in expected_tables:
                columns = [col['name'] for col in inspector.get_columns(table)]
                log.info(f"✅ Table '{table}' columns: {len(columns)} columns")
            
            return True
            
    except Exception as e:
        log.error(f"❌ PostgreSQL connection failed: {e}")
        return False

def test_quote_persistence():
    """Test that quote data is properly saved to PostgreSQL"""
    try:
        from main import create_app
        from database import db
        from models.user import User
        from models.quote import Quote
        from services.ai_service import AIService
        
        app = create_app()
        
        with app.app_context():
            log.info("🧪 Testing quote data persistence...")
            
            # Create or get test user
            test_user = User.query.filter_by(email='test@tradesmate.com').first()
            if not test_user:
                test_user = User(
                    name='Test User',
                    email='test@tradesmate.com',
                    trade_type='Plumber',
                    hourly_rate=45.0
                )
                test_user.set_password('testpass123')
                db.session.add(test_user)
                db.session.commit()
                log.info("✅ Created test user")
            else:
                log.info("✅ Using existing test user")
            
            # Create test quote
            ai_service = AIService()
            test_quote = Quote(
                user_id=test_user.id,
                customer_name='Test Customer',
                customer_email='customer@test.com',
                customer_phone='07123456789',
                customer_address='123 Test Street, London',
                job_description='Emergency pipe repair in kitchen',
                job_type='Emergency',
                urgency='urgent',
                labour_hours=3.0,
                labour_rate=45.0,
                materials_cost=85.50,
                subtotal=220.50,
                vat_rate=0.20,
                vat_amount=44.10,
                total_amount=264.60,
                materials='["Copper pipe", "Pipe fittings", "Sealant"]',
                quote_number=ai_service.generate_quote_number(),
                valid_until=datetime.utcnow() + timedelta(days=30),
                voice_transcript='Customer called about urgent pipe leak',
                ai_confidence=0.95,
                processing_notes='High confidence extraction from voice'
            )
            
            # Save to database
            db.session.add(test_quote)
            db.session.commit()
            
            # Verify it was saved
            saved_quote = Quote.query.filter_by(quote_number=test_quote.quote_number).first()
            if not saved_quote:
                log.error("❌ Quote was not saved to database!")
                return False
            
            log.info(f"✅ Quote saved successfully!")
            log.info(f"   Quote Number: {saved_quote.quote_number}")
            log.info(f"   Customer: {saved_quote.customer_name}")
            log.info(f"   Total: £{saved_quote.total_amount}")
            log.info(f"   Created: {saved_quote.created_at}")
            
            # Test quote retrieval
            all_quotes = Quote.query.filter_by(user_id=test_user.id).all()
            log.info(f"✅ Total quotes for user: {len(all_quotes)}")
            
            # Test quote update
            saved_quote.status = 'sent'
            saved_quote.sent_at = datetime.utcnow()
            db.session.commit()
            
            updated_quote = Quote.query.get(saved_quote.id)
            if updated_quote.status != 'sent':
                log.error("❌ Quote update failed!")
                return False
            
            log.info("✅ Quote update successful!")
            
            # Clean up test data (optional)
            # db.session.delete(saved_quote)
            # db.session.delete(test_user)
            # db.session.commit()
            # log.info("✅ Test data cleaned up")
            
            return True
            
    except Exception as e:
        log.error(f"❌ Quote persistence test failed: {e}")
        db.session.rollback()
        return False

def setup_postgres_tables():
    """Create all PostgreSQL tables"""
    try:
        from main import create_app
        from database import db
        from models.user import User
        from models.quote import Quote, Job, Invoice
        
        app = create_app()
        
        with app.app_context():
            log.info("🔧 Setting up PostgreSQL tables...")
            
            # Create all tables
            db.create_all()
            log.info("✅ All tables created successfully!")
            
            # Verify tables
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            
            log.info(f"✅ Tables in database: {tables}")
            
            return True
            
    except Exception as e:
        log.error(f"❌ Table setup failed: {e}")
        return False

def main():
    """Main setup and verification process"""
    print("=" * 60)
    print("🐘 TradesMate PostgreSQL Setup & Verification")
    print("=" * 60)
    
    # Check if DATABASE_URL is set
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL environment variable not set!")
        print("\nTo fix this:")
        print("1. Set DATABASE_URL in your environment")
        print("2. Example: export DATABASE_URL='postgresql://user:pass@host:port/dbname'")
        print("3. Or add it to your .env file")
        return False
    
    if 'postgresql' not in database_url.lower():
        print(f"❌ DATABASE_URL is not PostgreSQL: {database_url}")
        print("Expected format: postgresql://user:pass@host:port/dbname")
        return False
    
    print(f"✅ DATABASE_URL is set and looks correct")
    
    # Step 1: Test connection
    print("\n1️⃣ Testing PostgreSQL connection...")
    if not check_postgres_connection():
        print("❌ PostgreSQL connection failed!")
        return False
    
    # Step 2: Setup tables
    print("\n2️⃣ Setting up database tables...")
    if not setup_postgres_tables():
        print("❌ Table setup failed!")
        return False
    
    # Step 3: Test data persistence
    print("\n3️⃣ Testing quote data persistence...")
    if not test_quote_persistence():
        print("❌ Data persistence test failed!")
        return False
    
    print("\n" + "=" * 60)
    print("🎉 SUCCESS! PostgreSQL is properly configured!")
    print("✅ Database connection working")
    print("✅ All tables created")
    print("✅ Quote data persistence verified")
    print("✅ Your TradesMate app will save all data to PostgreSQL!")
    print("=" * 60)
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
