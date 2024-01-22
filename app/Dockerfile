# syntax=docker/dockerfile:1

FROM node:18-alpine AS builder
WORKDIR /build
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY --link . .
RUN pnpm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /build ./
CMD ["node", "build/"]