"""
Voice API routes for TradesMate
"""

from flask import Blueprint, request, jsonify
from services.voice_service import VoiceService
from services.ai_service import AIService
from models.user import User

voice_bp = Blueprint('voice', __name__)
voice_service = VoiceService()
ai_service = AIService()

@voice_bp.route('/transcribe', methods=['POST'])
def transcribe_audio():
    """Transcribe uploaded audio file"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        if audio_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not voice_service.is_allowed_file(audio_file.filename):
            return jsonify({
                'error': f'File type not supported. Allowed formats: {", ".join(voice_service.allowed_extensions)}'
            }), 400
        
        # Analyze audio quality
        quality_result = voice_service.analyze_audio_quality(audio_file)
        
        # Transcribe audio
        transcription_result = voice_service.transcribe_audio(audio_file)
        
        if not transcription_result['success']:
            return jsonify({
                'error': transcription_result['error']
            }), 500
        
        return jsonify({
            'success': True,
            'transcript': transcription_result['text'],
            'language': transcription_result.get('language', 'en'),
            'duration': transcription_result.get('duration'),
            'quality_analysis': quality_result,
            'word_count': len(transcription_result['text'].split()) if transcription_result['text'] else 0
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voice_bp.route('/voice-to-quote', methods=['POST'])
def voice_to_quote():
    """Process audio file and generate quote"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        if not voice_service.is_allowed_file(audio_file.filename):
            return jsonify({
                'error': f'File type not supported. Allowed formats: {", ".join(voice_service.allowed_extensions)}'
            }), 400
        
        # Get user info
        user = User.query.first()  # Demo: get first user
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Transcribe audio
        transcription_result = voice_service.transcribe_audio(audio_file)
        
        if not transcription_result['success']:
            return jsonify({
                'error': f'Transcription failed: {transcription_result["error"]}'
            }), 500
        
        transcript = transcription_result['text']
        
        if not transcript or len(transcript.strip()) < 10:
            return jsonify({
                'error': 'Transcript too short or empty. Please record a longer description.'
            }), 400
        
        # Generate quote using AI
        ai_result = ai_service.generate_quote_from_transcript(
            transcript,
            user.trade_type,
            user.hourly_rate
        )
        
        if not ai_result['success']:
            return jsonify({
                'error': f'Quote generation failed: {ai_result["error"]}'
            }), 500
        
        return jsonify({
            'success': True,
            'transcript': transcript,
            'transcription_metadata': {
                'language': transcription_result.get('language', 'en'),
                'duration': transcription_result.get('duration'),
                'word_count': len(transcript.split())
            },
            'quote_data': ai_result['quote_data'],
            'ai_confidence': ai_result['quote_data'].get('confidence', 0.8)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voice_bp.route('/analyze-quality', methods=['POST'])
def analyze_audio_quality():
    """Analyze audio file quality"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        quality_result = voice_service.analyze_audio_quality(audio_file)
        
        return jsonify(quality_result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voice_bp.route('/supported-formats', methods=['GET'])
def get_supported_formats():
    """Get supported audio formats and recommendations"""
    try:
        return jsonify(voice_service.get_supported_formats())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voice_bp.route('/test-transcript', methods=['POST'])
def test_transcript():
    """Test quote generation with sample transcript (for development)"""
    try:
        data = request.get_json()
        
        if not data or 'transcript' not in data:
            return jsonify({'error': 'Transcript is required'}), 400
        
        transcript = data['transcript']
        user = User.query.first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Generate quote using AI
        ai_result = ai_service.generate_quote_from_transcript(
            transcript,
            user.trade_type,
            user.hourly_rate
        )
        
        return jsonify(ai_result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

