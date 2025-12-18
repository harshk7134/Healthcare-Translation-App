# Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Healthcare Translator application to production.

---

## Prerequisites

Before deploying, ensure you have:

- ✅ OpenAI API key (with GPT-4 and TTS access)
- ✅ Node.js v14+ installed
- ✅ npm or yarn package manager
- ✅ Git installed
- ✅ Accounts on deployment platforms (optional)

---

## Local Development Setup

### 1. Install Dependencies

**Backend:**
```powershell
cd backend
npm install
```

**Frontend:**
```powershell
cd frontend
npm install
```

### 2. Configure Environment Variables

**Backend (backend/.env):**
```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (frontend/.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

**Access the app**: http://localhost:3000

---

## Production Deployment

### Option 1: Vercel (Recommended for Frontend)

#### Deploy Frontend to Vercel

1. **Install Vercel CLI:**
```powershell
npm install -g vercel
```

2. **Build Frontend:**
```powershell
cd frontend
npm run build
```

3. **Deploy:**
```powershell
vercel --prod
```

4. **Configure Environment Variables:**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add: `REACT_APP_API_URL` = `https://your-backend-url.com/api`

5. **Deploy Backend Separately** (see Option 2 or 3)

---

### Option 2: Railway (Recommended for Backend)

#### Deploy Backend to Railway

1. **Install Railway CLI:**
```powershell
npm install -g @railway/cli
```

2. **Login:**
```powershell
railway login
```

3. **Initialize Project:**
```powershell
cd backend
railway init
```

4. **Set Environment Variables:**
```powershell
railway variables set OPENAI_API_KEY=your_key_here
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set FRONTEND_URL=https://your-frontend-domain.vercel.app
```

5. **Deploy:**
```powershell
railway up
```

6. **Get Backend URL:**
```powershell
railway domain
```

7. **Update Frontend .env:**
```env
REACT_APP_API_URL=https://your-backend.railway.app/api
```

---

### Option 3: Heroku

#### Deploy Backend to Heroku

1. **Install Heroku CLI:**
```powershell
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

2. **Login:**
```powershell
heroku login
```

3. **Create App:**
```powershell
cd backend
heroku create healthcare-translator-api
```

4. **Set Environment Variables:**
```powershell
heroku config:set OPENAI_API_KEY=your_key_here
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-domain.vercel.app
```

5. **Deploy:**
```powershell
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a healthcare-translator-api
git push heroku main
```

6. **Open App:**
```powershell
heroku open
```

#### Deploy Frontend to Heroku

1. **Create Frontend App:**
```powershell
cd frontend
heroku create healthcare-translator-frontend
```

2. **Add Buildpack:**
```powershell
heroku buildpacks:set mars/create-react-app
```

3. **Set Environment:**
```powershell
heroku config:set REACT_APP_API_URL=https://healthcare-translator-api.herokuapp.com/api
```

4. **Deploy:**
```powershell
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a healthcare-translator-frontend
git push heroku main
```

---

### Option 4: AWS (Advanced)

#### Deploy Using AWS Elastic Beanstalk

**Backend:**
```powershell
cd backend
eb init -p node.js healthcare-translator-api
eb create production
eb setenv OPENAI_API_KEY=your_key NODE_ENV=production
eb deploy
```

**Frontend:**
```powershell
cd frontend
npm run build
# Upload build/ to S3 bucket
# Configure CloudFront for CDN
```

---

### Option 5: DigitalOcean App Platform

1. **Connect GitHub Repository**
2. **Configure Backend:**
   - Runtime: Node.js
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Environment Variables: Add `OPENAI_API_KEY`, etc.

3. **Configure Frontend:**
   - Runtime: Node.js
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Environment Variables: Add `REACT_APP_API_URL`

---

## Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://app.example.com` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://api.example.com/api` |

---

## HTTPS Configuration

### Why HTTPS is Required

1. **Web Speech API**: Requires HTTPS in production
2. **Microphone Access**: Browsers require secure context
3. **Data Security**: Encrypt patient-provider communication

### Setting Up HTTPS

**Vercel/Netlify**: Automatic HTTPS (Let's Encrypt)

**Custom Domain**:
1. Add domain to deployment platform
2. Platform auto-generates SSL certificate
3. Update DNS records as instructed

**Manual SSL** (if self-hosting):
```bash
# Using Certbot for Let's Encrypt
sudo certbot --nginx -d yourdomain.com
```

---

## Domain Configuration

### Custom Domain Setup

1. **Purchase Domain** (e.g., from Namecheap, GoDaddy)

2. **Configure DNS:**
   - Frontend (Vercel): Add CNAME record
     ```
     Type: CNAME
     Name: @
     Value: cname.vercel-dns.com
     ```
   
   - Backend (Railway/Heroku): Add CNAME record
     ```
     Type: CNAME
     Name: api
     Value: your-app.railway.app
     ```

3. **Update Environment Variables:**
   ```env
   # Backend
   FRONTEND_URL=https://yourdomain.com
   
   # Frontend
   REACT_APP_API_URL=https://api.yourdomain.com/api
   ```

---

## Database Setup (Optional)

### MongoDB Atlas (for future session storage)

1. **Create Account**: https://www.mongodb.com/cloud/atlas

2. **Create Cluster:**
   - Choose free tier (M0)
   - Select region closest to users

3. **Get Connection String:**
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/healthcare-translator
   ```

4. **Add to Backend .env:**
   ```env
   MONGODB_URI=mongodb+srv://...
   ```

5. **Whitelist IP Addresses:**
   - For Railway/Heroku: Allow from anywhere (0.0.0.0/0)
   - For production: Restrict to specific IPs

---

## Security Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] `.env` files NOT committed to Git
- [ ] API keys secured
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Helmet.js configured
- [ ] HTTPS enabled

### Post-Deployment

- [ ] Test microphone access over HTTPS
- [ ] Verify speech recognition works
- [ ] Test translation functionality
- [ ] Test audio playback
- [ ] Check error handling
- [ ] Monitor API usage (OpenAI dashboard)
- [ ] Set up error tracking (Sentry)

---

## Monitoring & Logging

### Application Monitoring

**Sentry (Error Tracking):**
1. Create account: https://sentry.io
2. Install SDK:
   ```bash
   npm install @sentry/react @sentry/node
   ```
3. Initialize in code:
   ```javascript
   Sentry.init({ dsn: 'your-dsn' });
   ```

**LogRocket (Session Replay):**
```javascript
LogRocket.init('app-id');
```

### API Usage Monitoring

**OpenAI Dashboard:**
- Monitor API usage: https://platform.openai.com/usage
- Set billing alerts
- Track token consumption

---

## Performance Optimization

### Frontend Optimization

1. **Code Splitting:**
   ```javascript
   const TranscriptBox = React.lazy(() => import('./components/TranscriptBox'));
   ```

2. **Build Optimization:**
   ```powershell
   npm run build
   # Creates optimized production build
   ```

3. **CDN for Assets:**
   - Vercel/Netlify provide automatic CDN
   - For custom: Use CloudFlare or AWS CloudFront

### Backend Optimization

1. **Enable Compression:**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Caching (Redis):**
   ```javascript
   // Cache translations for common phrases
   ```

3. **Load Balancing:**
   - Use platform's auto-scaling features
   - Railway/Heroku: Increase dynos

---

## Cost Estimation

### OpenAI API Costs

**GPT-4 Pricing** (as of Dec 2025):
- Input: $0.03 per 1K tokens (~750 words)
- Output: $0.06 per 1K tokens

**TTS Pricing**:
- $15 per 1M characters (~400 hours of audio)

**Estimated Monthly Cost** (100 patients/day):
- Translations: ~$50-100
- TTS: ~$10-20
- **Total**: $60-120/month

### Hosting Costs

| Platform | Backend | Frontend | Total/Month |
|----------|---------|----------|-------------|
| Vercel + Railway | Free-$5 | Free | $0-5 |
| Heroku | $7 | $7 | $14 |
| AWS | $10-50 | $5-20 | $15-70 |
| DigitalOcean | $12 | $12 | $24 |

**Recommended for Start**: Vercel (Frontend) + Railway (Backend) = **Free-$5/month**

---

## Backup & Recovery

### Backup Strategy

1. **Code Backup:**
   - Push to GitHub/GitLab
   - Enable branch protection

2. **Database Backup** (if using MongoDB):
   - MongoDB Atlas: Automatic backups
   - Manual: `mongodump` command

3. **Environment Variables:**
   - Store securely in password manager
   - Document in private wiki

### Disaster Recovery

1. **Rollback Deployment:**
   ```powershell
   # Vercel
   vercel rollback
   
   # Heroku
   heroku releases:rollback
   ```

2. **Database Restore:**
   ```powershell
   mongorestore --uri="mongodb+srv://..." dump/
   ```

---

## Testing in Production

### Smoke Tests

1. **Health Check:**
   ```powershell
   curl https://your-api.com/api/health
   ```

2. **Translation Test:**
   ```powershell
   curl -X POST https://your-api.com/api/translation/translate \
     -H "Content-Type: application/json" \
     -d '{"text":"Test","sourceLang":"English","targetLang":"Spanish"}'
   ```

3. **Frontend Test:**
   - Open https://your-domain.com
   - Click "Start Listening"
   - Verify microphone permission prompt
   - Speak and verify transcription
   - Check translation appears
   - Click "Speak" and verify audio

### Load Testing

```bash
# Using Apache Bench
ab -n 100 -c 10 https://your-api.com/api/health

# Using Artillery
npm install -g artillery
artillery quick --count 100 -n 10 https://your-api.com/api/health
```

---

## Scaling Considerations

### Horizontal Scaling

**Backend:**
- Railway/Heroku: Increase replicas/dynos
- AWS: Auto Scaling Groups
- Load balancer distributes traffic

**Database:**
- MongoDB Atlas: Increase cluster tier
- Add read replicas

### Vertical Scaling

- Increase memory/CPU per instance
- Railway: Upgrade plan
- Heroku: Upgrade dyno type

### Rate Limiting Adjustment

```javascript
// Increase for production
rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500  // Increased from 100
})
```

---

## Compliance & Legal

### HIPAA Compliance

**For Production Use:**
1. Sign BAA (Business Associate Agreement) with OpenAI
2. Enable audit logging
3. Implement user authentication
4. Add data encryption at rest
5. Regular security audits
6. Employee training on HIPAA

**Current Implementation:**
- ✅ No data persistence
- ✅ HTTPS encryption
- ✅ Rate limiting
- ❌ No BAA with OpenAI (required for production)
- ❌ No audit logging (should add)

### Privacy Policy

Create privacy policy covering:
- What data is collected
- How data is processed
- Third-party services (OpenAI)
- User rights
- Contact information

---

## Troubleshooting Deployment

### Common Issues

**1. CORS Errors:**
```
Solution: Update FRONTEND_URL in backend .env
Verify: Check browser console
```

**2. OpenAI API Errors:**
```
Solution: Verify API key is correct
Check: OpenAI dashboard for usage/limits
```

**3. Speech Recognition Not Working:**
```
Solution: Ensure HTTPS is enabled
Check: Browser supports Web Speech API
```

**4. Build Failures:**
```
Solution: Check Node.js version compatibility
Run: npm install to update dependencies
```

**5. Port Already in Use:**
```powershell
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change PORT in .env
PORT=5001
```

---

## Maintenance

### Regular Tasks

**Weekly:**
- Monitor API usage (OpenAI dashboard)
- Check error logs (Sentry)
- Review application performance

**Monthly:**
- Update dependencies:
  ```powershell
  npm update
  npm audit fix
  ```
- Review security alerts
- Backup environment variables

**Quarterly:**
- Review and optimize API costs
- Update documentation
- Security audit
- Performance testing

---

## Support & Resources

### Documentation Links

- **React**: https://react.dev
- **Express**: https://expressjs.com
- **OpenAI API**: https://platform.openai.com/docs
- **Vercel**: https://vercel.com/docs
- **Railway**: https://docs.railway.app

### Community Support

- Stack Overflow: Tag questions with `react`, `express`, `openai-api`
- GitHub Issues: Report bugs in project repository
- Discord: Join MERN/React communities

---

## Quick Deployment Commands

### Complete Deployment Checklist

```powershell
# 1. Backend Setup
cd backend
npm install
# Create .env file with OPENAI_API_KEY
npm start  # Test locally

# 2. Frontend Setup
cd ../frontend
npm install
# Create .env file with REACT_APP_API_URL
npm start  # Test locally

# 3. Deploy Backend (Railway)
cd ../backend
railway login
railway init
railway variables set OPENAI_API_KEY=sk-...
railway up
railway domain  # Note the URL

# 4. Deploy Frontend (Vercel)
cd ../frontend
# Update .env with Railway URL
vercel login
vercel --prod

# 5. Test Production
# Open Vercel URL in browser
# Test all features
```

---

## Conclusion

Your Healthcare Translator app is now deployed and ready for use!

**Next Steps:**
1. Monitor usage and performance
2. Gather user feedback
3. Implement additional features
4. Scale as needed

**Remember:**
- Keep API keys secure
- Monitor costs
- Regular updates
- User privacy first

---

**For Questions**: Review troubleshooting section or check documentation links above.

*Healthcare Translator - Deployment Guide v1.0*
