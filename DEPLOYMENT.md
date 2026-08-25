# DriveFuel Deployment Guide

Complete instructions for deploying DriveFuel to production.

## 🚀 Option 1: Vercel (Recommended - Easiest)

Vercel is optimized for Next.js and offers the fastest setup.

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free tier available)
- PostgreSQL database (Vercel PostgreSQL or external)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial DriveFuel commit"

# Create repository on GitHub
# Then push
git remote add origin https://github.com/yourusername/drivefuel.git
git branch -M main
git push -u origin main
```

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

### Step 3: Add Environment Variables

In Vercel dashboard, go to Settings → Environment Variables:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
DATABASE_URL=postgresql://user:password@host:5432/drivefuel
NEXTAUTH_SECRET=generate_random_string
NEXTAUTH_URL=https://yourdomain.vercel.app
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Step 4: Database Setup

**Option A: Vercel Postgres (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Create database
vercel env pull .env.local

# Get connection string from Vercel dashboard
# Add to NEXT_PUBLIC_DATABASE_URL
```

**Option B: External PostgreSQL**

Use services like:
- Railway: [railway.app](https://railway.app)
- Supabase: [supabase.com](https://supabase.com)
- Neon: [neon.tech](https://neon.tech)

### Step 5: Deploy

```bash
# Automatic deployment on push to main
# Or manually via Vercel dashboard
```

**Production URL**: `https://your-project.vercel.app`

---

## 🐳 Option 2: Docker + Docker Compose

For self-hosted or cloud deployment.

### Step 1: Create Dockerfile

```dockerfile
# Already provided in project root
# Uses multi-stage build for optimal size
```

### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/drivefuel
      - NEXTAUTH_SECRET=your_secret
      - NEXTAUTH_URL=http://localhost:3000
      - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
    depends_on:
      - postgres
    networks:
      - drivefuel-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=drivefuel
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - drivefuel-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - app
    networks:
      - drivefuel-network

volumes:
  postgres_data:

networks:
  drivefuel-network:
    driver: bridge
```

### Step 3: Build and Run

```bash
# Build image
docker build -t drivefuel:latest .

# Run with Docker Compose
docker-compose up -d

# Initialize database
docker-compose exec app npm run db:push

# Check logs
docker-compose logs -f app
```

### Step 4: Access Application

Open `http://localhost` in browser

---

## ☁️ Option 3: AWS Deployment

### Prerequisites
- AWS account with EC2 access
- SSH key pair configured

### Step 1: Launch EC2 Instance

```bash
# Connect via SSH
ssh -i "your-key.pem" ec2-user@your-instance.compute.amazonaws.com

# Update system
sudo yum update -y
sudo yum install -y nodejs npm git

# Clone repository
git clone https://github.com/yourusername/drivefuel.git
cd drivefuel

# Install dependencies
npm install

# Build
npm run build
```

### Step 2: Setup Environment

```bash
# Create .env.production
sudo nano .env.production

# Add all environment variables
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
DATABASE_URL=...
NEXTAUTH_SECRET=...
```

### Step 3: Use PM2 for Process Management

```bash
# Install PM2
npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'drivefuel',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save

# Startup on reboot
sudo env PATH=$PATH:/usr/local/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user
```

### Step 4: Setup Nginx Reverse Proxy

```bash
sudo yum install -y nginx

# Create nginx config
sudo nano /etc/nginx/conf.d/drivefuel.conf
```

```nginx
upstream app {
  server 127.0.0.1:3000;
}

server {
  listen 80;
  server_name yourdomain.com;

  location / {
    proxy_pass http://app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

```bash
# Enable and start nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Step 5: Setup SSL with Let's Encrypt

```bash
sudo yum install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

---

## 🔧 Environment Variables Checklist

### Required for All Deployments
```
✓ NEXTAUTH_SECRET - Generate with: openssl rand -base64 32
✓ NEXTAUTH_URL - Your production domain
✓ DATABASE_URL - PostgreSQL connection string
✓ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY - Google API key
```

### Optional but Recommended
```
☐ GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET - Google OAuth
☐ GITHUB_ID / GITHUB_SECRET - GitHub OAuth
☐ STRIPE_SECRET_KEY / NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - Payments
```

---

## 📊 Database Migration

### Initial Setup

```bash
# Push schema to production database
DATABASE_URL=postgresql://... npm run db:push
```

### Subsequent Migrations

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Deploy to production
DATABASE_URL=postgresql://... npx prisma migrate deploy
```

---

## 🔐 Security Checklist

- [ ] SSL/HTTPS enabled
- [ ] Environment variables not committed to git
- [ ] Database connection string using strong password
- [ ] NextAuth secret is secure (32+ character random string)
- [ ] CORS configured properly
- [ ] Database backups enabled
- [ ] Rate limiting enabled (add with middleware)
- [ ] Input validation on all API endpoints
- [ ] Secrets manager configured (AWS Secrets, HashiCorp Vault, etc.)

---

## 📈 Performance Optimization

### Database
```sql
-- Create indexes for common queries
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_trip_user ON "Trip"("userId");
CREATE INDEX idx_trip_date ON "Trip"("createdAt" DESC);
CREATE INDEX idx_fuellog_vehicle ON "FuelLog"("vehicleId");
```

### Caching
```typescript
// Enable Redis for session caching
// Update authOptions in authConfig.ts

import { RedisAdapter } from '@next-auth/redis-adapter'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
})

// Add to authOptions:
adapter: RedisAdapter(redis),
```

### CDN
```
// Images through Vercel Image Optimization
// Static assets cached with headers
Cache-Control: public, max-age=31536000, immutable
```

---

## 🚨 Troubleshooting

### Database Connection Error
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check environment variable
echo $DATABASE_URL
```

### Build Failure
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Slow Performance
```bash
# Check database
EXPLAIN ANALYZE SELECT ...;

# Check API response time
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com/api/trips
```

### OAuth Not Working
```
1. Verify redirect URIs match exactly
2. Check credentials in environment variables
3. Ensure domain matches OAuth app settings
```

---

## 📊 Monitoring

### Logs
```bash
# Vercel
vercel logs [url]

# Docker
docker logs drivefuel_app

# AWS
tail -f /var/log/pm2.log
```

### Metrics
- Monitor at:
  - Vercel Analytics Dashboard
  - AWS CloudWatch
  - Database provider dashboard

### Alerts
Setup alerts for:
- High error rates (>1%)
- Database connection failures
- API response time >1s
- Disk space <10%
- Memory usage >80%

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Automatic Testing)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npx tsc --noEmit

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: success()
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
      - uses: vercel/action@v28
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📝 Post-Deployment Checklist

- [ ] Test all features work in production
- [ ] Email notifications configured
- [ ] Database backups scheduled (daily)
- [ ] Monitoring alerts set up
- [ ] SSL certificate auto-renewal configured
- [ ] Analytics tracking enabled
- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Incident response plan documented

---

## 🎯 Next Steps

1. **Monitor** - Watch metrics for first week
2. **Optimize** - Fine-tune based on real usage
3. **Scale** - Add caching and CDN as needed
4. **Backup** - Test backup/restore procedures
5. **Security** - Regular security audits

---

## 🆘 Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [PostgreSQL Hosting](https://www.postgresql.org/support/versioning/)

---

**Your DriveFuel app is production-ready!** 🚀
