# syntax=docker/dockerfile:1

# ---- Stage 1: build the static site with Vite ----
FROM node:22-alpine AS build
WORKDIR /app

# Install deps first so this layer is cached until package files change
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Stage 2: serve the built files with nginx (runs as non-root) ----
FROM nginxinc/nginx-unprivileged:stable-alpine

LABEL org.opencontainers.image.title="3D Maze RL Agent" \
      org.opencontainers.image.description="Q-learning agent that learns to escape 3D mazes (Three.js + Vite)"

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
