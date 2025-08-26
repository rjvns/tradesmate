#!/usr/bin/env python3
"""
Production seed script for TradesMate
Run this after deploying to Railway to populate initial data
"""

import os
import sys
from datetime import datetime, timedelta
import random

# Add the src directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.main import app
from src.database import db
from src.models.user import User
from src.models.quote import Quote

def create_production_seed_data():
    """Create initial production data"""
    with app.app_context():
        # Check if we already have data
        existing_users = User.query.count()
        if existing_users > 0:
            print("✅ Production data already exists!")
            return

        print("🌱 Creating production seed data...")

        # Create demo user
        user = User(
            name="Demo Tradesperson",
            email="demo@tradesmate.co.uk",
            phone="07700 900123",
            trade_type="Electrician",
            hourly_rate=45.0,
            company_name="Demo Electrical Services",
            address="123 Demo Street, London, SW1A 1AA",
            vat_number="GB123456789"
        )
        db.session.add(user)
        db.session.commit()

        # Create sample quotes
        customers = [
            "Mrs. Johnson", "Mr. Smith", "Ms. Williams", "Mr. Brown", 
            "Mrs. Davis", "Mr. Wilson", "Ms. Taylor", "Mr. Anderson",
            "Mrs. Thomas", "Mr. Jackson"
        ]

        job_types = [
            "Kitchen electrical work", "Bathroom lighting", "Socket installation",
            "Consumer unit upgrade", "Emergency lighting", "Security system",
            "Smart home installation", "EV charger installation", "Solar panel wiring",
            "Fuse box replacement"
        ]

        statuses = ["draft", "sent", "accepted", "completed", "cancelled"]

        for i in range(10):
            # Create quote with realistic data
            customer = random.choice(customers)
            job_type = random.choice(job_types)
            status = random.choice(statuses)
            
            # Generate realistic pricing
            labour_hours = random.uniform(2, 8)
            hourly_rate = 45.0
            materials_cost = random.uniform(20, 200)
            labour_cost = labour_hours * hourly_rate
            subtotal = labour_cost + materials_cost
            vat_amount = subtotal * 0.20  # 20% VAT
            total_amount = subtotal + vat_amount

            # Generate quote number
            quote_number = f"TM-{datetime.now().strftime('%Y%m%d')}-{i+1:04d}"

            quote = Quote(
                user_id=user.id,
                customer_name=customer,
                customer_email=f"{customer.lower().replace(' ', '.')}@example.com",
                customer_phone=f"07{random.randint(100, 999)} {random.randint(100000, 999999)}",
                job_description=job_type,
                labour_hours=labour_hours,
                hourly_rate=hourly_rate,
                materials_cost=materials_cost,
                labour_cost=labour_cost,
                subtotal=subtotal,
                vat_amount=vat_amount,
                total_amount=total_amount,
                status=status,
                quote_number=quote_number,
                created_at=datetime.now() - timedelta(days=random.randint(0, 30))
            )
            db.session.add(quote)

        db.session.commit()
        print(f"✅ Created {len(customers)} sample quotes for production!")

if __name__ == "__main__":
    create_production_seed_data()
