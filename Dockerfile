# Build stage (optional if you build locally)
# FROM node:18 AS build
# WORKDIR /app
# COPY . .
# RUN npm install && npm run build

# Production stage
FROM nginx:alpine
COPY build/ /usr/share/nginx/html
EXPOSE 80
# Optional: custom nginx config for SPA routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf
