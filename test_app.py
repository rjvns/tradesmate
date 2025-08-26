#!/usr/bin/env python3
"""
Simple test script to verify the Flask app works
"""

import requests
import time
import sys

def test_app():
    """Test the Flask application endpoints"""
    base_url = "http://localhost:8000"
    
    print("Testing TradesMate API...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        print(f"✅ Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test home endpoint
    try:
        response = requests.get(f"{base_url}/", timeout=10)
        print(f"✅ Home endpoint: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Home endpoint failed: {e}")
        return False
    
    print("🎉 All tests passed!")
    return True

if __name__ == "__main__":
    test_app()
