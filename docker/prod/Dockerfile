FROM node:26-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:26-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts && npm rebuild bcrypt

COPY --from=builder /app/dist ./dist

EXPOSE 5501

CMD ["node", "dist/server.js"]
