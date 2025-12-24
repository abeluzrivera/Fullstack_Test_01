FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production && npm cache clean --force

COPY tsconfig.json ./
COPY src ./src

RUN npm install -D typescript @types/node
RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package*.json ./
RUN npm install --production && npm cache clean --force

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
