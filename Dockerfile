# ==========================================
# Stage 1: Build the React + TypeScript frontend
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Cache package dependencies
COPY package*.json ./
RUN npm ci

# Copy project files and build bundle
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Serve static bundle via Nginx Alpine
# ==========================================
FROM nginx:1.27-alpine AS runner

# Cloud Run injects $PORT (defaults to 8080)
ENV PORT=8080

# Configure Nginx template for automatic PORT envsubst
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
