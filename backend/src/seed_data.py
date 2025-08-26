"""
Seed data for TradesMate demo
"""

from database import db
from models.user import User
from models.quote import Quote
from datetime import datetime, timedelta
import json

def create_seed_data():
    """Create sample data for demo purposes"""
    
    # Force recreate for demo
    print("Creating fresh database with 10 dummy quotes...")
    
    # Get or create demo user
    user = User.query.first()
    if not user:
        user = User(
            email='demo@tradesmate.co.uk',
            name='John Smith',
            company_name='Smith Electrical Services',
            trade_type='electrician',
            phone='07700 900123',
            hourly_rate=45.00,
            vat_number='GB123456789',
            address='123 Demo Street, London SW1A 1AA'
        )
        db.session.add(user)
        db.session.commit()
    
    # Create sample quotes
    quotes = [
        {
            'customer_name': 'Sarah Johnson',
            'customer_email': 'sarah.j@email.com',
            'customer_phone': '07777 123456',
            'customer_address': '45 Oak Avenue, Manchester M1 2AB',
            'job_description': 'Kitchen rewiring and new consumer unit installation',
            'job_type': 'electrical',
            'urgency': 'normal',
            'labour_hours': 16.0,
            'labour_rate': 45.0,
            'materials_cost': 350.0,
            'status': 'sent',
            'created_at': datetime.utcnow() - timedelta(days=2)
        },
        {
            'customer_name': 'Mike Wilson',
            'customer_email': 'mike.wilson@company.com',
            'customer_phone': '07888 999000',
            'customer_address': '78 Business Park, Birmingham B2 4QG',
            'job_description': 'Office lighting upgrade to LED panels',
            'job_type': 'electrical',
            'urgency': 'low',
            'labour_hours': 12.0,
            'labour_rate': 45.0,
            'materials_cost': 450.0,
            'status': 'accepted',
            'created_at': datetime.utcnow() - timedelta(days=5)
        },
        {
            'customer_name': 'Emma Davis',
            'customer_email': 'emma@homeowner.co.uk',
            'customer_phone': '07555 444333',
            'customer_address': '12 Garden Close, Bristol BS1 6TH',
            'job_description': 'Electric vehicle charging point installation',
            'job_type': 'electrical',
            'urgency': 'high',
            'labour_hours': 6.0,
            'labour_rate': 45.0,
            'materials_cost': 550.0,
            'status': 'draft',
            'created_at': datetime.utcnow() - timedelta(days=1)
        },
        {
            'customer_name': 'David Brown',
            'customer_email': 'david.brown@email.com',
            'customer_phone': '07333 222111',
            'customer_address': '67 Victoria Road, Leeds LS1 3QR',
            'job_description': 'Complete house rewire',
            'job_type': 'electrical',
            'urgency': 'normal',
            'labour_hours': 40.0,
            'labour_rate': 45.0,
            'materials_cost': 1200.0,
            'status': 'sent',
            'created_at': datetime.utcnow() - timedelta(days=7),
            'valid_until': datetime.utcnow() - timedelta(days=2)  # Expired
        },
        {
            'customer_name': 'Lisa Thompson',
            'customer_email': 'lisa.thompson@email.com',
            'customer_phone': '07111 222333',
            'customer_address': '90 Church Lane, York YO1 8QR',
            'job_description': 'Bathroom extractor fan and additional sockets',
            'job_type': 'electrical',
            'urgency': 'normal',
            'labour_hours': 4.0,
            'labour_rate': 45.0,
            'materials_cost': 120.0,
            'status': 'draft',
            'created_at': datetime.utcnow()
        },
        {
            'customer_name': 'James Anderson',
            'customer_email': 'james.anderson@email.com',
            'customer_phone': '07666 777888',
            'customer_address': '23 Park Lane, London SW1A 1AA',
            'job_description': 'Smart home automation system installation',
            'job_type': 'electrical',
            'urgency': 'high',
            'labour_hours': 20.0,
            'labour_rate': 50.0,
            'materials_cost': 1500.0,
            'status': 'draft',
            'created_at': datetime.utcnow() - timedelta(days=3)
        },
        {
            'customer_name': 'Rachel Green',
            'customer_email': 'rachel@green.co.uk',
            'customer_phone': '07444 555666',
            'customer_address': '89 Church Street, Edinburgh EH1 1RE',
            'job_description': 'Emergency electrical repairs and safety checks',
            'job_type': 'electrical',
            'urgency': 'urgent',
            'labour_hours': 3.0,
            'labour_rate': 60.0,
            'materials_cost': 200.0,
            'status': 'sent',
            'created_at': datetime.utcnow() - timedelta(hours=6)
        },
        {
            'customer_name': 'Tom Brown',
            'customer_email': 'tom.brown@email.com',
            'customer_phone': '07222 333444',
            'customer_address': '34 Queen Street, Cardiff CF10 1AA',
            'job_description': 'Commercial kitchen electrical upgrade',
            'job_type': 'electrical',
            'urgency': 'normal',
            'labour_hours': 25.0,
            'labour_rate': 45.0,
            'materials_cost': 1800.0,
            'status': 'accepted',
            'created_at': datetime.utcnow() - timedelta(days=10)
        },
        {
            'customer_name': 'Sophie White',
            'customer_email': 'sophie@white.com',
            'customer_phone': '07111 222333',
            'customer_address': '56 Market Square, Belfast BT1 1AA',
            'job_description': 'Garden lighting and outdoor electrical work',
            'job_type': 'electrical',
            'urgency': 'low',
            'labour_hours': 8.0,
            'labour_rate': 45.0,
            'materials_cost': 400.0,
            'status': 'draft',
            'created_at': datetime.utcnow() - timedelta(days=4)
        },
        {
            'customer_name': 'Alex Turner',
            'customer_email': 'alex.turner@email.com',
            'customer_phone': '07000 111222',
            'customer_address': '78 Riverside Drive, Glasgow G1 1AA',
            'job_description': 'Industrial workshop electrical installation',
            'job_type': 'electrical',
            'urgency': 'normal',
            'labour_hours': 35.0,
            'labour_rate': 50.0,
            'materials_cost': 2500.0,
            'status': 'sent',
            'created_at': datetime.utcnow() - timedelta(days=8)
        }
    ]
    
    for quote_data in quotes:
        # Calculate totals
        labour_cost = quote_data['labour_hours'] * quote_data['labour_rate']
        subtotal = labour_cost + quote_data['materials_cost']
        vat_amount = subtotal * 0.20  # 20% VAT
        total_amount = subtotal + vat_amount
        
        quote = Quote(
            user_id=user.id,
            customer_name=quote_data['customer_name'],
            customer_email=quote_data['customer_email'],
            customer_phone=quote_data['customer_phone'],
            customer_address=quote_data['customer_address'],
            job_description=quote_data['job_description'],
            job_type=quote_data['job_type'],
            urgency=quote_data['urgency'],
            labour_hours=quote_data['labour_hours'],
            labour_rate=quote_data['labour_rate'],
            materials_cost=quote_data['materials_cost'],
            subtotal=round(subtotal, 2),
            vat_amount=round(vat_amount, 2),
            total_amount=round(total_amount, 2),
            status=quote_data['status'],
            quote_number=f"QT{1000 + len(db.session.query(Quote).all()) + 1}",
            valid_until=quote_data.get('valid_until', datetime.utcnow() + timedelta(days=30)),
            created_at=quote_data['created_at']
        )
        
        db.session.add(quote)
    
    db.session.commit()
    print(f"Created {len(quotes)} sample quotes for demo user")

if __name__ == '__main__':
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    
    from main import app
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        create_seed_data()
