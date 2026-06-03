# Frontend Deployment to Vercel

## Setup Instructions

### 1. Initialize React Project
```bash
npx create-react-app influencer-gig-web
cd influencer-gig-web
npm install axios react-router-dom @stripe/react-stripe-js @stripe/stripe-js
```

### 2. Replace Files
Copy the following files into your React project:
- `src/App.jsx` → `App.js`
- `src/App.css` → `App.css`
- Create `.env.local` file (see below)

### 3. Environment Variables
Create `.env.local` in your project root:
```
REACT_APP_API_URL=http://localhost:3001/api  # Local development
# After deploying backend, change to:
# REACT_APP_API_URL=https://influencer-gig-api-prod.up.railway.app/api
```

### 4. Test Locally
```bash
npm start
```

App runs at `http://localhost:3000`

---

## Deploy to Vercel

### Step 1: Connect GitHub to Vercel
1. Go to **vercel.com** → Sign up with GitHub
2. Click **Add New** → **Project**
3. Find and import `influencer-gig-web` repository
4. Vercel auto-detects it's a Create React App

### Step 2: Set Environment Variables
In Vercel dashboard:
1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Add:
   ```
   REACT_APP_API_URL=https://influencer-gig-api-prod.up.railway.app/api
   ```

### Step 3: Deploy
1. Click **Deploy**
2. Vercel auto-deploys on every GitHub push
3. Your site URL: `https://influencer-gig-web.vercel.app`

---

## Connect Frontend to Backend

Once both are deployed:

1. **Update `.env.local`** in Vercel settings:
   ```
   REACT_APP_API_URL=https://your-railway-backend.up.railway.app/api
   ```

2. **Fix CORS** in backend `server.js`:
   ```javascript
   app.use(cors({
     origin: 'https://influencer-gig-web.vercel.app'
   }));
   ```

3. **Redeploy** both services

---

## Quick Deployment Checklist

- [ ] Backend deployed on Railway
- [ ] Backend API testing with curl/Postman working
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set on Vercel
- [ ] CORS configured in backend
- [ ] Products loading in frontend
- [ ] Form submission working
- [ ] Stripe integration tested

---

## Troubleshooting

### Products not loading?
1. Check browser console for errors
2. Verify `REACT_APP_API_URL` is correct
3. Check backend is running: `curl https://your-api.up.railway.app/health`

### CORS errors?
Add this to backend `server.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://influencer-gig-web.vercel.app']
}));
```

### Form submission failing?
1. Check backend logs on Railway dashboard
2. Verify all fields are being sent
3. Test API directly with Postman

