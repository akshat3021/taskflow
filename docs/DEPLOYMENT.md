# Deployment Guide — TaskFlow

## Overview

| Layer | Service | Cost |
|-------|---------|------|
| Frontend | Vercel | Free |
| Backend | Railway or Render | Free tier |
| Database | MongoDB Atlas | M0 Free |

---

## Step 1: MongoDB Atlas

1. Sign up at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a new project → Build a database → **M0 Free**
3. Create a database user (username + password)
4. Under Network Access → Add IP Address → `0.0.0.0/0` (Allow anywhere)
5. Click **Connect** → Drivers → Copy connection string
6. Replace `<password>` in the connection string with your actual password

**Example:**
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/taskflow?retryWrites=true&w=majority
```

---

## Step 2: Backend → Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your `taskflow` repository
4. Set **Root Directory** to `server`
5. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your Atlas URI>
   CLIENT_URL=https://your-app.vercel.app
   ```
6. Deploy — Railway auto-detects Node.js and runs `npm start`
7. Copy your Railway domain (e.g., `taskflow-production.up.railway.app`)

**Alternative: Render**
1. New Web Service → Connect GitHub
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add the same environment variables

---

## Step 3: Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set **Root Directory** to `client`
3. Vercel auto-detects Vite — no changes needed
4. Add environment variable:
   ```
   VITE_API_URL=https://taskflow-production.up.railway.app/api/v1
   ```
5. Deploy — builds automatically on every push to `main`

---

## Step 4: Verify

1. Open your Vercel URL
2. Create a task
3. Check it appears — API is connected
4. Check `https://your-backend.railway.app/api/v1/health`

---

## CORS Update

After deploying, update `CLIENT_URL` in your Railway environment to match your Vercel URL exactly (including `https://`). The backend only accepts requests from this origin.

---

## Custom Domain (Optional)

Both Vercel and Railway support custom domains for free on the hobby tier. Add your domain in their dashboard settings.

---

## CI/CD

Both Vercel and Railway watch your `main` branch and redeploy automatically on every push. No pipeline configuration needed.

For production-grade CI, add GitHub Actions:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: cd client && npm ci && npm run build
```
