# Deployment Guide - Voice Notes Backend on Render

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **MongoDB Atlas Account**: For the production database
3. **Google Gemini API Key**: For AI summarization features
4. **Render Account**: Sign up at [render.com](https://render.com)

## Step-by-Step Deployment

### 1. Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier is fine)
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Render
5. Get your connection string (replace `<password>` with your actual password)

### 2. Push to GitHub

Make sure your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 3. Deploy on Render

#### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Set up environment variables (see below)
6. Deploy

#### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Environment**: Node
   - **Region**: Oregon (or closest to you)
   - **Branch**: main
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (for testing)

### 4. Environment Variables

Set these environment variables in Render:

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | `10000` | `10000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:password@cluster.mongodb.net/voicenotes` |
| `GEMINI_API_KEY` | Your Google Gemini API key | `AIzaSyC...` |

### 5. Update Frontend Configuration

Once deployed, update your frontend API configuration to use the Render URL:

```javascript
// In frontend/src/services/api.ts or similar
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-app-name.onrender.com'
  : 'http://localhost:5000';
```

### 6. Update CORS Settings

Update the CORS configuration in `backend/server.js`:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend-domain.vercel.app', 'https://your-frontend-domain.netlify.app']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

## Important Notes

### Free Tier Limitations

- **Sleep Mode**: Free tier services sleep after 15 minutes of inactivity
- **Cold Starts**: First request after sleep may take 30+ seconds
- **Storage**: Files uploaded to `/uploads` are not persistent (use cloud storage for production)

### File Upload Considerations

For production, consider using cloud storage:

1. **AWS S3**
2. **Google Cloud Storage**
3. **Cloudinary**

### Monitoring

- Check logs in Render dashboard
- Use the health check endpoint: `https://your-app.onrender.com/health`
- Monitor MongoDB Atlas for database connections

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Environment Variables**: Ensure all required env vars are set
3. **CORS Errors**: Update CORS settings with your frontend domain
4. **MongoDB Connection**: Verify connection string and IP whitelist

### Logs

View logs in Render dashboard:
1. Go to your service
2. Click "Logs" tab
3. Check for errors during startup

### Test Endpoints

After deployment, test these endpoints:

- `GET https://your-app.onrender.com/` - API status
- `GET https://your-app.onrender.com/health` - Health check
- `GET https://your-app.onrender.com/api/voice-notes` - Get voice notes

## Next Steps

1. **Custom Domain**: Add a custom domain in Render settings
2. **SSL Certificate**: Automatic with custom domains
3. **Monitoring**: Set up monitoring with services like Uptime Robot
4. **Backups**: Regular database backups through MongoDB Atlas

## Support

If you encounter issues:
1. Check Render logs
2. Verify environment variables
3. Test MongoDB connection
4. Check CORS configuration