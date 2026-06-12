# 🚀 A-Star Infotech - Deployment Guide

Complete guide to deploy your website to a live server with your own domain.

---

## 📋 Prerequisites

| Item | Cost | Where to Get |
|------|------|--------------|
| Domain Name | ~₹500–900/year | [GoDaddy](https://godaddy.com), [Namecheap](https://namecheap.com), [Hostinger](https://hostinger.in) |
| VPS Server | ~₹350–500/month | [Hostinger VPS](https://hostinger.in), [DigitalOcean](https://digitalocean.com), [Hetzner](https://hetzner.com) |

**Recommended:** Ubuntu 22.04 or 24.04 VPS with at least 1GB RAM

---

## 🐳 Option 1: Docker Deployment (Recommended)

### Step 1: Buy Domain & VPS

1. Buy your domain (e.g., `astarinfotech.com`)
2. Buy a VPS server (Ubuntu 22.04/24.04)
3. Note your server's **IP address**

### Step 2: Point Domain to Server

At your domain registrar (GoDaddy/Namecheap), add DNS records:

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_SERVER_IP |
| A | www | YOUR_SERVER_IP |

Wait 5–30 minutes for DNS to propagate.

### Step 3: SSH into Your Server

```bash
ssh root@YOUR_SERVER_IP
```

### Step 4: Upload Project Files

**Option A: From GitHub**
```bash
apt update && apt install -y git
git clone https://github.com/YOUR-USERNAME/astar-infotech.git /opt/astar-infotech
cd /opt/astar-infotech
```

**Option B: Upload via SCP (from your local machine)**
```bash
scp -r ./astar-infotech root@YOUR_SERVER_IP:/opt/astar-infotech
```

### Step 5: One-Click Deploy

```bash
cd /opt/astar-infotech
chmod +x deploy.sh
sudo bash deploy.sh
```

Follow the prompts — the script will:
- ✅ Install Docker & Nginx
- ✅ Build and start the container
- ✅ Seed the database
- ✅ Configure Nginx reverse proxy
- ✅ Install free SSL certificate
- ✅ Set up firewall

### Step 6: Done! 🎉

Your site is live at `https://yourdomain.com`

---

## 🔧 Option 2: Manual VPS Setup (Without Docker)

### Step 1: Install Dependencies

```bash
ssh root@YOUR_SERVER_IP

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx
apt install -y nginx
```

### Step 2: Upload & Build Project

```bash
cd /opt
git clone https://github.com/YOUR-USERNAME/astar-infotech.git
cd astar-infotech

# Install dependencies
bun install

# Set up environment
cp .env.production .env
nano .env  # Edit with your values

# Build for production
bun run build
```

### Step 3: Push Database Schema

```bash
# Update DATABASE_URL in .env to a persistent path
# DATABASE_URL=file:/opt/astar-infotech/db/production.db
bun run db:push
```

### Step 4: Seed Database (First Time Only)

```bash
# Start server temporarily
bun run start &
sleep 5

# Seed the database
curl -X POST http://localhost:3000/api/seed

# Stop the temporary server
kill %1
```

### Step 5: Start with PM2

```bash
pm2 start "bun run start" --name "astar-infotech"
pm2 save
pm2 startup
```

### Step 6: Configure Nginx

```bash
nano /etc/nginx/sites-available/astar-infotech
```

Paste:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/astar-infotech /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
```

### Step 7: Install SSL

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ☁️ Option 3: Vercel Deployment (Easiest, Free)

> ⚠️ **Note:** SQLite doesn't persist on Vercel's serverless platform. 
> For production, you'd need to switch to Vercel Postgres or PlanetScale.
> This option is best for testing/demo only.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "A-Star Infotech website"
git remote add origin https://github.com/YOUR-USERNAME/astar-infotech.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"New Project"** → Import your repo
3. Click **Deploy**
4. Go to **Settings → Environment Variables** and add:
   - `ADMIN_PASSWORD` = `astar@2024`
   - `DATABASE_URL` = (your Vercel Postgres connection string)

### Step 3: Connect Domain

1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records at your registrar as shown

---

## 🔐 Post-Deployment Checklist

- [ ] Change admin password from default
- [ ] Set up Gmail App Password for email notifications
- [ ] Test contact form
- [ ] Verify SSL (padlock icon in browser)
- [ ] Test on mobile devices
- [ ] Set up backups (see below)

---

## 🔄 Useful Commands

### Docker (Option 1)

```bash
cd /opt/astar-infotech

# View logs
docker compose logs -f

# Restart
docker compose restart

# Stop
docker compose down

# Rebuild after code update
docker compose up -d --build

# Access container shell
docker compose exec website sh
```

### PM2 (Option 2)

```bash
# View logs
pm2 logs astar-infotech

# Restart
pm2 restart astar-infotech

# Stop
pm2 stop astar-infotech

# Update code & redeploy
cd /opt/astar-infotech
git pull
bun install
bun run build
pm2 restart astar-infotech
```

---

## 💾 Database Backups

### Automatic Daily Backups

```bash
# Add to crontab
crontab -e

# Backup at 2 AM daily
0 2 * * * cp /opt/astar-infotech/db/production.db /opt/backups/production-$(date +\%Y\%m\%d).db
```

### Manual Backup

```bash
# Docker
docker compose exec website cp /app/data/production.db /app/data/backup-$(date +%Y%m%d).db

# Non-Docker
cp /opt/astar-infotech/db/production.db /opt/backups/backup-$(date +%Y%m%d).db
```

### Restore Backup

```bash
# Docker
docker compose exec website cp /app/data/backup-20250101.db /app/data/production.db
docker compose restart

# Non-Docker
cp /opt/backups/backup-20250101.db /opt/astar-infotech/db/production.db
pm2 restart astar-infotech
```

---

## 🔄 Updating the Website

### Via Admin Panel (No Code Changes)
1. Go to your website → Click ⚙️ Admin button
2. Login → Edit content → Save
3. Changes appear immediately!

### Via Code (After Making Changes)
```bash
# SSH into server
ssh root@YOUR_SERVER_IP
cd /opt/astar-infotech

# Pull latest code
git pull origin main

# Docker: rebuild
docker compose up -d --build

# Non-Docker: rebuild
bun install
bun run build
pm2 restart astar-infotech
```

---

## 📞 Troubleshooting

### Site not loading?
```bash
# Check if container/process is running
docker compose ps    # Docker
pm2 status           # PM2

# Check logs
docker compose logs  # Docker
pm2 logs             # PM2
```

### SSL certificate error?
```bash
certbot renew --force-renewal
```

### Database issues?
```bash
# Docker
docker compose exec website npx prisma db push --skip-generate

# Non-Docker
cd /opt/astar-infotech && bun run db:push
```

### Port already in use?
```bash
lsof -i :3000
kill -9 <PID>
```

---

## 📂 File Structure (Deployment Files)

```
├── Dockerfile              # Docker build configuration
├── docker-compose.yml      # Docker Compose for easy deployment
├── .dockerignore           # Files to exclude from Docker build
├── start.sh                # Production startup script
├── deploy.sh               # One-click VPS deployment script
├── .env.production         # Production environment template
├── nginx.conf              # Nginx configuration template
└── DEPLOYMENT.md           # This guide
```
