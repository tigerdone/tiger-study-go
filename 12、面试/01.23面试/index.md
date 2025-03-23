


# 跨域服务端相关的代理
反向代理服务器

```nginx
server {
  listen 80;
  server_name your-domain.com;

  location /api {
    proxy_pass http://target-server.com;  # 转发到目标服务端
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}

```