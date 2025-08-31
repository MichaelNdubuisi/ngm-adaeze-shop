# Deployment Guide for NGM Adaeze Website

## Prerequisites
- Vercel account (for frontend)
- Render account (for backend)
- GitHub repository (recommended for easy deployment)

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
- Build the frontend: `cd Frontend && npm run build`
- The build folder is ready

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in or create account
3. Click "New Project"
4. Import your GitHub repo or upload the `Frontend` folder
5. Configure:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install --legacy-peer-deps`
6. Add Environment Variables:
   - `REACT_APP_API_URL`: `https://your-render-backend-url.onrender.com`
   - `REACT_APP_PROD_API_URL`: `https://your-render-backend-url.onrender.com`
7. Deploy

## Backend Deployment (Render)

### Step 1: Prepare Backend
- Ensure `new-ngm-backend/package.json` has correct scripts
- Create `.env` file with:
  ```
  MONGO_URI=your_mongodb_connection_string
  FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
  PORT=5000
  ```

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign in or create account
3. Click "New" > "Web Service"
4. Connect your GitHub repo or upload the `new-ngm-backend` folder
5. Configure:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB URI
   - `FRONTEND_URL`: Your Vercel frontend URL
   - `PORT`: 5000
7. Deploy

## Post-Deployment
1. Update the URLs in `Frontend/src/api.js` if needed
2. Test the integration
3. Update CORS in backend if necessary
