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

```
SECRET_KEY=your-super-secret-key-here
OPENAI_API_KEY=your-openai-api-key-or-demo-key
FLASK_ENV=production
```

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
- Check Railway logs for errors
- Verify environment variables are set
- Ensure database is connected

### Frontend Issues
- Check Vercel build logs
- Verify `VITE_API_URL` is correct
- Check browser console for CORS errors

### Database Issues
- Run `python seed_production.py` in Railway console
- Check if tables exist in Railway database

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



