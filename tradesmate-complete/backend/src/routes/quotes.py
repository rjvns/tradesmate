"""
Quote management routes for TradesMate
"""
from flask import Blueprint, request, jsonify, session
from datetime import datetime, timedelta
from ..database import db
from ..models.quote import Quote
from ..services.ai_service import AIService

quotes_bp = Blueprint('quotes', __name__, url_prefix='/api/quotes')

@quotes_bp.route('/', methods=['GET'])
def get_quotes():
    """Get all quotes for authenticated user"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    quotes = Quote.query.filter_by(user_id=user_id).order_by(Quote.created_at.desc()).all()
    return jsonify([quote.to_dict() for quote in quotes])

@quotes_bp.route('/create', methods=['POST'])
def create_quote():
    """Create a new quote"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401

    try:
        data = request.get_json()
        ai_service = AIService()
        
        # Simple validation
        if not data.get('customer_name') or not data.get('job_description'):
            return jsonify({'error': 'Customer name and job description are required'}), 400
        
        # Calculate totals
        labour_hours = float(data.get('labour_hours', 0))
        labour_rate = float(data.get('labour_rate', 35))
        materials_cost = float(data.get('materials_cost', 0))
        
        labour_cost = labour_hours * labour_rate
        subtotal = labour_cost + materials_cost
        vat_amount = subtotal * 0.20  # 20% VAT
        total_amount = subtotal + vat_amount
        
        quote = Quote(
            user_id=user_id,
            customer_name=data.get('customer_name'),
            job_description=data.get('job_description'),
            labour_hours=labour_hours,
            labour_rate=labour_rate,
            materials_cost=materials_cost,
            total_amount=round(total_amount, 2),
            quote_number=ai_service.generate_quote_number(),
            valid_until=datetime.utcnow() + timedelta(days=30)
        )
        
        db.session.add(quote)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Quote created successfully',
            'quote': quote.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

