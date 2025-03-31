FROM node:18-alpine AS builder
WORKDIR /app

# Závislosti
COPY package*.json ./
RUN npm ci

# Zkopírování zdrojového kódu a sestavení projektu
COPY . .
RUN npx prisma generate
RUN npm run build

# Produkční fáze
FROM node:18-alpine
WORKDIR /app

# Kopírování produkčních závislostí a sestaveného projektu
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Instalace pouze runtime dependencies
RUN npm ci --omit=dev

# Expozice portu aplikace
EXPOSE 3000

# Spuštění aplikace
CMD ["node", "dist/src/main.js"]
