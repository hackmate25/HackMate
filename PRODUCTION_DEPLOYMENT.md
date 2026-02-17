# Production Deployment Guide

## Overview
This guide covers the necessary steps to deploy HackMate to production with optimal security, performance, and reliability.

## Backend Deployment

### Prerequisites
- Node.js 18+ (LTS)
- MongoDB Atlas cluster
- SendGrid API key
- Cloudinary account
- Environment variables configured

### Environment Setup
1. Copy `.env.example` to `.env` in the backend directory
2. Update all environment variables with production values
3. Ensure `NODE_ENV=production` is set

### Required Environment Variables
```
PORT=3000
NODE_ENV=production
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secure_jwt_secret
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@yourdomain.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Build & Deployment
```bash
# Install production dependencies
npm install --production

# Run production server
npm run prod
```

### Security Checklist
- [ ] All sensitive data in environment variables
- [ ] CORS origins whitelist configured
- [ ] JWT_SECRET is 32+ characters, randomly generated
- [ ] Rate limiting enabled on all API routes
- [ ] MongoDB indexes created for performance
- [ ] SSL/TLS enabled on production server
- [ ] Helmet security headers enabled
- [ ] HSTS header configured

### Performance Optimization
- Compression middleware enabled (gzip)
- Request logging via Morgan
- Database connection pooling configured
- Socket.IO rooms for efficient messaging
- Message limits enforced in chats

---

## Frontend Deployment

### Prerequisites
- Node.js 18+
- Vercel account (or your hosting platform)

### Build Configuration
The Vite build is optimized with:
- Code splitting for vendor libraries
- Asset optimization and compression
- Terser minification with console removal
- Lazy loading for routes (when implemented)

### Environment Setup
1. Copy `.env.example` to `.env.production` in the frontend directory
2. Set `VITE_BACKEND_URL` to your production backend URL

### Build & Deployment
```bash
# Development build
npm run build

# Production build (optimized)
npm run build:prod

# Preview production build locally
npm run preview
```

### Deployment Steps

#### Option 1: Vercel (Recommended for Next.js/Vite)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# - VITE_BACKEND_URL=https://your-api.com
```

#### Option 2: Traditional Hosting
```bash
# Build the project
npm run build:prod

# Upload dist/ folder to your server
# Configure web server to serve from dist/ directory
# Set all routes to fall back to index.html for SPA
```

### Performance Optimization
- CSS minified and optimized by Vite
- JavaScript split into chunks for better caching
- Console logs removed in production build
- Sourcemaps disabled for smaller bundle size
- React.StrictMode disabled in production
- Images should use responsive formats (WebP)

### Recommended Web Server Configuration (Nginx)
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 256;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Serve SPA
    location / {
        try_files $uri /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass https://your-backend-api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Monitoring & Maintenance

### Key Metrics to Monitor
- API response times
- Database query performance
- Error rates and error logs
- WebSocket connections count
- Message delivery latency
- User authentication success rate

### Regular Maintenance Tasks
- [ ] Monitor file storage (Cloudinary)
- [ ] Check MongoDB backups
- [ ] Review SendGrid email delivery
- [ ] Update dependencies (security patches)
- [ ] Clear old chats/messages if data storage is a concern
- [ ] Monitor JWT expiration and refresh flows

### Logging Strategy
- Development: Full console logs
- Production: Minimal logging via Morgan
- Errors: Captured and sent to monitoring service (e.g., Sentry)
- Access logs: Stored for audit trail

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer with multiple backend instances
- Implement session store (Redis) for stateless scaling
- Use MongoDB Atlas for automatic scaling

### WebSocket Scaling
- Implement Socket.IO adapter for clustering
- Use Redis adapter for communication between instances

### Caching Strategy
- Cache user profiles (5 min TTL)
- Cache tagslists/skillsets (1 hour TTL)
- Client-side caching for profile images

---

## Troubleshooting

### Backend Issues
- Check `NODE_ENV=production` is set
- Verify database URI
- Check CORS configuration
- Monitor error logs
- Verify environment variables are loaded

### Frontend Issues
- Clear browser cache
- Check API URL in environment
- Verify CORS from backend
- Check browser console for errors
- Verify static asset paths

### Socket.IO Issues
- Check JWT token format
- Verify CORS settings for WebSocket
- Monitor connection count
- Check Room membership
