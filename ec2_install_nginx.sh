sudo apt update
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/default <<EOF >/dev/null
server {
    listen 80 default_server;
    location / {
        proxy_pass http://localhost:3000/;
    }
}
EOF
sudo systemctl restart nginx

# check
sudo systemctl status nginx
