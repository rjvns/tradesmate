"""
Quote, Job, and Invoice models for TradesMate
"""

from datetime import datetime, timedelta
try:
    from ..database import db
except ImportError:
    from database import db

class Quote(db.Model):
    """Quote model for customer quotes"""
    
    __tablename__ = 'quotes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Customer information
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(120), nullable=True)
    customer_phone = db.Column(db.String(20), nullable=True)
    customer_address = db.Column(db.Text, nullable=True)
    
    # Job details
    job_description = db.Column(db.Text, nullable=False)
    job_type = db.Column(db.String(50), nullable=False)  # Kitchen, Bathroom, Emergency, etc.
    urgency = db.Column(db.String(20), default='normal')  # emergency, urgent, normal
    
    # Pricing
    labour_hours = db.Column(db.Float, nullable=False)
    labour_rate = db.Column(db.Float, nullable=False)
    materials_cost = db.Column(db.Float, default=0.0)
    subtotal = db.Column(db.Float, nullable=False)
    vat_rate = db.Column(db.Float, default=0.20)  # 20% UK VAT
    vat_amount = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    
    # Materials list (JSON string)
    materials = db.Column(db.Text, nullable=True)  # JSON array of materials
    
    # Status and workflow
    status = db.Column(db.String(20), default='draft')  # draft, sent, accepted, rejected
    quote_number = db.Column(db.String(20), unique=True, nullable=False)
    valid_until = db.Column(db.DateTime, nullable=True)
    
    # AI processing metadata
    voice_transcript = db.Column(db.Text, nullable=True)
    ai_confidence = db.Column(db.Float, nullable=True)
    processing_notes = db.Column(db.Text, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    sent_at = db.Column(db.DateTime, nullable=True)
    accepted_at = db.Column(db.DateTime, nullable=True)
    
    def __repr__(self):
        return f'<Quote {self.quote_number} - {self.customer_name}>'
    
    def to_dict(self):
        """Convert quote to dictionary"""
        return {
            'id': self.id,
            'quote_number': self.quote_number,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'customer_address': self.customer_address,
            'job_description': self.job_description,
            'job_type': self.job_type,
            'urgency': self.urgency,
            'labour_hours': self.labour_hours,
            'labour_rate': self.labour_rate,
            'materials_cost': self.materials_cost,
            'subtotal': self.subtotal,
            'vat_rate': self.vat_rate,
            'vat_amount': self.vat_amount,
            'total_amount': self.total_amount,
            'materials': self.materials,
            'status': self.status,
            'valid_until': self.valid_until.isoformat() if self.valid_until else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'accepted_at': self.accepted_at.isoformat() if self.accepted_at else None
        }

class Job(db.Model):
    """Job model for scheduled work"""
    
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quote_id = db.Column(db.Integer, db.ForeignKey('quotes.id'), nullable=True)
    
    # Customer information
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=True)
    customer_address = db.Column(db.Text, nullable=True)
    
    # Job details
    job_description = db.Column(db.Text, nullable=False)
    estimated_duration = db.Column(db.Float, nullable=True)  # hours
    
    # Scheduling
    scheduled_date = db.Column(db.DateTime, nullable=True)
    completed_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='scheduled')  # scheduled, in_progress, completed, cancelled
    
    # Calendar integration
    calendar_event_id = db.Column(db.String(100), nullable=True)
    
    # Notes
    notes = db.Column(db.Text, nullable=True)
    completion_notes = db.Column(db.Text, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Job {self.id} - {self.customer_name}>'
    
    def to_dict(self):
        """Convert job to dictionary"""
        return {
            'id': self.id,
            'quote_id': self.quote_id,
            'customer_name': self.customer_name,
            'customer_phone': self.customer_phone,
            'customer_address': self.customer_address,
            'job_description': self.job_description,
            'estimated_duration': self.estimated_duration,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'completed_date': self.completed_date.isoformat() if self.completed_date else None,
            'status': self.status,
            'calendar_event_id': self.calendar_event_id,
            'notes': self.notes,
            'completion_notes': self.completion_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Invoice(db.Model):
    """Invoice model for billing"""
    
    __tablename__ = 'invoices'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quote_id = db.Column(db.Integer, db.ForeignKey('quotes.id'), nullable=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=True)
    
    # Invoice details
    invoice_number = db.Column(db.String(20), unique=True, nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(120), nullable=True)
    customer_address = db.Column(db.Text, nullable=True)
    
    # Financial details
    subtotal = db.Column(db.Float, nullable=False)
    vat_amount = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    
    # Payment
    status = db.Column(db.String(20), default='pending')  # pending, paid, overdue, cancelled
    due_date = db.Column(db.DateTime, nullable=True)
    paid_date = db.Column(db.DateTime, nullable=True)
    payment_method = db.Column(db.String(50), nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Invoice {self.invoice_number} - {self.customer_name}>'
    
    def to_dict(self):
        """Convert invoice to dictionary"""
        return {
            'id': self.id,
            'invoice_number': self.invoice_number,
            'quote_id': self.quote_id,
            'job_id': self.job_id,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_address': self.customer_address,
            'subtotal': self.subtotal,
            'vat_amount': self.vat_amount,
            'total_amount': self.total_amount,
            'status': self.status,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'paid_date': self.paid_date.isoformat() if self.paid_date else None,
            'payment_method': self.payment_method,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

