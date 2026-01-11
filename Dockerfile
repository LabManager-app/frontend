# Production Dockerfile for Next.js frontend
FROM node:20-alpine AS builder
WORKDIR /app

# Accept NEXT_PUBLIC_* values at build time so Next.js embeds them into the client bundle
ARG NEXT_PUBLIC_USERS_SERVICE_URL
ARG NEXT_PUBLIC_PROJECTS_SERVICE_URL
ARG NEXT_PUBLIC_LABS_SERVICE_URL
ENV NEXT_PUBLIC_USERS_SERVICE_URL=${NEXT_PUBLIC_USERS_SERVICE_URL}
ENV NEXT_PUBLIC_PROJECTS_SERVICE_URL=${NEXT_PUBLIC_PROJECTS_SERVICE_URL}
ENV NEXT_PUBLIC_LABS_SERVICE_URL=${NEXT_PUBLIC_LABS_SERVICE_URL}

COPY package*.json ./
COPY pnpm-lock.yaml* ./
# Use pnpm (lockfile present) to avoid npm peer-resolution errors
RUN npm install -g pnpm \
	&& pnpm install --frozen-lockfile
COPY . .
# Build (Next will read NEXT_PUBLIC_* from ENV at build time)
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Install small runtime deps
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
EXPOSE 3000
CMD ["npm","run","start"]
