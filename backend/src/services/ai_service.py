"""
AI Service for TradesMate
Handles OpenAI GPT-4 integration for quote generation
"""

import os
import json
import re
from datetime import datetime, timedelta
from openai import OpenAI

class AIService:
    """Service for AI-powered quote generation and analysis"""
    
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv('OPENAI_API_KEY'),
            base_url=os.getenv('OPENAI_API_BASE')
        )
    
    def generate_quote_from_transcript(self, transcript, user_trade_type="Electrician", hourly_rate=45.0):
        """
        Generate a professional quote from voice transcript
        
        Args:
            transcript (str): Voice transcript of job description
            user_trade_type (str): Type of trade (Electrician, Plumber, etc.)
            hourly_rate (float): User's hourly rate
            
        Returns:
            dict: Generated quote data
        """
        
        system_prompt = f"""You are an AI assistant helping UK {user_trade_type.lower()}s create professional quotes.

Analyze the voice transcript and extract:
1. Customer details (name, phone, address if mentioned)
2. Job description and type
3. Urgency level (emergency, urgent, normal)
4. Estimated labour hours
5. Required materials with UK pricing
6. Professional quote with 20% VAT

UK Trade Pricing Guidelines:
- Standard hourly rate: £{hourly_rate}
- Emergency callout: +50% rate
- Materials: Use realistic UK trade prices
- VAT: Always 20% on total
- Quote valid for 30 days

Respond with valid JSON only:
{{
    "customer_name": "string",
    "customer_phone": "string or null",
    "customer_address": "string or null", 
    "job_description": "detailed description",
    "job_type": "Kitchen/Bathroom/Emergency/Electrical/Plumbing/General",
    "urgency": "emergency/urgent/normal",
    "labour_hours": number,
    "labour_rate": number,
    "materials": [
        {{"item": "string", "quantity": number, "unit_price": number, "total": number}}
    ],
    "materials_cost": number,
    "subtotal": number,
    "vat_amount": number,
    "total_amount": number,
    "confidence": number (0-1),
    "scheduling_suggestion": "string",
    "notes": "any additional notes"
}}"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Voice transcript: {transcript}"}
                ],
                temperature=0.3,
                max_tokens=1500
            )
            
            # Parse the JSON response
            content = response.choices[0].message.content.strip()
            
            # Extract JSON from response (in case there's extra text)
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                content = json_match.group()
            
            quote_data = json.loads(content)
            
            # Validate and ensure required fields
            quote_data = self._validate_quote_data(quote_data, hourly_rate)
            
            return {
                'success': True,
                'quote_data': quote_data,
                'raw_response': content
            }
            
        except json.JSONDecodeError as e:
            return {
                'success': False,
                'error': f'Failed to parse AI response: {str(e)}',
                'raw_response': content if 'content' in locals() else None
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'AI service error: {str(e)}'
            }
    
    def analyze_photo_text(self, extracted_text, user_trade_type="Electrician", hourly_rate=45.0):
        """
        Analyze extracted text from photo and generate quote
        
        Args:
            extracted_text (str): Text extracted from photo
            user_trade_type (str): Type of trade
            hourly_rate (float): User's hourly rate
            
        Returns:
            dict: Generated quote data
        """
        
        system_prompt = f"""You are an AI assistant helping UK {user_trade_type.lower()}s create quotes from handwritten notes.

The text was extracted from a photo of handwritten notes, receipts, or job sheets. It may contain:
- Customer details
- Job descriptions
- Material lists
- Rough cost estimates
- Dates and times

Extract and organize this information into a professional quote with UK pricing and 20% VAT.

Respond with valid JSON only:
{{
    "customer_name": "string",
    "customer_phone": "string or null",
    "customer_address": "string or null",
    "job_description": "detailed description",
    "job_type": "Kitchen/Bathroom/Emergency/Electrical/Plumbing/General",
    "urgency": "emergency/urgent/normal",
    "labour_hours": number,
    "labour_rate": number,
    "materials": [
        {{"item": "string", "quantity": number, "unit_price": number, "total": number}}
    ],
    "materials_cost": number,
    "subtotal": number,
    "vat_amount": number,
    "total_amount": number,
    "confidence": number (0-1),
    "notes": "any additional notes or observations"
}}"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Extracted text from photo: {extracted_text}"}
                ],
                temperature=0.3,
                max_tokens=1500
            )
            
            content = response.choices[0].message.content.strip()
            
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                content = json_match.group()
            
            quote_data = json.loads(content)
            quote_data = self._validate_quote_data(quote_data, hourly_rate)
            
            return {
                'success': True,
                'quote_data': quote_data,
                'raw_response': content
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Photo analysis error: {str(e)}'
            }
    
    def _validate_quote_data(self, quote_data, default_hourly_rate):
        """Validate and clean quote data"""
        
        # Ensure required fields exist
        required_fields = {
            'customer_name': 'Unknown Customer',
            'job_description': 'Job description not provided',
            'job_type': 'General',
            'urgency': 'normal',
            'labour_hours': 2.0,
            'labour_rate': default_hourly_rate,
            'materials_cost': 0.0,
            'confidence': 0.8
        }
        
        for field, default_value in required_fields.items():
            if field not in quote_data or quote_data[field] is None:
                quote_data[field] = default_value
        
        # Ensure materials is a list
        if 'materials' not in quote_data or not isinstance(quote_data['materials'], list):
            quote_data['materials'] = []
        
        # Calculate totals
        labour_cost = quote_data['labour_hours'] * quote_data['labour_rate']
        materials_cost = quote_data['materials_cost']
        subtotal = labour_cost + materials_cost
        vat_amount = subtotal * 0.20  # 20% UK VAT
        total_amount = subtotal + vat_amount
        
        quote_data.update({
            'subtotal': round(subtotal, 2),
            'vat_amount': round(vat_amount, 2),
            'total_amount': round(total_amount, 2)
        })
        
        return quote_data
    
    def generate_quote_number(self):
        """Generate a unique quote number"""
        timestamp = datetime.now().strftime("%Y%m%d")
        import random
        random_suffix = random.randint(1000, 9999)
        return f"TM-{timestamp}-{random_suffix}"

