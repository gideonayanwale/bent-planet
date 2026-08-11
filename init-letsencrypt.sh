#!/bin/bash
# =============================================================
# Bent Planet — Let's Encrypt Initial Certificate Setup
# =============================================================
# This script provisions the initial TLS certificates from
# Let's Encrypt using Certbot's standalone or webroot mode
# via the Docker Compose setup.
#
# Usage:
#   chmod +x init-letsencrypt.sh
#   ./init-letsencrypt.sh
#
# Prerequisites:
#   - Docker and Docker Compose installed
#   - Domain DNS pointing to this server's IP
#   - Ports 80 and 443 open in firewall
# =============================================================

set -euo pipefail

# ── Configuration ────────────────────────────────────────────
# Change these to match your setup:
DOMAINS=(bentplanet.com www.bentplanet.com)
EMAIL="your-email@example.com"   # Used for renewal notices
STAGING=0                         # Set to 1 for testing (avoids rate limits)

DATA_PATH="./certbot"
COMPOSE_FILE="docker-compose.yml"

# ── Colors ───────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Bent Planet — TLS Certificate Setup${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# ── 1. Check if certificates already exist ───────────────────
if [ -d "$DATA_PATH/conf/live/${DOMAINS[0]}" ]; then
    echo -e "${YELLOW}⚠  Existing certificates found for ${DOMAINS[0]}.${NC}"
    read -p "   Replace existing certificates? (y/N) " decision
    if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
        echo "   Keeping existing certificates. Exiting."
        exit 0
    fi
fi

# ── 2. Create required directories ──────────────────────────
echo -e "${GREEN}→ Creating certificate directories...${NC}"
mkdir -p "$DATA_PATH/conf"
mkdir -p "$DATA_PATH/www"

# ── 3. Download recommended TLS parameters ──────────────────
if [ ! -e "$DATA_PATH/conf/options-ssl-nginx.conf" ]; then
    echo -e "${GREEN}→ Downloading recommended TLS parameters...${NC}"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
        > "$DATA_PATH/conf/options-ssl-nginx.conf"
fi

if [ ! -e "$DATA_PATH/conf/ssl-dhparams.pem" ]; then
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem \
        > "$DATA_PATH/conf/ssl-dhparams.pem"
fi

# ── 4. Create dummy certificates (so Nginx can start) ───────
echo -e "${GREEN}→ Creating dummy certificates for ${DOMAINS[0]}...${NC}"
CERT_PATH="/etc/letsencrypt/live/${DOMAINS[0]}"
mkdir -p "$DATA_PATH/conf/live/${DOMAINS[0]}"

docker compose -f "$COMPOSE_FILE" run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:1024 -days 1 \
    -keyout '$CERT_PATH/privkey.pem' \
    -out '$CERT_PATH/fullchain.pem' \
    -subj '/CN=localhost'" certbot

echo ""

# ── 5. Start Nginx with dummy certs ─────────────────────────
echo -e "${GREEN}→ Starting Nginx...${NC}"
docker compose -f "$COMPOSE_FILE" up --force-recreate -d nginx
echo ""

# ── 6. Delete dummy certificates ────────────────────────────
echo -e "${GREEN}→ Removing dummy certificates...${NC}"
docker compose -f "$COMPOSE_FILE" run --rm --entrypoint "\
    rm -rf /etc/letsencrypt/live/${DOMAINS[0]} && \
    rm -rf /etc/letsencrypt/archive/${DOMAINS[0]} && \
    rm -rf /etc/letsencrypt/renewal/${DOMAINS[0]}.conf" certbot
echo ""

# ── 7. Request real certificates ────────────────────────────
echo -e "${GREEN}→ Requesting Let's Encrypt certificates...${NC}"

# Build domain args
DOMAIN_ARGS=""
for domain in "${DOMAINS[@]}"; do
    DOMAIN_ARGS="$DOMAIN_ARGS -d $domain"
done

# Use staging server if STAGING=1
STAGING_ARG=""
if [ $STAGING != "0" ]; then
    STAGING_ARG="--staging"
    echo -e "${YELLOW}   ⚠  Using Let's Encrypt STAGING server (not production)${NC}"
fi

docker compose -f "$COMPOSE_FILE" run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
    $STAGING_ARG \
    --email $EMAIL \
    --rsa-key-size 4096 \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    $DOMAIN_ARGS" certbot

echo ""

# ── 8. Reload Nginx with real certificates ──────────────────
echo -e "${GREEN}→ Reloading Nginx with production certificates...${NC}"
docker compose -f "$COMPOSE_FILE" exec nginx nginx -s reload

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  ✓ TLS certificates installed!${NC}"
echo -e "${GREEN}  ✓ Your site is now available via HTTPS${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${YELLOW}Certificates will auto-renew via the Certbot${NC}"
echo -e "${YELLOW}container's built-in renewal timer.${NC}"
