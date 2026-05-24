# ── Stage 1: Build ── #
FROM node:20-alpine AS builder

LABEL maintainer="DHG Platform Team"
LABEL app="dhg-enterprise-ui"

WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package.json package-lock.json* ./

# Install dependencies from public npm registry
RUN npm ci --prefer-offline

# Copy source code
COPY src/ ./src/
COPY public/ ./public/

# Build the production bundle
RUN npm run build

# ── Stage 2: Serve ── #
FROM nginx:1.25-alpine AS production

LABEL maintainer="DHG Platform Team"

EXPOSE 8080

# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config (serves on port 8080, handles SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Drop to non-root user for security
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

USER nginx

ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
