ssh $1@$2 "cd /var/www/backend && git checkout origin/develop && git pull origin develop && cd /var/www/backend && npm install && npm run build && pm2 restart all"
