"""
User model for TradesMate application
"""

from datetime import datetime
from main import db

class User(db.Model):
    """User model for tradespeople"""
    
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    trade_type = db.Column(db.String(50), nullable=False)  # Electrician, Plumber, etc.
    company_name = db.Column(db.String(100), nullable=True)
    address = db.Column(db.Text, nullable=True)
    vat_number = db.Column(db.String(20), nullable=True)
    hourly_rate = db.Column(db.Float, default=45.0)  # Default UK trade rate
    
    # Google Calendar integration
    google_calendar_token = db.Column(db.Text, nullable=True)
    google_calendar_refresh_token = db.Column(db.Text, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    quotes = db.relationship('Quote', backref='user', lazy=True, cascade='all, delete-orphan')
    jobs = db.relationship('Job', backref='user', lazy=True, cascade='all, delete-orphan')
    invoices = db.relationship('Invoice', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.name} ({self.trade_type})>'
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'trade_type': self.trade_type,
            'company_name': self.company_name,
            'address': self.address,
            'vat_number': self.vat_number,
            'hourly_rate': self.hourly_rate,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

