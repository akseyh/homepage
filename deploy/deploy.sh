#!/usr/bin/env bash
# Deploy the built site to a DigitalOcean droplet over SSH.
#
#   HOST=root@203.0.113.10 ./deploy/deploy.sh
#
# Optional:
#   SSH_KEY=~/.ssh/homepage_ed25519
#   REMOTE_DIR=/var/www/semsyilmaz
set -euo pipefail

HOST="${HOST:?usage: HOST=root@<droplet-ip> ./deploy/deploy.sh}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/homepage_ed25519}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/semsyilmaz}"
SSH=(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$HOST")

echo "==> building"
npm run build

echo "==> preparing server"
"${SSH[@]}" 'bash -s' <<REMOTE
set -euo pipefail
if ! command -v nginx >/dev/null 2>&1; then
  apt-get update -y
  DEBIAN_FRONTEND=noninteractive apt-get install -y nginx rsync
fi
mkdir -p "$REMOTE_DIR"
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
  ufw allow "Nginx Full" >/dev/null
fi
REMOTE

echo "==> installing nginx site"
scp -i "$SSH_KEY" deploy/nginx.conf "$HOST:/etc/nginx/sites-available/semsyilmaz"
"${SSH[@]}" 'bash -s' <<'REMOTE'
set -euo pipefail
ln -sf /etc/nginx/sites-available/semsyilmaz /etc/nginx/sites-enabled/semsyilmaz
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
REMOTE

echo "==> syncing files"
rsync -az --delete -e "ssh -i $SSH_KEY" dist/ "$HOST:$REMOTE_DIR/"

echo "==> checking"
curl -sS -o /dev/null -w "http://${HOST#*@}/ -> HTTP %{http_code}\n" "http://${HOST#*@}/"

echo "done. point the Cloudflare A record at ${HOST#*@} for semsyilmaz.com + www."
