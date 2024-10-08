FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json ./

RUN npm install --production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG AWS_MONGODB_URI

ARG AWS_REGION
ARG AWS_BUCKET_ACCESS_KEY_ID
ARG AWS_BUCKET_SECRET_ACCESS_KEY
ARG AWS_ASSET_BUCKET
ARG SENDGRID_API_KEY
ARG SENDGRID_INVITE_TEAM_EMAIL

ENV NEXTAUTH_SECRET $NEXTAUTH_SECRET
ENV NEXTAUTH_URL $NEXTAUTH_URL
ENV MONGODB_URI $AWS_MONGODB_URI

ENV AWS_REGION $AWS_REGION
ENV AWS_BUCKET_ACCESS_KEY_ID $AWS_BUCKET_ACCESS_KEY_ID
ENV AWS_BUCKET_SECRET_ACCESS_KEY $AWS_BUCKET_SECRET_ACCESS_KEY
ENV AWS_ASSET_BUCKET $AWS_ASSET_BUCKET
ENV SENDGRID_API_KEY $SENDGRID_API_KEY

ENV SENDGRID_INVITE_TEAM_EMAIL $SENDGRID_INVITE_TEAM_EMAIL
ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]