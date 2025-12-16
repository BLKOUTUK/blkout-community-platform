# BLKOUT Liberation Platform - API Backend

Express.js API backend for the BLKOUT Community Platform, designed for deployment on Coolify.

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check and system status |
| `/api/admin/stats` | GET | Admin dashboard statistics |
| `/api/admin/stats-simple` | GET | Simplified admin stats (legacy) |
| `/api/admin/moderation-queue` | GET | Get pending moderation items |
| `/api/admin/moderation-queue` | POST | Process moderation action |
| `/api/admin/approve` | POST | Approve/reject content |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Required: Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Server Configuration
PORT=3001
NODE_ENV=production

# Optional: CORS Origins (comma-separated)
CORS_ORIGINS=https://blkoutuk.com,https://www.blkoutuk.com
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## Docker Deployment (Coolify)

The included Dockerfile is optimized for Coolify deployment:

```bash
# Build image
docker build -t blkout-api-backend .

# Run container
docker run -p 3001:3001 \
  -e SUPABASE_URL=your-url \
  -e SUPABASE_SERVICE_ROLE_KEY=your-key \
  blkout-api-backend
```

## Coolify Setup

1. Create new service in Coolify
2. Select "Dockerfile" as build method
3. Point to `/api-backend` directory
4. Set environment variables in Coolify dashboard
5. Configure domain: `api.blkoutuk.cloud`
6. Deploy

## Health Check

The API includes a health check endpoint at `/api/health` that returns:
- Overall system status
- Service availability
- Liberation values compliance
- Response time metrics

## Liberation Values

This API enforces BLKOUT's core values:
- **75% Creator Sovereignty**: Revenue transparency tracking
- **Democratic Governance**: Community participation metrics
- **Trauma-Informed Design**: Safe, supportive interactions
- **Community Ownership**: Full data sovereignty
