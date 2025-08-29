# 🚀 TradesMate Deployment Guide

## Quick Deploy to Production

### Prerequisites
- GitHub account
- Railway account (free tier)
- Vercel account (free tier)

## Backend Deployment (Railway)

### 1. Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select the `tradesmate-complete` repository
5. Railway will automatically detect it's a Python app

### 2. Add PostgreSQL Database
1. In your Railway project, click "New" → "Database" → "PostgreSQL"
2. Railway will automatically add `DATABASE_URL` environment variable

### 3. Set Environment Variables
In Railway dashboard, add these environment variables:

**Required Variables:**
```
SECRET_KEY=your-super-secret-key-here-64-chars-minimum
OPENAI_API_KEY=your-openai-api-key-or-demo-key
FLASK_ENV=production
```

**Optional Variables:**
```
MAX_CONTENT_LENGTH=26214400
PYTHONPATH=/app/backend
```

**How to Add Environment Variables in Railway:**
1. Go to your Railway project dashboard
2. Click on your service (backend)
3. Go to "Variables" tab
4. Click "New Variable"
5. Add each variable name and value
6. Click "Add" for each variable

**Generate a Secure SECRET_KEY:**
```bash
# Option 1: Python
python -c "import secrets; print(secrets.token_hex(32))"

# Option 2: OpenSSL
openssl rand -hex 32

# Option 3: Online generator (use reputable source)
# Generate 64-character hexadecimal string
```

**⚠️ Important Notes:**
- SECRET_KEY should be 64+ characters for production security
- Never commit SECRET_KEY to git
- If not set, app will auto-generate temporary key (not recommended for production)
- DATABASE_URL is automatically provided by Railway PostgreSQL

### 4. Deploy and Seed Data
1. Railway will automatically deploy when you push to GitHub
2. After deployment, run the seed script:
   ```bash
   # In Railway console or via CLI
   python seed_production.py
   ```

## Frontend Deployment (Vercel)

### 1. Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project" → "Import Git Repository"
3. Select the `tradesmate-complete` repository
4. Set the root directory to `frontend`
5. Set build command: `npm run build`
6. Set output directory: `dist`

### 2. Set Environment Variables
In Vercel dashboard, add:

```
VITE_API_URL=https://your-railway-app-url.railway.app
```

### Additional Environment Variables
```
# Backend (Railway) - Additional vars
PYTHONPATH=/app/backend
MAX_CONTENT_LENGTH=26214400

# Frontend (Vercel) - Additional vars  
VITE_APP_VERSION=1.0.0
```

### 3. Deploy
Vercel will automatically deploy and provide a URL like:
`https://tradesmate-frontend.vercel.app`

## Custom Domain (Optional)

### 1. Buy a Domain
- GoDaddy, Namecheap, or Google Domains

### 2. Configure DNS
- Point to Vercel for frontend
- Point to Railway for backend

### 3. Add to Vercel
- In Vercel dashboard → Settings → Domains
- Add your custom domain

## Environment Variables Reference

### Backend (Railway)
```
DATABASE_URL=postgresql://... (auto-set by Railway)
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-key
FLASK_ENV=production
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.railway.app
```

## Testing Your Deployment

### 1. Test Backend
```bash
curl https://your-railway-app.railway.app/
# Should return: {"message": "TradesMate API", "version": "1.0.0", "status": "running"}

curl https://your-railway-app.railway.app/api/quotes/
# Should return quotes data
```

### 2. Test Frontend
- Visit your Vercel URL
- Login with demo credentials
- Test quote creation and editing

## Troubleshooting

### Backend Issues

**🚫 "SECRET_KEY environment variable must be set"**
- **Cause:** Missing SECRET_KEY in Railway environment variables
- **Solution:** Add SECRET_KEY variable in Railway dashboard (see section 3 above)
- **Quick Fix:** App will auto-generate temporary key, but set proper one for production

**🚫 "service unavailable" - Healthcheck Failed**
- **Cause:** App not starting properly
- **Check:** Railway deployment logs for specific error messages
- **Common Issues:**
  - Missing environment variables
  - Import/module errors
  - Database connection failures
  - Port binding problems

**🚫 Import/Module Errors**
- **Cause:** Missing `__init__.py` files or incorrect Python paths
- **Solution:** Ensure all directories have `__init__.py` files
- **Verify:** Check `PYTHONPATH=/app/backend` is set

**🚫 Database Connection Issues**
- **Cause:** PostgreSQL not connected or configured
- **Solution:** Ensure Railway PostgreSQL addon is added
- **Verify:** `DATABASE_URL` environment variable exists

### Frontend Issues
- Check Vercel build logs
- Verify `VITE_API_URL` is correct
- Check browser console for CORS errors
- Ensure CSS build completed (should be ~41KB, not 9 lines)

### Database Issues
- Run `python seed_production.py` in Railway console
- Check if tables exist in Railway database
- Verify PostgreSQL addon is properly connected

### Quick Deployment Checklist
✅ **Environment Variables Set:**
- [ ] SECRET_KEY (64+ characters)
- [ ] OPENAI_API_KEY
- [ ] FLASK_ENV=production

✅ **Railway Configuration:**
- [ ] PostgreSQL database added
- [ ] Latest code pushed to GitHub
- [ ] Dockerfile builds successfully
- [ ] Healthcheck passes on `/` route

✅ **File Structure:**
- [ ] All directories have `__init__.py` files
- [ ] `src/main.py` has `create_app()` function
- [ ] Gunicorn command uses `src.main:create_app` (no parentheses)

## Monitoring

### Railway
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts

### Vercel
- View analytics in Vercel dashboard
- Monitor performance
- Check error logs

## Next Steps

1. **Set up monitoring** (Sentry, LogRocket)
2. **Add SSL certificates** (automatic with Vercel/Railway)
3. **Set up CI/CD** (automatic with GitHub integration)
4. **Add backup strategy** for database
5. **Set up staging environment**

## Support

- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- TradesMate issues: Create GitHub issue



