"""
User API routes for TradesMate
"""

from flask import Blueprint, request, jsonify
from database import db
from models.user import User

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get user profile"""
    try:
        user = User.query.first()  # Demo: get first user
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/profile', methods=['PUT'])
def update_profile():
    """Update user profile"""
    try:
        user = User.query.first()  # Demo: get first user
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        updatable_fields = ['name', 'email', 'phone', 'company_name', 'address', 'vat_number', 'hourly_rate']
        
        for field in updatable_fields:
            if field in data:
                setattr(user, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

