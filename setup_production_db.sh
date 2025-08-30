#!/bin/bash

# TradesMate Production Database Setup Script
# This script helps you set up PostgreSQL for your TradesMate deployment

echo "🐘 TradesMate PostgreSQL Setup Guide"
echo "===================================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set!"
    echo ""
    echo "🔧 How to fix this:"
    echo ""
    echo "Option 1: Railway (Recommended)"
    echo "1. Go to your Railway project dashboard"
    echo "2. Click 'New' → 'Database' → 'PostgreSQL'"
    echo "3. Railway will automatically set DATABASE_URL"
    echo "4. Your app will redeploy automatically"
    echo ""
    echo "Option 2: Supabase (Free)"
    echo "1. Go to supabase.com → Create project"
    echo "2. Go to Settings → Database → Connection string"
    echo "3. Copy the PostgreSQL URL"
    echo "4. Set DATABASE_URL in your deployment platform"
    echo ""
    echo "Option 3: Manual PostgreSQL"
    echo "Set DATABASE_URL like this:"
    echo "DATABASE_URL=postgresql://username:password@host:port/database"
    echo ""
    exit 1
fi

echo "✅ DATABASE_URL is set!"
echo "Database: ${DATABASE_URL:0:30}..."

# Check if it's PostgreSQL
if [[ "$DATABASE_URL" != *"postgresql"* ]]; then
    echo "❌ DATABASE_URL is not PostgreSQL!"
    echo "Current: $DATABASE_URL"
    echo "Expected format: postgresql://user:pass@host:port/dbname"
    exit 1
fi

echo "✅ PostgreSQL URL detected!"

# Test the database setup
echo ""
echo "🧪 Testing database setup..."

cd backend
python3 postgres_setup.py

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your PostgreSQL database is ready!"
    echo "✅ All quote data will be saved to PostgreSQL"
    echo "✅ Your TradesMate app is production-ready!"
else
    echo ""
    echo "❌ Database setup failed!"
    echo "Check the error messages above and fix any issues."
    exit 1
fi
