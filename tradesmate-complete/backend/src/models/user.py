"""
User model for TradesMate
"""

from datetime import datetime
from database import db

class User(db.Model):
    """User model for tradespeople"""
    
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    trade_type = db.Column(db.String(50), nullable=False, default='General')
    hourly_rate = db.Column(db.Float, nullable=False, default=35.0)
    company_name = db.Column(db.String(100))
    address = db.Column(db.Text)
    vat_number = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'trade_type': self.trade_type,
            'hourly_rate': self.hourly_rate,
            'company_name': self.company_name,
            'address': self.address,
            'vat_number': self.vat_number,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
