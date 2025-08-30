# TradesMate Database Setup Guide

## 🚨 QUICK FIX FOR PRODUCTION

Your database connection issue is because `DATABASE_URL` environment variable is not set. Here's how to fix it:

### Option 1: Railway Deployment (Recommended)

1. **Add PostgreSQL to Railway:**
   ```bash
   # In your Railway project dashboard:
   # 1. Click "New" → "Database" → "PostgreSQL"
   # 2. Railway automatically sets DATABASE_URL
   ```

2. **Verify Environment Variable:**
   - Go to Railway project → Variables tab
   - Ensure `DATABASE_URL` exists (auto-created with PostgreSQL)
   - Should look like: `postgresql://user:pass@host:port/dbname`

3. **Deploy and Initialize:**
   ```bash
   # Railway will auto-deploy after adding PostgreSQL
   # Tables are created automatically on first run
   ```

### Option 2: Manual PostgreSQL Setup

1. **Get a PostgreSQL Database:**
   - Railway PostgreSQL (recommended)
   - Supabase (free tier)
   - Neon (free tier)
   - ElephantSQL (free tier)

2. **Set Environment Variable:**
   ```bash
   # In your deployment platform:
   DATABASE_URL=postgresql://username:password@host:port/database_name
   ```

3. **Initialize Database:**
   ```bash
   # Run this once after setting DATABASE_URL:
   cd backend
   python3 setup_database.py
   ```

### Option 3: Local Development

For local testing, the app automatically uses SQLite:
```bash
cd backend
python3 setup_database.py  # Creates local SQLite database
python3 -m src.main        # Run backend locally
```

## 🔧 Troubleshooting

### "You have no tables" Error
**Cause:** Database exists but tables aren't created
**Fix:** Run the setup script:
```bash
cd backend
python3 setup_database.py
```

### "Database connection failed" Error
**Cause:** `DATABASE_URL` not set or incorrect
**Fix:** 
1. Check environment variables in your deployment platform
2. Ensure PostgreSQL service is running
3. Verify DATABASE_URL format: `postgresql://user:pass@host:port/db`

### Railway Specific Issues
1. **Add PostgreSQL addon** in Railway dashboard
2. **Redeploy** after adding database
3. **Check logs** for connection errors

## 📋 Database Schema

The database includes these tables:
- `users` - User accounts and profiles
- `quotes` - Job quotes and estimates  
- `jobs` - Scheduled and completed jobs
- `invoices` - Billing and payments

All tables are created automatically when the app starts.

## 🚀 Quick Commands

```bash
# Test database connection
cd backend && python3 -c "from src.main import create_app; from src.database import db; app=create_app(); app.app_context().push(); db.session.execute('SELECT 1'); print('✅ Database connected!')"

# Initialize database tables
cd backend && python3 setup_database.py

# Run backend locally
cd backend && python3 -m src.main

# Check database file (SQLite only)
ls -la backend/instance/tradesmate.db
```
