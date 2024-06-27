FROM node:20.15-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install --force --silent
RUN npx prisma generate
COPY . .
RUN npx nx build blog-api --prod


FROM node:20.15-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install -g pm2@latest
RUN npm install --force --only=production --silent
RUN npm install express --force
COPY --from=builder /usr/src/app/dist/apps/blog-api ./build
ENTRYPOINT ["pm2-runtime","build/main.js"]