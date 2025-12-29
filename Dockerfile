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
ARG VITE_SUPABASE_SERVICE_ROLE_KEY
ARG NEXT_PUBLIC_SUPABASE_URL
ARG SUPABASE_SERVICE_ROLE_KEY
ARG VITE_API_URL

# Hardcode env vars temporarily (remove after Coolify fix)
ENV VITE_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTI3NjcsImV4cCI6MjA3MTE4ODc2N30.kYQ2oFuQBGmu4V_dnj_1zDMDVsd-qpDZJwNvswzO6M0
ENV VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTYxMjc2NywiZXhwIjoyMDcxMTg4NzY3fQ.gfPHG-fLZA7Sc9vRG86cR9JgbXjDmdV9_pA_oSHIFMM
ENV NEXT_PUBLIC_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
ENV SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTYxMjc2NywiZXhwIjoyMDcxMTg4NzY3fQ.gfPHG-fLZA7Sc9vRG86cR9JgbXjDmdV9_pA_oSHIFMM
ENV VITE_API_URL=/api

# Build the frontend
RUN npm run build

# Stage 2: Production with Express server
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies + tsx for TypeScript
RUN npm ci --production && npm install tsx

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
