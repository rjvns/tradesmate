"""
Voice Service for TradesMate
Handles audio recording, transcription, and voice-to-quote processing
"""

import os
import tempfile
from openai import OpenAI
from werkzeug.utils import secure_filename

class VoiceService:
    """Service for voice recording and transcription"""
    
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv('OPENAI_API_KEY'),
            base_url=os.getenv('OPENAI_API_BASE')
        )
        self.allowed_extensions = os.getenv('ALLOWED_AUDIO_EXTENSIONS', 'mp3,wav,m4a,webm,ogg,flac').split(',')
        self.max_file_size = int(os.getenv('MAX_CONTENT_LENGTH', 26214400))  # 25MB
    
    def transcribe_audio(self, audio_file):
        """
        Transcribe audio file using OpenAI Whisper
        
        Args:
            audio_file: File object or file path
            
        Returns:
            dict: Transcription result with text and metadata
        """
        try:
            # If it's a file object, save it temporarily
            if hasattr(audio_file, 'read'):
                with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
                    audio_file.seek(0)
                    temp_file.write(audio_file.read())
                    temp_file_path = temp_file.name
                
                try:
                    with open(temp_file_path, 'rb') as audio_data:
                        transcript = self.client.audio.transcriptions.create(
                            model="whisper-1",
                            file=audio_data,
                            response_format="verbose_json",
                            language="en"
                        )
                finally:
                    # Clean up temporary file
                    os.unlink(temp_file_path)
            else:
                # If it's a file path
                with open(audio_file, 'rb') as audio_data:
                    transcript = self.client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_data,
                        response_format="verbose_json",
                        language="en"
                    )
            
            return {
                'success': True,
                'text': transcript.text,
                'language': getattr(transcript, 'language', 'en'),
                'duration': getattr(transcript, 'duration', None),
                'segments': getattr(transcript, 'segments', [])
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Transcription failed: {str(e)}'
            }
    
    def analyze_audio_quality(self, audio_file):
        """
        Analyze audio file quality and provide recommendations
        
        Args:
            audio_file: File object
            
        Returns:
            dict: Quality analysis results
        """
        try:
            # Get file size
            audio_file.seek(0, 2)  # Seek to end
            file_size = audio_file.tell()
            audio_file.seek(0)  # Reset to beginning
            
            # Basic quality checks
            quality_score = 1.0
            recommendations = []
            
            # Check file size
            if file_size > self.max_file_size:
                quality_score -= 0.3
                recommendations.append(f"File size ({file_size / 1024 / 1024:.1f}MB) exceeds recommended limit")
            elif file_size < 10000:  # Less than 10KB
                quality_score -= 0.4
                recommendations.append("File size is very small, audio may be too short or low quality")
            
            # Estimate duration based on file size (rough estimate)
            estimated_duration = file_size / 16000  # Rough estimate for compressed audio
            
            if estimated_duration < 1:
                quality_score -= 0.2
                recommendations.append("Recording appears very short (< 1 second)")
            elif estimated_duration > 300:  # 5 minutes
                quality_score -= 0.1
                recommendations.append("Recording is quite long, consider breaking into smaller segments")
            
            # Quality assessment
            if quality_score >= 0.8:
                quality_level = "Excellent"
            elif quality_score >= 0.6:
                quality_level = "Good"
            elif quality_score >= 0.4:
                quality_level = "Fair"
            else:
                quality_level = "Poor"
            
            return {
                'success': True,
                'quality_score': round(quality_score, 2),
                'quality_level': quality_level,
                'file_size': file_size,
                'estimated_duration': round(estimated_duration, 1),
                'recommendations': recommendations
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Quality analysis failed: {str(e)}'
            }
    
    def is_allowed_file(self, filename):
        """Check if file extension is allowed"""
        if not filename:
            return False
        
        extension = filename.rsplit('.', 1)[-1].lower()
        return extension in self.allowed_extensions
    
    def save_audio_file(self, audio_file, upload_folder='uploads/audio'):
        """
        Save uploaded audio file securely
        
        Args:
            audio_file: File object
            upload_folder: Directory to save file
            
        Returns:
            dict: Save result with file path
        """
        try:
            if not self.is_allowed_file(audio_file.filename):
                return {
                    'success': False,
                    'error': f'File type not allowed. Supported formats: {", ".join(self.allowed_extensions)}'
                }
            
            # Create upload directory if it doesn't exist
            os.makedirs(upload_folder, exist_ok=True)
            
            # Generate secure filename
            filename = secure_filename(audio_file.filename)
            timestamp = int(datetime.now().timestamp())
            filename = f"{timestamp}_{filename}"
            
            file_path = os.path.join(upload_folder, filename)
            
            # Save file
            audio_file.save(file_path)
            
            return {
                'success': True,
                'file_path': file_path,
                'filename': filename
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to save audio file: {str(e)}'
            }
    
    def get_supported_formats(self):
        """Get list of supported audio formats"""
        return {
            'formats': self.allowed_extensions,
            'max_file_size_mb': self.max_file_size / 1024 / 1024,
            'recommended_format': 'wav',
            'recommended_settings': {
                'sample_rate': '16kHz or higher',
                'bit_depth': '16-bit or higher',
                'channels': 'mono or stereo',
                'duration': '5 seconds to 5 minutes'
            }
        }

