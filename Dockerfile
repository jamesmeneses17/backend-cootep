# Etapa 1: Construcción
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Etapa 2: Ejecución para producción
FROM node:20-alpine AS runner

# Instalar fuentes necesarias para pdfmake en Alpine Linux
RUN apk add --no-cache fontconfig ttf-freefont

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/assets ./src/assets

EXPOSE 3000

CMD ["node", "dist/main.js"]
