"""
Quotes API routes for TradesMate
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from main import db
from models.user import User
from models.quote import Quote, Job
from services.ai_service import AIService

quotes_bp = Blueprint('quotes', __name__)
ai_service = AIService()

@quotes_bp.route('/', methods=['GET'])
def get_quotes():
    """Get all quotes for the user"""
    try:
        user = User.query.first()  # Demo: get first user
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        quotes = Quote.query.filter_by(user_id=user.id).order_by(Quote.created_at.desc()).all()
        
        return jsonify({
            'quotes': [quote.to_dict() for quote in quotes]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quotes_bp.route('/<int:quote_id>', methods=['GET'])
def get_quote(quote_id):
    """Get a specific quote"""
    try:
        quote = Quote.query.get_or_404(quote_id)
        return jsonify(quote.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quotes_bp.route('/voice-to-quote', methods=['POST'])
def voice_to_quote():
    """Create a quote from voice transcript"""
    try:
        data = request.get_json()
        
        if not data or 'transcript' not in data:
            return jsonify({'error': 'Voice transcript is required'}), 400
        
        transcript = data['transcript']
        user = User.query.first()  # Demo: get first user
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Generate quote using AI
        ai_result = ai_service.generate_quote_from_transcript(
            transcript, 
            user.trade_type, 
            user.hourly_rate
        )
        
        if not ai_result['success']:
            return jsonify({'error': ai_result['error']}), 500
        
        quote_data = ai_result['quote_data']
        
        # Create quote in database
        quote = Quote(
            user_id=user.id,
            customer_name=quote_data['customer_name'],
            customer_phone=quote_data.get('customer_phone'),
            customer_address=quote_data.get('customer_address'),
            job_description=quote_data['job_description'],
            job_type=quote_data['job_type'],
            urgency=quote_data['urgency'],
            labour_hours=quote_data['labour_hours'],
            labour_rate=quote_data['labour_rate'],
            materials_cost=quote_data['materials_cost'],
            subtotal=quote_data['subtotal'],
            vat_amount=quote_data['vat_amount'],
            total_amount=quote_data['total_amount'],
            materials=str(quote_data.get('materials', [])),
            voice_transcript=transcript,
            ai_confidence=quote_data.get('confidence', 0.8),
            quote_number=ai_service.generate_quote_number(),
            valid_until=datetime.utcnow() + timedelta(days=30)
        )
        
        db.session.add(quote)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'quote': quote.to_dict(),
            'ai_suggestions': {
                'scheduling_suggestion': quote_data.get('scheduling_suggestion'),
                'notes': quote_data.get('notes')
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@quotes_bp.route('/<int:quote_id>/send', methods=['POST'])
def send_quote(quote_id):
    """Send quote to customer"""
    try:
        quote = Quote.query.get_or_404(quote_id)
        
        # Update quote status
        quote.status = 'sent'
        quote.sent_at = datetime.utcnow()
        
        db.session.commit()
        
        # TODO: Implement actual email/SMS sending
        
        return jsonify({
            'success': True,
            'message': 'Quote sent successfully',
            'quote': quote.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@quotes_bp.route('/<int:quote_id>/accept', methods=['POST'])
def accept_quote(quote_id):
    """Accept a quote and create a job"""
    try:
        quote = Quote.query.get_or_404(quote_id)
        
        # Update quote status
        quote.status = 'accepted'
        quote.accepted_at = datetime.utcnow()
        
        # Create a job from the accepted quote
        job = Job(
            user_id=quote.user_id,
            quote_id=quote.id,
            customer_name=quote.customer_name,
            customer_phone=quote.customer_phone,
            customer_address=quote.customer_address,
            job_description=quote.job_description,
            estimated_duration=quote.labour_hours,
            status='scheduled'
        )
        
        db.session.add(job)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Quote accepted and job created',
            'quote': quote.to_dict(),
            'job': job.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@quotes_bp.route('/<int:quote_id>', methods=['PUT'])
def update_quote(quote_id):
    """Update a quote"""
    try:
        quote = Quote.query.get_or_404(quote_id)
        data = request.get_json()
        
        # Update allowed fields
        updatable_fields = [
            'customer_name', 'customer_email', 'customer_phone', 'customer_address',
            'job_description', 'labour_hours', 'labour_rate', 'materials_cost'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(quote, field, data[field])
        
        # Recalculate totals if pricing changed
        if any(field in data for field in ['labour_hours', 'labour_rate', 'materials_cost']):
            labour_cost = quote.labour_hours * quote.labour_rate
            subtotal = labour_cost + quote.materials_cost
            vat_amount = subtotal * quote.vat_rate
            total_amount = subtotal + vat_amount
            
            quote.subtotal = round(subtotal, 2)
            quote.vat_amount = round(vat_amount, 2)
            quote.total_amount = round(total_amount, 2)
        
        quote.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'quote': quote.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@quotes_bp.route('/<int:quote_id>', methods=['DELETE'])
def delete_quote(quote_id):
    """Delete a quote"""
    try:
        quote = Quote.query.get_or_404(quote_id)
        
        # Check if quote can be deleted (not accepted)
        if quote.status == 'accepted':
            return jsonify({'error': 'Cannot delete accepted quote'}), 400
        
        db.session.delete(quote)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Quote deleted successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

