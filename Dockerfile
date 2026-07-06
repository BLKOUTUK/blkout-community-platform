# BLKOUT Liberation Platform - Production Dockerfile
# Static site with nginx

# Stage 1: Build the Vite frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (--legacy-peer-deps for eslint peer dep mismatch)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build-time env for the Vite bundle. Only PUBLIC values belong here: the
# project URL and the publishable key (safe to expose by design). The
# service_role / secret key is NEVER baked in — it would inline into the
# public JS bundle. Server routes read it from the runtime environment
# (Coolify) in stage 2 instead.
ENV VITE_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
ENV VITE_SUPABASE_ANON_KEY=sb_publishable_cpUwnfcJuvnjrJjmLdZpXw_jJIOa8aB
ENV NEXT_PUBLIC_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
ENV VITE_API_URL=/api
ENV VITE_EVENTS_API_URL=https://events.blkoutuk.cloud
ENV VITE_NEWS_API_URL=https://news.blkoutuk.cloud
ENV VITE_IVOR_API_URL=https://ivor.blkoutuk.cloud
ENV VITE_BLOG_API_URL=https://blog.blkoutuk.cloud
ENV VITE_COMMS_API_URL=https://comms.blkoutuk.cloud
ENV VITE_CRM_API_URL=https://crm.blkoutuk.cloud

# Build the frontend
RUN npm run build

# Stage 2: Production with Express server
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies + tsx for TypeScript
RUN npm install --legacy-peer-deps --omit=dev && npm install tsx --legacy-peer-deps

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

# Start Express server with tsx for TypeScript API routes
CMD ["npx", "tsx", "server.cjs"]
