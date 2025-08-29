"""
Photo Intelligence Service for TradesMate
Handles OCR and image analysis for handwritten notes
"""

import os
import tempfile
# For demo purposes, we'll comment out complex dependencies
# from PIL import Image
# import pytesseract

class PhotoIntelligenceService:
    """Service for photo analysis and text extraction"""
    
    def __init__(self):
        # Configure Tesseract (you may need to adjust the path)
        # self.tesseract_cmd = os.getenv('TESSERACT_CMD', '/usr/bin/tesseract')
        pass
    
    def extract_text_from_image(self, image_file):
        """
        Extract text from image using OCR
        
        Args:
            image_file: File object or file path
            
        Returns:
            dict: Extraction result with text and confidence
        """
        try:
            # For demo purposes, return mock data since Tesseract setup is complex
            # In production, you would use proper OCR
            
            return {
                'success': True,
                'text': 'Kitchen tap replacement for Mrs. Johnson, 123 Main St. Materials needed: new tap, washers, sealant. Estimated 2 hours work. Customer phone: 07700 900123',
                'confidence': 0.85,
                'method': 'demo_ocr'
            }
            
            # Production implementation would use Tesseract OCR
            # See documentation for setup instructions
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Text extraction failed: {str(e)}'
            }
    
    def preprocess_image(self, image_file):
        """
        Preprocess image for better OCR results
        
        Args:
            image_file: PIL Image object
            
        Returns:
            PIL Image: Preprocessed image
        """
        try:
            # Convert to grayscale
            if image_file.mode != 'L':
                image_file = image_file.convert('L')
            
            # Apply filters to improve OCR accuracy
            # This would include noise reduction, contrast enhancement, etc.
            
            return image_file
            
        except Exception as e:
            raise Exception(f'Image preprocessing failed: {str(e)}')
    
    def is_allowed_image_file(self, filename):
        """Check if image file extension is allowed"""
        if not filename:
            return False
        
        allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff']
        extension = filename.rsplit('.', 1)[-1].lower()
        return extension in allowed_extensions
    
    def analyze_image_quality(self, image_file):
        """
        Analyze image quality for OCR suitability
        
        Args:
            image_file: File object
            
        Returns:
            dict: Quality analysis results
        """
        try:
            # For demo purposes
            return {
                'success': True,
                'quality_score': 0.8,
                'quality_level': 'Good',
                'recommendations': [
                    'Image quality is suitable for text extraction',
                    'Consider taking photo in better lighting for improved accuracy'
                ]
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Quality analysis failed: {str(e)}'
            }
