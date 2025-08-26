"""
Photo AI routes for TradesMate
"""

from flask import Blueprint, request, jsonify
from services.photo_intelligence_service import PhotoIntelligenceService
from services.ai_service import AIService
from models.user import User

photo_bp = Blueprint('photo', __name__)
photo_service = PhotoIntelligenceService()
ai_service = AIService()

@photo_bp.route('/analyze-note', methods=['POST'])
def analyze_handwritten_note():
    """Analyze handwritten note from photo"""
    try:
        if 'photo' not in request.files:
            return jsonify({'error': 'No photo file provided'}), 400
        
        photo_file = request.files['photo']
        
        if photo_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Extract text from photo
        extraction_result = photo_service.extract_text_from_image(photo_file)
        
        if not extraction_result['success']:
            return jsonify({
                'error': f'Text extraction failed: {extraction_result["error"]}'
            }), 500
        
        extracted_text = extraction_result['text']
        
        if not extracted_text or len(extracted_text.strip()) < 5:
            return jsonify({
                'error': 'No readable text found in image. Please ensure the photo is clear and contains handwritten text.'
            }), 400
        
        # Get user info
        user = User.query.first()  # Demo: get first user
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Generate quote using AI
        ai_result = ai_service.analyze_photo_text(
            extracted_text,
            user.trade_type,
            user.hourly_rate
        )
        
        if not ai_result['success']:
            return jsonify({
                'error': f'Quote generation failed: {ai_result["error"]}'
            }), 500
        
        return jsonify({
            'success': True,
            'extracted_text': extracted_text,
            'extraction_confidence': extraction_result.get('confidence', 0.8),
            'quote_data': ai_result['quote_data'],
            'ai_confidence': ai_result['quote_data'].get('confidence', 0.8)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@photo_bp.route('/create-quote-from-photo', methods=['POST'])
def create_quote_from_photo():
    """Create quote directly from photo analysis"""
    try:
        if 'photo' not in request.files:
            return jsonify({'error': 'No photo file provided'}), 400
        
        photo_file = request.files['photo']
        
        # This would be similar to analyze-note but also save to database
        # For now, redirect to analyze-note
        return analyze_handwritten_note()
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@photo_bp.route('/analyze-receipt', methods=['POST'])
def analyze_receipt():
    """Analyze receipt or invoice photo"""
    try:
        return jsonify({
            'error': 'Receipt analysis feature coming soon'
        }), 501
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@photo_bp.route('/analyze-job-sheet', methods=['POST'])
def analyze_job_sheet():
    """Analyze job sheet photo"""
    try:
        return jsonify({
            'error': 'Job sheet analysis feature coming soon'
        }), 501
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

