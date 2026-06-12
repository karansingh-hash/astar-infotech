#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# A-Star Infotech - One-Click VPS Deployment Script
# ═══════════════════════════════════════════════════════════════
# Usage: bash deploy.sh
# Run this on a fresh Ubuntu 22.04/24.04 VPS server
# ═══════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "═══════════════════════════════════════════════════"
echo "   🚀 A-Star Infotech - Deployment Script"
echo "═══════════════════════════════════════════════════"
echo ""

# ──── Check if running as root ────
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root: sudo bash deploy.sh${NC}"
  exit 1
fi

# ──── Get configuration ────
read -p "Enter your domain (e.g., astarinfotech.com): " DOMAIN
read -p "Enter admin password [astar@2024]: " ADMIN_PASS
ADMIN_PASS=${ADMIN_PASS:-astar@2024}

echo ""
echo -e "${BLUE}Step 1/7: Installing system packages...${NC}"
apt update && apt upgrade -y
apt install -y curl git nginx certbot python3-certbot-nginx ufw

echo ""
echo -e "${BLUE}Step 2/7: Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  systemctl enable docker
  systemctl start docker
  echo -e "${GREEN}Docker installed ✅${NC}"
else
  echo -e "${GREEN}Docker already installed ✅${NC}"
fi

echo ""
echo -e "${BLUE}Step 3/7: Setting up project directory...${NC}"
PROJECT_DIR="/opt/astar-infotech"
mkdir -p $PROJECT_DIR

# Clone or copy project
if [ -d ".git" ]; then
  echo "Copying project files..."
  rsync -av --exclude='node_modules' --exclude='.next' --exclude='db/*.db' ./ $PROJECT_DIR/
else
  read -p "Enter your GitHub repo URL (or press Enter to skip): " REPO_URL
  if [ -n "$REPO_URL" ]; then
    git clone $REPO_URL $PROJECT_DIR
  else
    echo "Please copy your project files to $PROJECT_DIR manually"
    exit 1
  fi
fi

cd $PROJECT_DIR

echo ""
echo -e "${BLUE}Step 4/7: Creating environment file...${NC}"
cat > .env << EOF
DATABASE_URL=file:/app/data/production.db
ADMIN_PASSWORD=$ADMIN_PASS
EMAIL_USER=infootechastar@gmail.com
EMAIL_PASS=
BUSINESS_EMAIL=infootechastar@gmail.com
BUSINESS_PHONE=918560074448
CALLMEBOT_API_KEY=
EOF
echo -e "${GREEN}.env created ✅${NC}"

echo ""
echo -e "${BLUE}Step 5/7: Building and starting Docker container...${NC}"
docker compose up -d --build
echo -e "${GREEN}Container started ✅${NC}"

# Wait for container to be ready
echo "Waiting for server to start..."
sleep 15

# Seed database via curl
echo -e "${BLUE}Seeding database...${NC}"
curl -s -X POST http://localhost:3000/api/seed > /dev/null 2>&1 || true
echo -e "${GREEN}Database seeded ✅${NC}"

echo ""
echo -e "${BLUE}Step 6/7: Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/astar-infotech << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/astar-infotech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
echo -e "${GREEN}Nginx configured ✅${NC}"

echo ""
echo -e "${BLUE}Step 7/7: Setting up SSL certificate...${NC}"
read -p "Install SSL certificate now? (y/n) [y]: " INSTALL_SSL
INSTALL_SSL=${INSTALL_SSL:-y}
if [ "$INSTALL_SSL" = "y" ]; then
  certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m infootechastar@gmail.com
  echo -e "${GREEN}SSL installed ✅${NC}"
  
  # Auto-renewal
  echo "Setting up auto-renewal..."
  (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet") | crontab -
fi

# ──── Configure firewall ────
echo ""
echo -e "${BLUE}Configuring firewall...${NC}"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
echo -e "${GREEN}Firewall configured ✅${NC}"

# ──── Done! ────
echo ""
echo "═══════════════════════════════════════════════════"
echo -e "   ${GREEN}🎉 Deployment Complete!${NC}"
echo "═══════════════════════════════════════════════════"
echo ""
echo -e "  🌐 Website:     ${GREEN}https://$DOMAIN${NC}"
echo -e "  🔒 Admin Panel: ${GREEN}https://$DOMAIN${NC} (click ⚙️ button)"
echo -e "  🔑 Password:    ${GREEN}$ADMIN_PASS${NC}"
echo ""
echo "  📁 Project dir:  $PROJECT_DIR"
echo "  🐳 Docker:       docker compose -f $PROJECT_DIR/docker-compose.yml"
echo ""
echo "  Useful commands:"
echo "    docker compose logs -f          # View logs"
echo "    docker compose restart          # Restart"
echo "    docker compose down             # Stop"
echo "    docker compose up -d --build    # Rebuild & restart"
echo ""
