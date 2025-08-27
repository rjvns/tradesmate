"""
Quotes API routes for TradesMate
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from database import db
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

@quotes_bp.route('/<int:quote_id>/duplicate', methods=['POST'])
def duplicate_quote(quote_id):
    """Duplicate an existing quote"""
    try:
        original = Quote.query.get_or_404(quote_id)
        
        # Create a new quote based on the original
        new_quote = Quote(
            user_id=original.user_id,
            customer_name=original.customer_name,
            customer_email=original.customer_email,
            customer_phone=original.customer_phone,
            customer_address=original.customer_address,
            job_description=f"Copy of: {original.job_description}",
            job_type=original.job_type,
            urgency=original.urgency,
            labour_hours=original.labour_hours,
            labour_rate=original.labour_rate,
            materials_cost=original.materials_cost,
            subtotal=original.subtotal,
            vat_amount=original.vat_amount,
            total_amount=original.total_amount,
            materials=original.materials,
            status='draft',
            quote_number=ai_service.generate_quote_number(),
            valid_until=datetime.utcnow() + timedelta(days=30)
        )
        
        db.session.add(new_quote)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Quote duplicated successfully',
            'quote': new_quote.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@quotes_bp.route('/stats', methods=['GET'])
def get_quote_stats():
    """Get quote statistics"""
    try:
        user = User.query.first()  # Demo: get first user
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        total = Quote.query.filter_by(user_id=user.id).count()
        draft = Quote.query.filter_by(user_id=user.id, status='draft').count()
        sent = Quote.query.filter_by(user_id=user.id, status='sent').count()
        accepted = Quote.query.filter_by(user_id=user.id, status='accepted').count()
        
        # Calculate expired quotes
        expired = Quote.query.filter(
            Quote.user_id == user.id,
            Quote.valid_until < datetime.utcnow(),
            Quote.status != 'accepted'
        ).count()
        
        # Calculate total value
        total_value = db.session.query(db.func.sum(Quote.total_amount)).filter_by(user_id=user.id).scalar() or 0
        
        return jsonify({
            'total': total,
            'draft': draft,
            'sent': sent,
            'accepted': accepted,
            'expired': expired,
            'total_value': float(total_value)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quotes_bp.route('/create', methods=['POST'])
def create_quote():
    """Create a new quote manually"""
    try:
        data = request.get_json()
        user = User.query.first()  # Demo: get first user
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Calculate totals
        labour_cost = float(data.get('labour_hours', 0)) * float(data.get('labour_rate', user.hourly_rate))
        materials_cost = float(data.get('materials_cost', 0))
        subtotal = labour_cost + materials_cost
        vat_rate = 0.20  # 20% VAT
        vat_amount = subtotal * vat_rate
        total_amount = subtotal + vat_amount
        
        quote = Quote(
            user_id=user.id,
            customer_name=data.get('customer_name'),
            customer_email=data.get('customer_email'),
            customer_phone=data.get('customer_phone'),
            customer_address=data.get('customer_address'),
            job_description=data.get('job_description'),
            job_type=data.get('job_type', 'general'),
            urgency=data.get('urgency', 'normal'),
            labour_hours=float(data.get('labour_hours', 0)),
            labour_rate=float(data.get('labour_rate', user.hourly_rate)),
            materials_cost=materials_cost,
            subtotal=round(subtotal, 2),
            vat_amount=round(vat_amount, 2),
            total_amount=round(total_amount, 2),
            materials=str(data.get('materials', [])),
            status='draft',
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

