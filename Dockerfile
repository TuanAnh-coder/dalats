# ==========================================
# M_Dalats Boutique Villa - Production Dockerfile
# Optimized for Next.js 15 Standalone (Ultra-lightweight ~150MB)
# ==========================================

# 1. Base & Dependencies Stage
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm matching package.json
RUN npm install -g pnpm@11.1.3

# Copy package manifests and config
COPY package.json pnpm-lock.yaml* .npmrc* ./

# Install dependencies with frozen lockfile (ignore build scripts)
RUN pnpm install --frozen-lockfile --ignore-scripts

# 2. Builder Stage
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@11.1.3

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Enable standalone output & skip env validation during build
ENV BUILD_STANDALONE=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1

# Compile production build
RUN pnpm build

# 3. Production Runner Stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Security: Non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public static files & standalone server bundle
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/scripts/admin.mjs ./admin.mjs
COPY --from=builder --chown=nextjs:nodejs /app/scripts/admin-role.mjs ./admin-role.mjs

# Pre-create uploads directory and ensure write permissions for nextjs user
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public /app/public/uploads

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
