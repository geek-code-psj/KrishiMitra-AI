# KrishiMitra AI - Free Deployment Strategy

Since your laptop can't handle local development, deploy everything for free on the cloud.

## Architecture Overview

```
┌─────────────────────┐     ┌─────────────────────┐
│   Frontend (Web)   │────▶│   Backend (API)    │
│   (Vercel/Render)  │     │   (Render/Railway) │
└─────────────────────┘     └─────────────────────┘
                                   │
                                   ▼
                            ┌─────────────────┐
                            │   PostgreSQL    │
                            │  (Neon/Koyeb)   │
                            └─────────────────┘
```

---

## Free Tier Services

| Service | Type | Free Limits | Link |
|---------|------|-------------|------|
| **Vercel** | Frontend | 100GB bandwidth/month | vercel.com |
| **Render** | Backend API | 750 hours/month | render.com |
| **Neon** | PostgreSQL | 512MB storage | neon.tech |
| **Railway** | Full Stack | $5 credit/month | railway.app |
| **Fly.io** | Backend | 3 VMs, 160GB SSD | fly.io |

---

## Recommended: Vercel + Neon (100% Free)

### Step 1: Deploy PostgreSQL Database (Neon)

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create new project: `krishimitra`
4. Copy connection string:
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/krishimitra?sslmode=require
   ```

### Step 2: Deploy Backend (Render)

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create new **Web Service**
4. Connect your GitHub repository
5. Settings:
   ```
   Name: krishimitra-api
   Runtime: Python 3.11
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
6. Add Environment Variables:
   ```
   DATABASE_URL=<paste_neon_connection_string>
   SECRET_KEY=your-secret-key-here
   DEBUG=false
   ```
7. Deploy (wait 3-5 minutes)

### Step 3: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your GitHub repository
4. Settings:
   ```
   Framework: Next.js
   Build Command: npm run build
   Output Directory: .next
   ```
5. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://krishimitra-api.onrender.com
   ```
6. Deploy

**Your app will be live at:**
- Frontend: `https://your-project.vercel.app`
- API: `https://krishimitra-api.onrender.com`

---

## Alternative: Railway (Simpler - Single Platform)

### Deploy Everything on Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → **Deploy from GitHub repo**
4. Add PostgreSQL plugin (free tier)
5. Add Environment Variables:
   ```
   DATABASE_URL=<from_railway_postgres>
   SECRET_KEY=your-secret-key
   ```
6. Deploy

Railway gives $5/month credit - enough for small project.

---

## Alternative: Fly.io (Best for Python/FastAPI)

1. Install Fly CLI: `winget install flyctl`
2. Login: `fly auth login`
3. In project root:
   ```bash
   fly launch
   ```
4. Add PostgreSQL: `fly postgres create`
5. Connect: `fly postgres attach`
6. Deploy: `fly deploy`

---

## Quick Setup Checklist

- [ ] Create GitHub repository and push code
- [ ] Sign up for Neon → Create database
- [ ] Sign up for Render → Deploy backend
- [ ] Sign up for Vercel → Deploy frontend
- [ ] Update API URL in frontend env vars

---

## Environment Variables Needed

### Backend (.env)
```
DATABASE_URL=postgresql://...
SECRET_KEY=32-character-random-string
DEBUG=false
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
```

---

## Cost Estimate

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| Vercel | 100GB bandwidth | ₹0 |
| Render | 750 hours | ₹0 |
| Neon | 512MB storage | ₹0 |
| **Total** | | **₹0** |

---

## Troubleshooting

### Backend Not Starting?
- Check logs in Render dashboard
- Ensure `requirements.txt` has all dependencies

### Database Connection Error?
- Verify `DATABASE_URL` format
- Check Neon dashboard → SQL Editor → Test connection

### Frontend API Not Working?
- Update `NEXT_PUBLIC_API_URL` in Vercel
- Check browser console for CORS errors