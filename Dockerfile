# BLKOUT Liberation Platform - Production Dockerfile
# Static site with nginx

# Stage 1: Build the Vite frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set build-time env vars
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_URL

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_API_URL=$VITE_API_URL

# Build the frontend
RUN npm run build

# Stage 2: Production with Express server
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy server and API files
COPY server.cjs ./
COPY api ./api

# Copy necessary source files for API
COPY src/lib ./src/lib
COPY src/services ./src/services

# Expose port
EXPOSE 80

# Start Express server (serves static files + API routes)
CMD ["node", "server.cjs"]
